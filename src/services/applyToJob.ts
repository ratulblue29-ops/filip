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

  await runTransaction(db, async transaction => {
    const appDoc = await transaction.get(applicationRef);
    if (!appDoc.exists()) return;

    const appData = appDoc.data();
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

    // Fetch applicant profile — employer needs name + photo to identify who applied
    const userDoc = await getDoc(doc(db, 'users', app.applicantId));
    const userData = userDoc.exists() ? (userDoc.data() as any) : null;

    applications.push({
      id: appDoc.id,
      jobId: app.jobId,
      jobTitle,
      applicantId: app.applicantId,
      applicantName: userData?.profile?.name ?? 'Unknown',
      applicantPhoto: userData?.profile?.photo ?? null,
      message: app.message ?? '',
      phone: app.phone ?? '',
      email: app.email ?? '',
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