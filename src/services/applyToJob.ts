import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

export const applyToJob = async (jobId: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  const db = firestore();
  const jobRef = db.collection('jobs').doc(jobId);

  const jobSnap = await jobRef.get();
  if (!jobSnap.exists) throw new Error('Job not found');

  const jobData = jobSnap.data();
  if (!jobData) throw new Error('Job data missing');

  const jobOwnerId = jobData.userId;
  if (!jobOwnerId) throw new Error('Job owner not found');

  if (jobOwnerId === user.uid) {
    throw new Error('You cannot apply to your own job');
  }

  // check already applied
  const existingSnap = await db
    .collection('jobApplications')
    .where('jobId', '==', jobId)
    .where('applicantId', '==', user.uid)
    .limit(1)
    .get();

  if (!existingSnap.empty) {
    throw new Error('You already applied to this job');
  }

  // create application
  const applicationRef = db.collection('jobApplications').doc();

  await applicationRef.set({
    jobId,
    applicantId: user.uid,
    jobOwnerId,
    status: 'pending',
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  // create notification doc
  const notifRef = db.collection('notifications').doc();

  await notifRef.set({
    toUserId: jobOwnerId,
    fromUserId: user.uid,
    type: 'JOB_APPLY',
    title: 'New Job Application',
    body: 'Someone applied for your job',
    data: {
      jobId,
      applicationId: applicationRef.id,
    },
    isRead: false,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  // push send (cloud function)
  await functions().httpsCallable('sendNotification')({
    toUserId: jobOwnerId,
    title: 'New Job Application',
    body: 'Someone applied for your job',
    payload: {
      jobId,
      applicationId: applicationRef.id,
      type: 'JOB_APPLY',
    },
  });

  return true;
};
