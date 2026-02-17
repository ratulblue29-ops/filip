import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from '@react-native-firebase/firestore';

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

  const engagementRef = await addDoc(collection(db, 'engagements'), {
    fromUserId: user.uid,         // employer
    workerId,                      // worker
    availabilityPostId,            // REQUIRED — strict 1:1
    status: 'pending',             // pending | accepted | declined
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
    },
    isRead: false,
    createdAt: serverTimestamp(),
  });

  return engagementRef.id;
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