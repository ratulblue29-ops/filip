import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';
import { UpdateProfilePayload } from '../@types/UpdateProfile.type';
import { UserInfo } from '../@types/userInfo.type';

// the role of the current user
export const fetchUserRole = async () => {
  const user = getAuth().currentUser;
  if (!user) return null;
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  return userSnap.exists() ? userSnap.data()?.role ?? null : null;
};

//  user profile
export const fetchCurrentUser = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('User not logged in');
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User data not found');
  return userSnap.data();
};

// Update Profile
export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('User not logged in');
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  await updateDoc(userRef, {
    'profile.city': payload.city,
    ...(payload.photo && { 'profile.photo': payload.photo }),

    'profile.aboutMe': payload.aboutMe,
    'profile.skills': payload.skills,
    'profile.hourlyRate':
      payload.hourlyRate !== '' ? Number(payload.hourlyRate) : null,
    'profile.experienceYears': payload.experienceYears ?? 0,
    'profile.openToWork': payload.openToWork,
    updatedAt: serverTimestamp(),
  });
};


// update role
export const updateUserRoles = async (roles: string[]) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('User not logged in');

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  await updateDoc(userRef, {
    'profile.skills': roles,
    updatedAt: serverTimestamp(),
  });
};



// fetch worker
interface WorkerUser {
  id: string;
  email?: string;
  profile?: {
    name?: string;
    photo?: string;
    city?: string;
  };
  workerProfile?: {
    aboutMe?: string;
    skills?: string[];
    hourlyRate?: number;
    openToWork?: boolean;
    baseCity?: string;
    experienceYears?: number;
    rating?: number;
    reviewsCount?: number;
    availability?: {
      type: string;
      isAvailable: boolean;
      seasonLabel: string;
      dateRange: {
        start: any;
        end: any;
      };
    };
  };
  role?: string;
  roles?: string[];
  verified?: boolean;
}


export const fetchFullTimeJobs = async (): Promise<WorkerUser[]> => {
  const db = getFirestore();

  // Only fetch fulltime jobs (optimized)
  const q = query(
    collection(db, 'jobs'),
    where('type', '==', 'fulltime'),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(q);

  const jobsWithUser: WorkerUser[] = await Promise.all(
    snapshot.docs.map(async (jobDoc: any) => {
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
              name: u?.profile?.fullName || u?.profile?.name || '',
              photo: u?.profile?.photo ?? null,
            };
          }
        } catch {
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

  return jobsWithUser;
};