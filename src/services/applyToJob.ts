import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { OfferItem } from '../@types/jobApplication.type';

export const applyToJob = async (job: { id: string; userId: string }) => {
  const user = auth().currentUser;
  if (!user) {
    throw new Error('Please login to apply');
  }

  if (job.userId === user.uid) {
    throw new Error('You cannot apply to your own job');
  }

  const db = firestore();

  //already applied
  const existingSnap = await db
    .collection('jobApplications')
    .where('jobId', '==', job.id)
    .where('applicantId', '==', user.uid)
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    throw new Error('You already applied for this job');
  }

  const applicationRef = db.collection('jobApplications').doc();
  const notifRef = db.collection('notifications').doc();

  await db.runTransaction(async transaction => {
    // job application
    transaction.set(applicationRef, {
      jobId: job.id,
      applicantId: user.uid,
      jobOwnerId: job.userId,
      status: 'pending',
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    // notification
    transaction.set(notifRef, {
      toUserId: job.userId,
      fromUserId: user.uid,
      type: 'JOB_APPLY',
      title: 'New Job Application',
      body: 'Someone applied for your job',
      data: {
        jobId: job.id,
        applicationId: applicationRef.id,
      },
      isRead: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  });

  return true;
};

// fetch my application (offer)
export const fetchMyOffers = async (): Promise<OfferItem[]> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  const snap = await firestore()
    .collection('jobApplications')
    .where('applicantId', '==', user.uid)
    // .orderBy('createdAt', 'desc')
    .get();

  const offers: OfferItem[] = [];
  for (const doc of snap.docs) {
    const app = doc.data();

    const jobDoc = await firestore().collection('jobs').doc(app.jobId).get();

    if (!jobDoc.exists) continue;

    offers.push({
      id: doc.id,
      status: app.status,
      createdAt: app.createdAt,
      job: {
        id: jobDoc.id,
        ...(jobDoc.data() as any),
      },
    });
  }
  console.log('abckendoffer', offers);
  return offers;
};

// update offer status
export const updateOfferStatus = async (
  applicationId: string,
  status: 'accepted' | 'rejected',
) => {
  const db = firestore();

  // Update the offer status
  await db.collection('jobApplications').doc(applicationId).update({
    status,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  });

  // Send notification for both accepted & rejected
  const appDoc = await db
    .collection('jobApplications')
    .doc(applicationId)
    .get();
  if (!appDoc.exists) return;

  const appData = appDoc.data();
  if (!appData) return;

  const notifRef = db.collection('notifications').doc();

  if (status === 'rejected') {
    await notifRef.set({
      toUserId: appData.jobOwnerId,
      fromUserId: auth().currentUser?.uid || '',
      type: 'OFFER_REJECTED',
      title: 'Offer Rejected',
      body: 'Your applicant has rejected the offer',
      data: {
        applicationId,
        jobId: appData.jobId,
      },
      isRead: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  if (status === 'accepted') {
    await notifRef.set({
      toUserId: appData.jobOwnerId,
      fromUserId: auth().currentUser?.uid || '',
      type: 'OFFER_ACCEPTED',
      title: 'Offer Accepted',
      body: 'Your applicant has accepted the offer',
      data: {
        applicationId,
        jobId: appData.jobId,
      },
      isRead: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }
};
