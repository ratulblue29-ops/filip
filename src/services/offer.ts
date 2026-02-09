import { getAuth } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Send Offer
export const sendOffer = async ({
  applicationId,
  jobId,
  workerId,
  rate,
  schedule,
  location,
  message,
}: {
  applicationId: string;
  jobId: string;
  workerId: string;
  rate: number;
  schedule: string;
  location: string;
  message?: string;
}) => {
  const user = await getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = firestore();
  const offerRef = db.collection('offers').doc();
  const notificationRef = db.collection('notifications').doc();

  await db.runTransaction(async tx => {
    tx.set(offerRef, {
      // offer doc
      applicationId,
      jobId,
      fromUserId: user.uid, // Sender Id
      toUserId: workerId, // Reciver Id
      rate,
      schedule,
      location,
      message: message ?? '',
      status: 'pending', // pending, accepted, declined
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    // notification to recever id
    tx.set(notificationRef, {
      toUserId: workerId,
      fromUserId: user.uid,
      type: 'OFFER_SENT',
      title: 'New Job Offer',
      body: 'You have received a new offer',
      data: {
        offerId: offerRef.id,
        applicationId,
        jobId,
      },
      isRead: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  });
  return offerRef.id;
};

// Accept Offer
export const acceptOffer = async (offerId: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = firestore();
  const offerRef = db.collection('offers').doc(offerId);
  const notifRef = db.collection('notifications').doc();

  await db.runTransaction(async tx => {
    const snap = await tx.get(offerRef);
    if (!snap.exists) throw new Error('Offer not found');

    const offer = snap.data();
    if (!offer || offer.toUserId !== user.uid)
      throw new Error('Not authorized');

    tx.update(offerRef, { status: 'accepted' });

    tx.set(notifRef, {
      toUserId: offer.fromUserId, // job owner
      fromUserId: user.uid, // worker
      type: 'OFFER_ACCEPTED',
      title: 'Offer Accepted',
      body: 'Your applicant has accepted the offer',
      data: {
        applicationId: offer.applicationId,
        jobId: offer.jobId,
      },
      isRead: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  });
};

// Decline Offer
export const declineOffer = async (offerId: string) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = firestore();
  const offerRef = db.collection('offers').doc(offerId);
  const notifRef = db.collection('notifications').doc();

  await db.runTransaction(async tx => {
    const snap = await tx.get(offerRef);
    if (!snap.exists) throw new Error('Offer not found');

    const offer = snap.data();
    if (!offer || offer.toUserId !== user.uid)
      throw new Error('Not authorized');

    tx.update(offerRef, { status: 'declined' });

    tx.set(notifRef, {
      toUserId: offer.fromUserId,
      fromUserId: user.uid,
      type: 'OFFER_DECLINED',
      title: 'Offer Declined',
      body: 'Your applicant has declined the offer',
      data: {
        applicationId: offer.applicationId,
        jobId: offer.jobId,
      },
      isRead: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  });
};

// Fetch Received Offers
export const fetchReceivedOffers = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const snap = await firestore()
    .collection('offers')
    .where('toUserId', '==', user.uid)
    // .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Fetch Sent Offers
export const fetchSentOffers = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const snap = await firestore()
    .collection('offers')
    .where('fromUserId', '==', user.uid)
    // .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
};
