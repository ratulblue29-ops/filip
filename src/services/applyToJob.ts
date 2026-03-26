import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
} from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  limit,
  getDocs,
  getDoc,
  runTransaction,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { OfferItem } from '../@types/jobApplication.type';
import { sendPush } from './pushNotification';

type FullTimeApplyPayload = {
  message: string;
  phone: string;
  email: string;
  cvUrl: string | null;
};

// Singleton accessors — avoids repeated getApp() calls across functions
const getDb = () => getFirestore(getApp());
const getCurrentUser = () => getAuth(getApp()).currentUser;

export const applyToJob = async (
  job: { id: string; userId: string },
  application: { message: string; phone: string; email: string },
) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Please login to apply');

  if (job.userId === user.uid) {
    throw new Error('You cannot apply to your own job');
  }

  const db = getDb();

  // Guard: check for existing application before writing
  const existingSnap = await getDocs(
    query(
      collection(db, 'jobApplications'),
      where('jobId', '==', job.id),
      where('applicantId', '==', user.uid),
      limit(1),
    ),
  );

  if (!existingSnap.empty) {
    throw new Error('You already applied for this job');
  }

  const applicationRef = doc(collection(db, 'jobApplications'));
  const notifRef = doc(collection(db, 'notifications'));

  // Atomic write: application + notification in one transaction
  await runTransaction(db, async transaction => {
    transaction.set(applicationRef, {
      jobId: job.id,
      applicantId: user.uid,
      jobOwnerId: job.userId,
      // Contact details submitted by worker — employer uses these to reach out externally
      message: application.message,
      phone: application.phone,
      email: application.email,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

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
      createdAt: serverTimestamp(),
    });
  });

  sendPush({
    toUserId: job.userId,
    title: 'New Job Application',
    body: 'Someone applied for your job',
    type: 'JOB_APPLY',
    data: { jobId: job.id },
  });

  return true;
};

// Full-time job application — stores contact details + optional CV URL.
// No credits deducted. No in-app chat created. Employer contacts applicant directly.
export const applyToFullTimeJob = async (
  job: { id: string; userId: string },
  payload: FullTimeApplyPayload,
) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Please login to apply');
  if (job.userId === user.uid) throw new Error('You cannot apply to your own job');

  const db = getDb();
  // const userSnap = await getDoc(doc(db, 'users', user.uid));
  // const membershipTier = userSnap.data()?.membership?.tier ?? 'free';
  // if (membershipTier !== 'premium') {
  //   throw new Error('Only Premium members can apply for full-time jobs. Please upgrade.');
  // }

  const existingSnap = await getDocs(
    query(
      collection(db, 'jobApplications'),
      where('jobId', '==', job.id),
      where('applicantId', '==', user.uid),
      limit(1),
    ),
  );
  if (!existingSnap.empty) throw new Error('You already applied for this job');

  const applicationRef = doc(collection(db, 'jobApplications'));
  const notifRef = doc(collection(db, 'notifications'));

  await runTransaction(db, async transaction => {
    transaction.set(applicationRef, {
      jobId: job.id,
      applicantId: user.uid,
      jobOwnerId: job.userId,
      status: 'pending',
      message: payload.message,
      phone: payload.phone,
      email: payload.email,
      cvUrl: payload.cvUrl ?? null,
      createdAt: serverTimestamp(),
    });

    transaction.set(notifRef, {
      toUserId: job.userId,
      fromUserId: user.uid,
      type: 'JOB_APPLY',
      title: 'New Job Application',
      body: 'Someone applied for your full-time job',
      data: { jobId: job.id, applicationId: applicationRef.id },
      isRead: false,
      createdAt: serverTimestamp(),
    });
  });

  sendPush({
    toUserId: job.userId,
    title: 'New Job Application',
    body: 'Someone applied for your job',
    type: 'JOB_APPLY',
    data: { jobId: job.id },
  });

  return true;
};

// Fetch all job applications submitted by the current user
export const fetchMyOffers = async (): Promise<OfferItem[]> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not logged in');

  const db = getDb();

  const snap = await getDocs(
    query(
      collection(db, 'jobApplications'),
      where('applicantId', '==', user.uid),
    ),
  );

  const offers: OfferItem[] = [];

  for (const appDoc of snap.docs) {
    const app = appDoc.data();

    const jobDoc = await getDoc(doc(db, 'jobs', app.jobId));
    if (!jobDoc.exists()) continue;

    offers.push({
      id: appDoc.id,
      status: app.status,
      createdAt: app.createdAt,
      job: {
        id: jobDoc.id,
        ...(jobDoc.data() as any),
      },
    });
  }

  return offers;
};

