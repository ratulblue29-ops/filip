import { getAuth } from '@react-native-firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from '@react-native-firebase/firestore';

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

export interface UpdateProfilePayload {
  city: string;
  aboutMe: string;
  skills: string[];
  openToWork: boolean;
  hourlyRate: string;
  photo?: string | null;
  availabilityType: 'seasonal' | 'fulltime';
  seasonLabel: string;
  startDate: Date;
  endDate: Date;
}

/* ------------------ Update Profile ------------------ */
export const updateUserProfile = async (payload: UpdateProfilePayload) => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('User not logged in');

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  await updateDoc(userRef, {
    /* -------- profile -------- */
    'profile.city': payload.city,
    ...(payload.photo && { 'profile.photo': payload.photo }),

    /* -------- worker profile -------- */
    'workerProfile.aboutMe': payload.aboutMe,
    'workerProfile.skills': payload.skills,
    'workerProfile.status': payload.openToWork,
    'workerProfile.hourlyRate':
      payload.hourlyRate !== '' ? Number(payload.hourlyRate) : null,

    /* -------- availability (time only) -------- */
    'workerProfile.availability': {
      isAvailable: payload.openToWork,
      type: payload.availabilityType,
      seasonLabel: payload.seasonLabel,
      dateRange: {
        start: Timestamp.fromDate(payload.startDate),
        end: Timestamp.fromDate(payload.endDate),
      },
    },

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
    'workerProfile.skills': roles,
    updatedAt: new Date(),
  });
};

// employer profile update
type UpdateEmployerProfilePayload = {
  photo?: string | null;
  companyName: string;
  industry: string;
  about: string;
  address: string;
  contactName: string;
  phone: string;
};

export const updateEmployerProfile = async (
  payload: UpdateEmployerProfilePayload,
) => {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error('User not logged in');
  }

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  await updateDoc(userRef, {
    ...(payload.photo && { 'profile.photo': payload.photo }),
    'profile.companyName': payload.companyName,
    'profile.industry': payload.industry,
    'profile.about': payload.about,
    'employerProfile.address': payload.address,
    'employerProfile.contactName': payload.contactName,
    'employerProfile.phone': payload.phone,

    updatedAt: new Date(),
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
export const fetchAllWorkers = async (): Promise<WorkerUser[]> => {
  try {
    const db = getFirestore();
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', 'worker'));
    const querySnapshot = await getDocs(q);

    const workers: WorkerUser[] = [];

    querySnapshot.forEach((doc: { data: () => any; id: any }) => {
      const firestoreData = doc.data() as any;
      if (firestoreData.id) {
        delete firestoreData.id;
      }
      const workerData: WorkerUser = {
        ...firestoreData,
        id: doc.id,
      };

      workers.push(workerData);
    });

    return workers;
  } catch (error) {
    console.error('Error fetching workers:', error);
    throw error;
  }
};
