// services/user.ts
import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';

export const fetchUserRole = async () => {
    const user = getAuth().currentUser;
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const doc = await getFirestore()
        .collection('users')
        .doc(user.uid)
        .get();
    console.log('User role document:', doc.data());
    return doc.exists() ? doc.data()?.role ?? null : null;
};

// profile
export const fetchCurrentUser = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error('User not logged in');

    const db = getFirestore();
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) throw new Error('User data not found');

    return userSnap.data();
};