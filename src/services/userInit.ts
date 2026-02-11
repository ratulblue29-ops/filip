// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// const getMonthKey = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, '0');
//     return `${year}-${month}`;
// };

// export const ensureUserDefaults = async () => {
//     const user = auth().currentUser;
//     if (!user) return;

//     const userRef = firestore().collection('users').doc(user.uid);

//     await userRef.set(
//         {
//             membership: {
//                 tier: 'free',
//                 startedAt: null,
//                 expiresAt: null,
//                 monthKey: getMonthKey(),
//                 fullTimeAdsPostedThisMonth: 0,
//                 fullTimeAdsLimit: 0,
//             },

//             credits: {
//                 balance: 10,
//                 lifetimeEarned: 10,
//                 used: 0,
//             },

//             active: true,
//             updatedAt: firestore.FieldValue.serverTimestamp(),
//         },
//         { merge: true }
//     );
// };
