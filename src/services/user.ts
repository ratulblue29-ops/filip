// services/user.ts
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

export const fetchUserRole = async () => {
    const user = getAuth().currentUser;
    if (!user) return null;

    const doc = await getFirestore()
        .collection('users')
        .doc(user.uid)
        .get();

    return doc.exists() ? doc.data()?.role ?? null : null;
};
