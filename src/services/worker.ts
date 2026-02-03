import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from '@react-native-firebase/firestore';
import Worker from '../@types/Worker.type';
export const fetchWorkers = async (): Promise<Worker[]> => {
  const db = getFirestore();
  const q = query(
    collection(db, 'users'),
    where('roles', 'array-contains', 'worker'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc: { data: () => any; id: any }) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.profile?.name,
      role: data.workerProfile?.skills?.[0] ?? 'Worker',
      rating: data.rating ?? 0,
      reviews: data.reviews ?? 0,
      price: data.workerProfile?.hourlyRate,
      distance: '—',
      isVerified: data.verified,
      isAvailable: data.workerProfile?.status,
      bio: data.workerProfile?.aboutMe ?? '',
      tags: data.workerProfile?.skills ?? [],
      image: data.profile?.photo,
      banner: data.workerProfile?.banner ?? '',
      date: data.workerProfile?.availability?.dateRange,
      type: data.workerProfile?.availability?.type,
      location: data.profile?.city ?? '',
      seasonLabel: data.workerProfile?.availability?.seasonLabel ?? '',
    };
  });
};

export const fetchSeasonalWorkers = async (): Promise<Worker[]> => {
  const db = getFirestore();
  const q = query(
    collection(db, 'users'),
    where('roles', 'array-contains', 'worker'),
    where('workerProfile.status', '==', true),
    where('workerProfile.availability.dateRange.type', '==', 'seasonal'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc: { data: () => any; id: any }) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.profile?.name,
      role: data.workerProfile?.skills?.[0] ?? 'Worker',
      rating: data.rating ?? 0,
      reviews: data.reviews ?? 0,
      price: data.workerProfile?.hourlyRate,
      distance: '—',
      isVerified: data.verified,
      isAvailable: data.workerProfile?.status,
      bio: data.workerProfile?.aboutMe ?? '',
      tags: data.workerProfile?.skills ?? [],
      image: data.profile?.photo,
      banner: data.workerProfile?.banner ?? '',
      date: data.workerProfile?.availability?.dateRange,
      type: data.workerProfile?.availability?.type,
      location: data.profile?.city ?? '',
      seasonLabel: data.workerProfile?.availability?.seasonLabel ?? '',
    };
  });
};