// Update the status of a job application (accepted | rejected)
export const updateOfferStatus = async (
  applicationId: string,
  status: 'accepted' | 'rejected',
) => {
  const db = getDb();
  const user = getCurrentUser();

  const applicationRef = doc(db, 'jobApplications', applicationId);

  let appData: any = null;

  await runTransaction(db, async transaction => {
    const appDoc = await transaction.get(applicationRef);
    if (!appDoc.exists()) return;

    appData = appDoc.data();
    if (!appData) return;

    // Update status
    transaction.update(applicationRef, {
      status,
      updatedAt: serverTimestamp(),
    });

    // Notify the job owner of the decision
    const notifRef = doc(collection(db, 'notifications'));
    transaction.set(notifRef, {
      toUserId: appData.jobOwnerId,
      fromUserId: user?.uid ?? '',
      type: status === 'accepted' ? 'OFFER_ACCEPTED' : 'OFFER_REJECTED',
      title: status === 'accepted' ? 'Offer Accepted' : 'Offer Rejected',
      body:
        status === 'accepted'
          ? 'Your applicant has accepted the offer'
          : 'Your applicant has rejected the offer',
      data: {
        applicationId,
        jobId: appData.jobId,
      },
      isRead: false,
      createdAt: serverTimestamp(),
    });
  });
  sendPush({
    toUserId: appData?.jobOwnerId ?? '',
    title: status === 'accepted' ? 'Offer Accepted' : 'Offer Rejected',
    body: status === 'accepted'
      ? 'Your applicant has accepted the offer'
      : 'Your applicant has rejected the offer',
    type: status === 'accepted' ? 'OFFER_ACCEPTED' : 'OFFER_REJECTED',
  });
};

// Fetch all applications received by the current user (employer view)
export const fetchReceivedApplications = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not logged in');

  const db = getDb();

  const snap = await getDocs(
    query(
      collection(db, 'jobApplications'),
      where('jobOwnerId', '==', user.uid),
    ),
  );

  const applications = [];

  for (const appDoc of snap.docs) {
    const app = appDoc.data();

    // Fetch job title
    const jobDoc = await getDoc(doc(db, 'jobs', app.jobId));
    const jobTitle = jobDoc.exists() ? (jobDoc.data() as any)?.title ?? '' : '';
    const jobStatus = jobDoc.exists() ? (jobDoc.data() as any)?.visibility?.priority ?? 'active' : 'active';

    // Fetch applicant profile — employer needs name + photo to identify who applied
    const userDoc = await getDoc(doc(db, 'users', app.applicantId));
    const userData = userDoc.exists() ? (userDoc.data() as any) : null;

    applications.push({
      id: appDoc.id,
      jobId: app.jobId,
      jobOwnerId: app.jobOwnerId,
      jobTitle,
      jobStatus,
      applicantId: app.applicantId,
      applicantName: userData?.profile?.name ?? 'Unknown',
      applicantPhoto: userData?.profile?.photo ?? null,
      message: app.message ?? '',
      phone: app.phone ?? '',
      email: app.email ?? '',
      cvUrl: app.cvUrl ?? null,
      status: app.status,
      createdAt: app.createdAt,
    });
  }

  // Newest first
  return applications.sort((a, b) => {
    const aS = a.createdAt?.seconds ?? 0;
    const bS = b.createdAt?.seconds ?? 0;
    return bS - aS;
  });
};

// Hire an applicant — marks application as hired + closes the job atomically
// export const hireApplicant = async (
//   applicationId: string,
//   jobId: string,
// ): Promise<void> => {
//   const db = getDb();
//   const user = getCurrentUser();
//   if (!user) throw new Error('User not logged in');

//   await runTransaction(db, async transaction => {
//     const appRef = doc(db, 'jobApplications', applicationId);
//     const jobRef = doc(db, 'jobs', jobId);

//     transaction.update(appRef, {
//       status: 'hired',
//       updatedAt: serverTimestamp(),
//     });

//     transaction.update(jobRef, {
//       'visibility.priority': 'consumed',
//       updatedAt: serverTimestamp(),
//     });
//   });
// };
export const hireApplicant = async (
  applicationId: string,
  jobId: string,
): Promise<void> => {
  const db = getDb();
  const user = getCurrentUser();
  if (!user) throw new Error('User not logged in');

  await runTransaction(db, async transaction => {
    const appRef = doc(db, 'jobApplications', applicationId);
    const jobRef = doc(db, 'jobs', jobId);

    // get() required before any write in RN Firebase transactions
    const [appSnap, jobSnap] = await Promise.all([
      transaction.get(appRef),
      transaction.get(jobRef),
    ]);

    if (!appSnap.exists()) throw new Error('Application not found');
    if (!jobSnap.exists()) throw new Error('Job not found');

    transaction.update(appRef, {
      status: 'hired',
      updatedAt: serverTimestamp(),
    });

    transaction.update(jobRef, {
      'visibility.priority': 'consumed',
      updatedAt: serverTimestamp(),
    });
  });
};