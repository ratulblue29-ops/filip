import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export const registerFCMToken = async () => {
    const user = auth().currentUser;
    if (!user) return null;

    await messaging().requestPermission();

    const token = await messaging().getToken();
    if (!token) return null;

    await firestore().collection('users').doc(user.uid).set(
        {
            fcmTokens: firestore.FieldValue.arrayUnion(token),
            updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
    );

    return token;
};

