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
  startAfter,
  limit,
} from '@react-native-firebase/firestore';
import { UserInfo } from '../@types/userInfo.type';
import { Job } from '../@types/job.type';

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

type JobType = 'seasonal' | 'fulltime';

interface CreateJobPayload {
  title: string;
  type?: JobType;
  description?: string;
  bannerImage?: string;
  schedule?: { start: string; end: string };
  location?: string[];
  rate?: { amount: number; unit: string };
  requiredSkills?: string[];
  positions?: { total: number; filled: number };
  visibility?: {
    priority?: 'active' | 'consumed' | 'withdrawn' | 'expired';
  };
  contact?: { phone: string; email: string };
  daysPerWeek?: number;
}

const jobMothlykey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const computePrioritySafe = (
  visibility?: { priority?: string },
  _schedule?: { start: string; end: string },
) => {
  return visibility?.priority ?? 'active';
};

export const createJob = async ({
  title,
  type = 'seasonal',
  description = 'No description provided.',
  bannerImage = '',
  schedule = { start: '', end: '' },
  location = [],
  rate = { amount: 0, unit: 'hour' },
  requiredSkills = [],
  positions = { total: 5, filled: 0 },
  visibility = { priority: 'active' },
  contact = { phone: '', email: '' },
  daysPerWeek = 0,
}: CreateJobPayload) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error('User not authenticated');
  if (!title.trim()) throw new Error('Job title is required');

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const jobRef = doc(collection(db, 'jobs'));

  const priority = computePrioritySafe(visibility, schedule);
  const SEASONAL_JOB_CREDIT_COST = 5;

  try {
    await runTransaction(db, async transaction => {
      const userSnap = await transaction.get(userRef);

      if (!userSnap.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userSnap.data() || {};

      const membershipTier: 'free' | 'basic' | 'premium' =
        userData?.membership?.tier ?? 'free';

      const membershipExpiry =
        userData?.membership?.expiresAt &&
        typeof userData.membership.expiresAt.toDate === 'function'
          ? userData.membership.expiresAt.toDate()
          : null;

      const credits = Number(userData?.credits?.balance ?? 0);
      const usedCredits = Number(userData?.credits?.used ?? 0);

      const now = new Date();
      const currentMonthKey = jobMothlykey();

      if (
        membershipTier !== 'free' &&
        membershipExpiry &&
        now > membershipExpiry
      ) {
        throw new Error('Your membership has expired.');
      }

      if (type === 'fulltime') {
        if (membershipTier === 'free') {
          throw new Error(
            'Free users cannot post Full-Time jobs. Please upgrade.',
          );
        }

        const storedMonthKey =
          userData?.membership?.monthKey ?? currentMonthKey;

        let postedThisMonth = Number(
          userData?.membership?.fullTimeAdsPostedThisMonth ?? 0,
        );

        if (storedMonthKey !== currentMonthKey) {
          postedThisMonth = 0;
          transaction.update(userRef, {
            'membership.monthKey': currentMonthKey,
            'membership.fullTimeAdsPostedThisMonth': 0,
          });
        }

        if (membershipTier === 'basic' && postedThisMonth >= 1) {
          throw new Error(
            'Monthly Full-Time posting limit reached (Basic plan).',
          );
        }

        transaction.update(userRef, {
          'membership.fullTimeAdsPostedThisMonth': postedThisMonth + 1,
        });
      }

      if (type === 'seasonal') {
        const newBalance = credits - SEASONAL_JOB_CREDIT_COST;

        if (newBalance < 0) {
          throw new Error('Not enough credits to post this job.');
        }

        transaction.update(userRef, {
          'credits.balance': newBalance,
          'credits.used': usedCredits + SEASONAL_JOB_CREDIT_COST,
        });
      }

      const jobPost: any = {
        userId: user.uid,
        title,
        type,
        description,
        bannerImage,
        location,
        rate,
        requiredSkills,
        positions,
        visibility: {
          priority,
          creditUsed: type === 'seasonal' ? SEASONAL_JOB_CREDIT_COST : 0,
        },
        applicationsCount: 0,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (type === 'seasonal') {
        jobPost.schedule = schedule;
      }

      if (type === 'fulltime') {
        jobPost.contact = contact;
        jobPost.daysPerWeek = daysPerWeek;
      }

      transaction.set(jobRef, jobPost);
    });

    return { success: true };
  } catch (error: any) {
    console.log('CREATE JOB FAILED FULL:', error);
    throw error;
  }
};

export const fetchRecommendedJobsPaginated = async (
  lastDoc: any = null,
  pageSize: number = 10,
) => {
  const db = getFirestore();
  const jobsCol = collection(db, 'jobs');

  let q = query(jobsCol, orderBy('createdAt', 'desc'), limit(pageSize));

  if (lastDoc) {
    q = query(
      jobsCol,
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(pageSize),
    );
  }

  const snapshot = await getDocs(q);

  const jobsWithUserInfo = await Promise.all(
    snapshot.docs.map(async (jobDoc: { data: () => any; id: any }) => {
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

  return {
    jobs: jobsWithUserInfo,
    lastDoc:
      snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
    hasMore: snapshot.docs.length === pageSize,
  };
};

export const fetchFullTimeJobs = async (): Promise<Job[]> => {
  const db = getFirestore();
  const snapshot = await getDocs(collection(db, 'jobs'));
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

  const fullTimeJobs = jobsWithUser.filter(job => job?.type === 'fulltime');

  fullTimeJobs.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;

    const aSec =
      typeof a.createdAt?.seconds === 'number' ? a.createdAt.seconds : 0;

    const bSec =
      typeof b.createdAt?.seconds === 'number' ? b.createdAt.seconds : 0;

    return bSec - aSec;
  });

  return fullTimeJobs;
};

// ✅ UPDATED: Return complete job data for chat context
export const fetchSeasonalJobs = async () => {
  const db = getFirestore();

  const q = query(collection(db, 'jobs'), where('type', '==', 'seasonal'));

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

        // ✅ ADDED: Complete schedule object for chat context
        schedule: jobData.schedule ?? { start: null, end: null },

        // ✅ ADDED: Rate data for chat context
        rate: jobData.rate ?? { amount: 0, unit: 'hour' },

        // ✅ ADDED: Location array for chat context
        location: jobData.location ?? [],

        // Keep for display
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

export const searchJobs = async (searchText: string) => {
  if (!searchText.trim()) return [];

  const db = getFirestore();
  const snapshot = await getDocs(collection(db, 'jobs'));

  const lower = searchText.toLowerCase();

  const filtered = await Promise.all(
    snapshot.docs
      .map((doc: { id: any; data: () => any }) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((job: { title: string }) =>
        job.title?.toLowerCase().includes(lower),
      )
      .slice(0, 20)
      .map(async (job: { userId: string }) => {
        if (!job.userId) return job;

        const userSnap = await getDoc(doc(db, 'users', job.userId));
        const userData = userSnap.exists() ? userSnap.data() : null;

        return {
          ...job,
          user: userData
            ? {
                id: userSnap.id,
                name: userData.profile?.name,
                photo: userData.profile?.photo,
                verified: userData.profile?.verified,
              }
            : null,
        };
      }),
  );

  return filtered;
};
