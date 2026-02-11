
import { getApp } from '@react-native-firebase/app';

import { getAuth } from '@react-native-firebase/auth';

import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  setDoc,
  arrayUnion,
  serverTimestamp,
} from '@react-native-firebase/firestore';

import {
  getMessaging,
  getToken,
  requestPermission,
} from '@react-native-firebase/messaging';

import { JobItem, NotificationItem } from '../@types/notificationIte.type';

// Register FCM Token
export const registerFCMToken = async () => {
  const app = getApp();

  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) return;

  const messaging = getMessaging(app);
  const firestore = getFirestore(app);

  // Request notification permission
  await requestPermission(messaging);

  // Get token
  const token = await getToken(messaging);
  if (!token) return;

  const userRef = doc(firestore, 'users', user.uid);

  await setDoc(
    userRef,
    {
      fcmTokens: arrayUnion(token),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return token;
};

// Fetch My Notifications
export const fetchMyNotifications = async (): Promise<
  (NotificationItem & { job?: JobItem })[]
> => {
  const app = getApp();

  const auth = getAuth(app);
  const user = auth.currentUser;

  if (!user) throw new Error('User not logged in');

  const firestore = getFirestore(app);

  const q = query(
    collection(firestore, 'notifications'),
    where('toUserId', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);

  const notifications: (NotificationItem & { job?: JobItem })[] = [];

  for (const notificationDoc of snap.docs) {
    const data = notificationDoc.data();
    const jobId = data?.data?.jobId;

    let job: JobItem | undefined;

    if (jobId) {
      const jobRef = doc(firestore, 'jobs', jobId);
      const jobDoc = await getDoc(jobRef);

      if (jobDoc.exists()) {
        job = { id: jobDoc.id, ...jobDoc.data() } as JobItem;
      }
    }

    notifications.push({
      id: notificationDoc.id,
      toUserId: data?.toUserId ?? '',
      fromUserId: data?.fromUserId ?? '',
      type: data?.type ?? 'UNKNOWN',
      title: data?.title ?? '',
      body: data?.body ?? '',
      isRead: data?.isRead ?? false,
      createdAt: data?.createdAt ?? null,
      data: data?.data ?? {},
      job,
      jobTitle: job?.title ?? '',
      jobRate: job?.rate?.amount ?? '',
      jobUnit: job?.rate?.unit ?? '',
    });
  }

  return notifications;
};
