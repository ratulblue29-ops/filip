import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from '@react-native-firebase/firestore';
import Worker from '../@types/Worker.type';

export const fetchWorkers = async (): Promise<Worker[]> => {
  const db = getFirestore();

  const q = query(
    collection(db, 'users'),
    where('profile.opentowork', '==', true),
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc: any) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.profile?.fullName || data.profile?.name || '',
      role: data.profile?.skills?.[0] ?? 'Worker',

      rating: data.stats?.rating ?? 0,
      reviews: data.stats?.reviewsCount ?? 0,

      price: data.profile?.hourlyRate ?? 0,
      distance: '—',

      isVerified: data.verified ?? false,
      isAvailable: data.settings?.openToWork ?? true,

      bio: data.profile?.aboutMe ?? '',
      tags: data.profile?.skills ?? [],

      image: data.profile?.photo ?? null,
      banner: data.profile?.bannerImage ?? null,

      location: data.profile?.city ?? '',
    };
  });
};

export const fetchSeasonalWorkers = async (): Promise<Worker[]> => {
  const db = getFirestore();

  const q = query(
    collection(db, 'jobs'),
    where('type', '==', 'seasonal'),
    where('visibility.priority', '==', 'active'),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);

  return snap.docs.map((doc: any) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.title || 'Seasonal Worker',

      role: data.requiredSkills?.[0] ?? 'Seasonal Worker',

      rating: 0,
      reviews: 0,

      price: data.rate?.amount ?? 0,
      distance: '—',

      isVerified: false,
      isAvailable: true,

      bio: data.description ?? '',
      tags: data.requiredSkills ?? [],

      image: null,
      banner: data.bannerImage ?? null,

      date: data.schedule ?? null,
      type: data.type ?? 'seasonal',

      location: data.location?.[0] ?? '',
      seasonLabel: data.title ?? '',
    };
  });
};