// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import messaging from '@react-native-firebase/messaging';

// export const registerFCMToken = async () => {
//     const user = auth().currentUser;
//     if (!user) return null;

//     await messaging().requestPermission();

//     const token = await messaging().getToken();
//     if (!token) return null;

//     await firestore().collection('users').doc(user.uid).set(
//         {
//             fcmTokens: firestore.FieldValue.arrayUnion(token),
//             updatedAt: firestore.FieldValue.serverTimestamp(),
//         },
//         { merge: true }
//     );

//     return token;
// };
import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp, arrayUnion } from '@react-native-firebase/firestore';
import { getMessaging, requestPermission, getToken } from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

export const registerFCMToken = async () => {
    const app = getApp();

    const auth = getAuth(app);
    const db = getFirestore(app);
    const messaging = getMessaging(app);

    const user = auth.currentUser;
    if (!user) return null;

    if (Platform.OS === 'android' && Platform.Version >= 33) {
        const { PermissionsAndroid } = require('react-native');
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
    }
    await requestPermission(messaging);

    const token = await getToken(messaging);
    if (!token) return null;

    await setDoc(
        doc(db, 'users', user.uid),
        {
            fcmTokens: [token],
            updatedAt: serverTimestamp(),
        },
        { merge: true },
    );

    return token;
};
