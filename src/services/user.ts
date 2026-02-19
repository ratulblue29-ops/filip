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
import { WorkerUser } from '../@types/WorkerUser.type';
import { UserType } from '../@types/ViewProfile.type';

// The role of the current user
export const fetchUserRole = async () => {
  const user = getAuth().currentUser;
  if (!user) return null;
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  return userSnap.exists() ? userSnap.data()?.role ?? null : null;
};

// User profile
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

  const data: any = {
    'profile.city': payload.city,
    'profile.aboutMe': payload.aboutMe,
    'profile.name': payload.name,
    'profile.skills': payload.skills,
    'profile.hourlyRate':
      payload.hourlyRate !== '' ? Number(payload.hourlyRate) : null,
    'profile.experienceYears': payload.experienceYears ?? 0,
    'profile.openToWork': payload.openToWork,
    'profile.opentowork': payload.openToWork,
    updatedAt: serverTimestamp(),
  };

  if (payload.photo && payload.photo.startsWith('https://')) {
    data['profile.photo'] = payload.photo;
  }

  await updateDoc(userRef, data);
};

// Update role
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

// Fetch worker
export const fetchFullTimeJobs = async (): Promise<WorkerUser[]> => {
  const db = getFirestore();

  // Only fetch fulltime jobs
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

// get user by id

export const getUserById = async (userId: string): Promise<UserType> => {
  if (!userId) throw new Error('User ID is required');
  const db = getFirestore();
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    throw new Error('User not found');
  }

  return {
    id: snap.id,
    ...(snap.data() as Omit<UserType, 'id'>),
  };
};
