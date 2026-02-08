// import {
//   getMessaging,
//   getToken,
//   requestPermission,
// } from '@react-native-firebase/messaging';
// import auth, { getAuth } from '@react-native-firebase/auth';
// import firestore, {
//   arrayUnion,
//   doc,
//   getFirestore,
//   serverTimestamp,
//   setDoc,
// } from '@react-native-firebase/firestore';
// import { JobItem, NotificationItem } from '../@types/notificationIte.type';
// import { getApp } from '@react-native-firebase/app';

// export const registerFCMToken = async () => {
//   const app = getApp(); // Get default Firebase app
//   const auth = getAuth(app);
//   const user = auth.currentUser;

//   if (!user) return;

//   const messaging = getMessaging(app);
//   const firestore = getFirestore(app);

//   // Request notification permission (iOS / Android)
//   await requestPermission(messaging);

//   // Get FCM token
//   const token = await getToken(messaging);
//   if (!token) return;

//   // Reference to the user document
//   const userRef = doc(firestore, 'users', user.uid);

//   // Save token in Firestore
//   await setDoc(
//     userRef,
//     {
//       fcmTokens: arrayUnion(token),
//       updatedAt: serverTimestamp(),
//     },
//     { merge: true },
//   );

//   return token;
// };

// // get my notification

// export const fetchMyNotifications = async (): Promise<
//   (NotificationItem & { job?: JobItem })[]
// > => {
//   const user = auth().currentUser;
//   if (!user) throw new Error('User not logged in');

//   const snap = await firestore()
//     .collection('notifications')
//     .where('toUserId', '==', user.uid)
//     .orderBy('createdAt', 'desc')
//     .get();
//   const notifications: (NotificationItem & { job?: JobItem })[] = [];
//   for (const doc of snap.docs) {
//     const data = doc.data();
//     const jobId = data?.data?.jobId;

//     let job: JobItem | undefined;
//     if (jobId) {
//       const jobDoc = await firestore().collection('jobs').doc(jobId).get();
//       if (jobDoc.exists()) {
//         job = { id: jobDoc.id, ...jobDoc.data() } as JobItem;
//       }
//     }
//     notifications.push({
//       id: doc.id,
//       toUserId: data?.toUserId ?? '',
//       fromUserId: data?.fromUserId ?? '',
//       type: data?.type ?? 'UNKNOWN',
//       title: data?.title ?? '',
//       body: data?.body ?? '',
//       isRead: data?.isRead ?? false,
//       createdAt: data?.createdAt ?? null,
//       data: data?.data ?? {},
//       job,
//       jobTitle: job?.title ?? '',
//       jobRate: job?.rate?.amount ?? '',
//       jobUnit: job?.rate?.unit ?? '',
//     });
//   }

//   return notifications;
// };
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

// ✅ Register FCM Token
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

// ✅ Fetch My Notifications
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
