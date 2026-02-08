import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { JobItem, NotificationItem } from '../@types/notificationIte.type';

export const registerFCMToken = async () => {
  const user = auth().currentUser;
  if (!user) return;

  await messaging().requestPermission();

  const token = await messaging().getToken();
  if (!token) return;

  const userRef = firestore().collection('users').doc(user.uid);

  await userRef.set(
    {
      fcmTokens: firestore.FieldValue.arrayUnion(token),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return token;
};

// get my notification

export const fetchMyNotifications = async (): Promise<
  (NotificationItem & { job?: JobItem })[]
> => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not logged in');

  const snap = await firestore()
    .collection('notifications')
    .where('toUserId', '==', user.uid)
    .get();
  const notifications: (NotificationItem & { job?: JobItem })[] = [];
  for (const doc of snap.docs) {
    const data = doc.data();
    const jobId = data?.data?.jobId;

    let job: JobItem | undefined;
    if (jobId) {
      const jobDoc = await firestore().collection('jobs').doc(jobId).get();
      if (jobDoc.exists()) {
        job = { id: jobDoc.id, ...jobDoc.data() } as JobItem;
      }
    }
    notifications.push({
      id: doc.id,
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
