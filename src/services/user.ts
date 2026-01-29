import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc, getFirestore } from '@react-native-firebase/firestore';

// the role of the current user
export const fetchUserRole = async () => {
  const user = getAuth().currentUser;
  if (!user) return null;
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  return userSnap.exists() ? userSnap.data()?.role ?? null : null;
};

//  user profile
export const fetchCurrentUser = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('User not logged in');
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('User data not found');
  return userSnap.data();
};
