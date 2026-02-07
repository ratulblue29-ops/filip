import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  serverTimestamp,
  runTransaction,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
} from '@react-native-firebase/firestore';
import { UserInfo } from '../@types/userInfo.type';
import { Job } from '../@types/job.type';

// Compute priority based on end date & visibility
const computePriority = (
  visibility: {
    priority: 'active' | 'consumed' | 'withdrawn' | 'expired';
  },
  schedule: { start: string; end: string },
) => {
  const now = new Date();
  if (!schedule?.end) return 'active';
  const end = new Date(schedule.end);

  if (visibility?.priority === 'consumed') return 'consumed';
  if (visibility?.priority === 'withdrawn') return 'withdrawn';
  if (now > end) return 'expired';

  return 'active';
};

// fetch my jobs
export const fetchMyJobs = async () => {
  const user = getAuth().currentUser;
  if (!user) return [];
  const db = getFirestore();
  const q = query(
    collection(db, 'jobs'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc: { data: () => any; id: string }) => {
    const data = doc.data();
    const priority = computePriority(
      data.visibility ?? {},
      data.schedule ?? { start: '', end: '' },
    );
    return {
      id: doc.id,
      title: data.title,
      schedule: data.schedule ?? { start: '', end: '' },
      status: priority,
      type: data.type,
      createdAt:
        data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate()
          : null,
      icon: 'cup',
    };
  });
};

