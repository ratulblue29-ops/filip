import { getAuth } from '@react-native-firebase/auth';
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from '@react-native-firebase/firestore';

// type UpdateProfilePayload = {
//   city: string;
//   aboutMe: string;
//   skills: string[];
//   openToWork: boolean;
//   hourlyRate: string;
//   photo?: string | null;
// };

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

// update profile
// export const updateUserProfile = async (payload: UpdateProfilePayload) => {
//   const user = getAuth().currentUser;
//   if (!user) throw new Error('User not logged in');

//   const db = getFirestore();
//   const userRef = doc(db, 'users', user.uid);

//   await updateDoc(userRef, {
//     'profile.city': payload.city,
//     'workerProfile.aboutMe': payload.aboutMe,
//     'workerProfile.skills': payload.skills,
//     'workerProfile.status': payload.openToWork,
//     'workerProfile.hourlyRate': payload.hourlyRate,
//     ...(payload.photo && { 'profile.photo': payload.photo }),
//     updatedAt: new Date(),
//   });
// };
export interface UpdateProfilePayload {
  city: string;
  aboutMe: string;
  skills: string[];
  openToWork: boolean;
  hourlyRate: string;
  photo?: string | null;

  // availability (TIME ONLY)
  availabilityType: 'seasonal' | 'full' | 'flexible';
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
