import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

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