// create jobs
export const createJob = async ({
  title,
  type = 'seasonal',
  description = 'No description provided.',
  bannerImage = '',
  schedule = { start: '', end: '' },
  location = [] as string[],
  rate = { amount: 0, unit: 'hour' },
  requiredSkills = [] as string[],
  positions = { total: 5, filled: 0 },
  visibility = { priority: 'active' },
  contact = { phone: '', email: '' },
  daysPerWeek = 0,
}: {
  title: string;
  type?: 'seasonal' | 'fulltime';
  description?: string;
  bannerImage?: string;
  schedule?: { start: string; end: string };
  location?: string[];
  rate?: { amount: number; unit: string };
  requiredSkills?: string[];
  positions?: { total: number; filled: number };
  visibility?: {
    priority: 'active' | 'consumed' | 'withdrawn' | 'expired';
    creditUsed?: number;
    consumed?: number;
    withdrawn?: number;
  };
  contact?: { phone: string; email: string };
  daysPerWeek?: number;
}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const jobRef = doc(collection(db, 'jobs'));

  const priority = computePriority(visibility, schedule);

  // helper: monthKey
  const getMonthKey = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`; // "2026-02"
  };

  // client requirement credit cost
  const SEASONAL_JOB_CREDIT_COST = 5;

  await runTransaction(db, async transaction => {
    const userSnap = await transaction.get(userRef);

    if (!userSnap.exists()) throw new Error('User profile not found');

    const userData = userSnap.data();
    if (!userData) throw new Error('User data undefined');

    const membershipTier: 'free' | 'basic' | 'premium' =
      userData?.membership?.tier || 'free';

    const membershipExpiry = userData?.membership?.expiresAt?.toDate?.();
    const credits = userData?.credits?.balance ?? 0;

    const now = new Date();
    const currentMonthKey = getMonthKey();

    // -----------------------------
    // Membership expiry check
    // -----------------------------
    if (
      membershipTier !== 'free' &&
      membershipExpiry &&
      now > membershipExpiry
    ) {
      throw new Error('Your membership has expired.');
    }

    // -----------------------------
    // FULLTIME JOB LOGIC (Membership-based)
    // -----------------------------
    if (type === 'fulltime') {
      if (membershipTier === 'free') {
        throw new Error(
          'Free users cannot post Full-Time jobs. Please upgrade membership.',
        );
      }

      const storedMonthKey = userData?.membership?.monthKey || currentMonthKey;

      let postedThisMonth =
        userData?.membership?.fullTimeAdsPostedThisMonth ?? 0;

      // reset monthly count if month changed
      if (storedMonthKey !== currentMonthKey) {
        postedThisMonth = 0;

        transaction.update(userRef, {
          'membership.monthKey': currentMonthKey,
          'membership.fullTimeAdsPostedThisMonth': 0,
        });
      }

      // Basic membership limit = 1
      if (membershipTier === 'basic' && postedThisMonth >= 1) {
        throw new Error(
          'You have reached your monthly Full-Time job posting limit.',
        );
      }

      // increment monthly counter
      transaction.update(userRef, {
        'membership.fullTimeAdsPostedThisMonth': postedThisMonth + 1,
      });
    }

    // -----------------------------
    // SEASONAL JOB LOGIC (Credit-based)
    // -----------------------------
    if (type === 'seasonal') {
      if (credits < SEASONAL_JOB_CREDIT_COST) {
        throw new Error('Not enough credits to post a seasonal job');
      }

      transaction.update(userRef, {
        'credits.balance': credits - SEASONAL_JOB_CREDIT_COST,
        'credits.used':
          (userData?.credits?.used || 0) + SEASONAL_JOB_CREDIT_COST,
      });
    }

    // -----------------------------
    // Job Object
    // -----------------------------
    const jobPost: any = {
      userId: user.uid,
      title: title,
      type,
      description,
      bannerImage,
      location,
      rate,
      requiredSkills,
      positions,
      visibility: {
        ...visibility,
        priority,
        creditUsed: type === 'seasonal' ? SEASONAL_JOB_CREDIT_COST : 0,
      },
      applicationsCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (type === 'seasonal') jobPost.schedule = schedule;

    if (type === 'fulltime') {
      jobPost.contact = contact;
      jobPost.daysPerWeek = daysPerWeek;
    }

    // Create the job
    transaction.set(jobRef, jobPost);
  });
};

export const fetchRecommendedJobs = async () => {
  const db = getFirestore();
  const jobsCol = collection(db, 'jobs');
  const q = query(jobsCol, orderBy('createdAt', 'desc'));
  const jobSnapshots = await getDocs(q);

  const jobsWithUserInfo = await Promise.all(
    jobSnapshots.docs.map(async (jobDoc: { data: () => any; id: any }) => {
      const jobData = jobDoc.data();
      const userRef = doc(db, 'users', jobData.userId);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : null;
      return {
        id: jobDoc.id,
        ...jobData,
        user: userData
          ? {
              id: userSnap.id,
              name: userData.profile.name,
              photo: userData.profile.photo,
              verified: userData?.profile.verified,
              email: userData.email,
              membership: userData.membership,
            }
          : null,
      };
    }),
  );

  return jobsWithUserInfo;
};

// fetch full timne jobs
export const fetchFullTimeJobs = async (): Promise<Job[]> => {
  const db = getFirestore();
  // Fetch all jobs
  const snapshot = await getDocs(collection(db, 'jobs'));
  // Map jobs + attach user info
  const jobsWithUser: Job[] = await Promise.all(
    snapshot.docs.map(async (jobDoc: { data: () => any; id: any }) => {
      const jobData = jobDoc.data();

      let user: UserInfo | null = null;

      if (jobData?.userId) {
        try {
          const userRef = doc(db, 'users', jobData.userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const u = userSnap.data();
            user = {
              id: userSnap.id,
              name: u?.profile?.name,
              photo: u?.profile?.photo,
              verified: u?.profile?.verified ?? false,
              opentowork: u?.profile?.opentowork ?? true,
              rating: u?.profile?.rating ?? 0,
              reviewsCount: u?.profile?.reviewsCount ?? 0,
            };
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: any) {
          console.warn('Failed to fetch user:', jobData.userId);
        }
      }

      return {
        id: jobDoc.id,
        ...jobData,
        user,
      };
    }),
  );

  // Filter fulltime jobs
  const fullTimeJobs = jobsWithUser.filter(job => job?.type === 'fulltime');

  // Sort newest first (safe)
  fullTimeJobs.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;

    // Firestore Timestamp safe check
    const aSec =
      typeof a.createdAt?.seconds === 'number' ? a.createdAt.seconds : 0;

    const bSec =
      typeof b.createdAt?.seconds === 'number' ? b.createdAt.seconds : 0;

    return bSec - aSec;
  });

  return fullTimeJobs;
};

// fetch seasonal jobs
export const fetchSeasonalJobs = async () => {
  const db = getFirestore();

  const q = query(
    collection(db, 'jobs'),
    where('type', '==', 'seasonal'),
    // orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);
  const results = await Promise.all(
    snap.docs.map(async (jobDoc: any) => {
      const jobData = jobDoc.data();

      let userData: any = null;

      if (jobData?.userId) {
        const userRef = doc(db, 'users', jobData.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          userData = userSnap.data();
        }
      }

      const userName =
        userData?.profile?.fullName || userData?.profile?.name || 'Unknown';

      const userCity = userData?.profile?.city || '';
      const verified = userData?.verified ?? false;
      const openToWork = userData?.settings?.openToWork ?? true;

      const locationText =
        jobData?.location?.length > 0 ? jobData.location.join(', ') : userCity;

      return {
        id: jobDoc.id,

        user: {
          id: jobData.userId,
          name: userName,
          photo: userData?.profile?.photo ?? null,
          city: userCity,
          verified,
          openToWork,
        },

        bannerImage: jobData.bannerImage ?? null,

        title: jobData.title ?? 'Seasonal Availability',

        dateRange: {
          start: jobData?.schedule?.start ?? null,
          end: jobData?.schedule?.end ?? null,
        },

        tags: jobData.requiredSkills ?? [],

        locationText,
      };
    }),
  );

  return results;
};
