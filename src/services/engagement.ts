import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  runTransaction,
} from '@react-native-firebase/firestore';
import { deductCredit, refundCredit } from './credit';
import { getApp } from '@react-native-firebase/app';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';
import { CREDIT_COSTS } from './credit';
import { createEngagementChat } from './chat';
import { sendPush } from './pushNotification';

// Fetch active availability posts for a specific worker (employer calls this)
export const fetchWorkerActivePosts = async (workerId: string) => {
  const db = getFirestore();

  const q = query(
    collection(db, 'jobs'),
    where('userId', '==', workerId),
    where('visibility.priority', '==', 'active'),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);

  return snap.docs.map((d: any) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? '',
      type: data.type ?? 'seasonal',
      rate: data.rate ?? { amount: 0, unit: 'hour' },
      location: data.location ?? [],
      schedule: data.schedule ?? null,
    };
  });
};

// Create a single engagement — strictly 1:1 with one availability post
export const createEngagement = async (
  workerId: string,
  availabilityPostId: string,
) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  if (user.uid === workerId) throw new Error('Cannot engage yourself');

  const db = getFirestore();

  // Prevent duplicate engagement for same post
  const existingQ = query(
    collection(db, 'engagements'),
    where('fromUserId', '==', user.uid),
    where('workerId', '==', workerId),
    where('availabilityPostId', '==', availabilityPostId),
  );

  const existingSnap = await getDocs(existingQ);
  if (!existingSnap.empty) {
    throw new Error('You already sent an engagement for this post');
  }

  const postRef = doc(db, 'jobs', availabilityPostId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) throw new Error('Availability post not found');
  const postPriority = postSnap.data()?.visibility?.priority;
  if (postPriority !== 'active') {
    throw new Error('This availability post is no longer accepting engagements');
  }

  // Resolve credit cost based on post type — seasonal costs more
  const postType: string = postSnap.data()?.type ?? 'seasonal';
  const creditCost =
    postType === 'seasonal'
      ? CREDIT_COSTS.ENGAGEMENT_SEASONAL
      : postType === 'daily'
      ? CREDIT_COSTS.ENGAGEMENT_DAILY
      : CREDIT_COSTS.ENGAGEMENT_FULLTIME;

  // Deduct credits — throws if balance insufficient, blocking engagement creation
  await deductCredit('pre-check', creditCost);

  const engagementRef = await addDoc(collection(db, 'engagements'), {
    fromUserId: user.uid,       // employer
    workerId,                    // worker
    availabilityPostId,          // REQUIRED — strict 1:1
    creditCost,                  // stored for exact refund on decline/withdraw
    availabilityType: postType,
    status: 'pending',           // pending | accepted | declined | withdrawn
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Notification to worker
  await addDoc(collection(db, 'notifications'), {
    toUserId: workerId,
    fromUserId: user.uid,
    type: 'ENGAGEMENT_SENT',
    title: 'New Engagement Request',
    body: 'An employer wants to engage you',
    data: {
      engagementId: engagementRef.id,
      availabilityPostId,
      workerId,
    },
    isRead: false,
    createdAt: serverTimestamp(),
  });

  await createEngagementChat(
    engagementRef.id,
    user.uid,
    workerId,
    availabilityPostId,
    postSnap.data()?.title ?? 'Job',
  );
  sendPush({
    toUserId: workerId,         // use whatever param name exists in that function
    title: 'New Engagement Request',
    body: 'Someone wants to engage with you',
    type: 'ENGAGEMENT_CREATED',
  });

  return engagementRef.id;
};

// Update engagement status + handle credit refund automatically
// accepted = no refund | declined = refund to employer | withdrawn = refund to employer
export const updateEngagementStatus = async (
  engagementId: string,
  status: 'accepted' | 'declined' | 'withdrawn',
  fromUserId: string,
  workerId?: string,
): Promise<void> => {
  const db = getFirestore();
  const engRef = doc(db, 'engagements', engagementId);

  if (status === 'accepted') {
    await runTransaction(db, async tx => {
      const engSnap = await tx.get(engRef);
      if (!engSnap.exists()) throw new Error('Engagement not found');

      const engData = engSnap.data();
      if (engData?.status !== 'pending') {
        throw new Error('Only pending engagements can be accepted');
      }

      const jobRef = doc(db, 'jobs', engData.availabilityPostId);
      const jobSnap = await tx.get(jobRef);

      if (!jobSnap.exists()) throw new Error('Availability post not found');
      if (jobSnap.data()?.visibility?.priority !== 'active') {
        throw new Error('This availability post is no longer available');
      }

      tx.update(engRef, { status: 'accepted', updatedAt: serverTimestamp() });

      // Mark job consumed — auto-removes from feed, blocks new engagements
      tx.update(jobRef, {
        'visibility.priority': 'consumed',
        acceptedEmployerId: engData.fromUserId,
        updatedAt: serverTimestamp(),
      });

      if (workerId) {
        // const chatId = [fromUserId, workerId].sort().join('_');
        const chatId = engagementId;
        const chatRef = doc(db, 'chats', chatId);
        tx.update(chatRef, {
          offerStatus: 'Accepted',
          updatedAt: serverTimestamp(),
        });
      }

      // Notify employer — engagement accepted
      const currentUser = getAuth().currentUser;
      const acceptNotifRef = doc(collection(db, 'notifications'));
      tx.set(acceptNotifRef, {
        toUserId: fromUserId,
        fromUserId: currentUser?.uid ?? workerId ?? '',
        type: 'ENGAGEMENT_ACCEPTED',
        title: 'Engagement Accepted',
        body: 'A worker has accepted your engagement request',
        data: { engagementId },
        isRead: false,
        createdAt: serverTimestamp(),
      });
    });

    sendPush({
      toUserId: fromUserId,
      title: 'Engagement Accepted',
      body: 'A worker has accepted your engagement request',
      type: 'ENGAGEMENT_ACCEPTED',
    });
    return;
  }

  if (status === 'withdrawn') {
    const engSnap = await getDoc(engRef);
    if (!engSnap.exists()) throw new Error('Engagement not found');
    if (engSnap.data()?.status === 'accepted') {
      throw new Error('Cannot withdraw an already accepted engagement');
    }
  }

  // Read creditCost for exact refund — stored at engagement creation
  const engSnapForRefund = await getDoc(engRef);
  const creditCostToRefund: number = engSnapForRefund.data()?.creditCost ?? 2;

  if (status === 'declined') {
    const currentUser = getAuth().currentUser;

    // Notify employer — engagement declined (before delegating to cloud function)
    if (currentUser) {
      await addDoc(collection(db, 'notifications'), {
        toUserId: fromUserId,
        fromUserId: currentUser.uid,
        type: 'ENGAGEMENT_DECLINED',
        title: 'Engagement Declined',
        body: 'A worker has declined your engagement request',
        data: { engagementId },
        isRead: false,
        createdAt: serverTimestamp(),
      });
    }

    // Refund + status update handled server-side via cloud function
    const functions = getFunctions(getApp(), 'us-central1');
    const declineEngagement = httpsCallable(functions, 'declineEngagement');
    await declineEngagement({ engagementId });
    sendPush({
      toUserId: fromUserId,
      title: 'Engagement Declined',
      body: 'A worker has declined your engagement request',
      type: 'ENGAGEMENT_DECLINED',
    });
    return;
  }

  await updateDoc(engRef, { status, updatedAt: serverTimestamp() });

  if (status === 'withdrawn') {
    // Employer refunds themselves — client-side write to own doc is allowed by Firestore rules
    await refundCredit(engagementId, 'employer_withdrew', fromUserId, creditCostToRefund);
  }

    sendPush({
    toUserId: fromUserId,
    title: 'Engagement Withdrawn',
    body: 'An employer has withdrawn their engagement request',
    type: 'ENGAGEMENT_WITHDRAWN',
  });
};

// Fetch engagements received by current user (worker view)
export const fetchReceivedEngagements = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = getFirestore();

  const q = query(
    collection(db, 'engagements'),
    where('workerId', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
};

// Fetch engagements sent by current user (employer view)
export const fetchSentEngagements = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = getFirestore();

  const q = query(
    collection(db, 'engagements'),
    where('fromUserId', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
};