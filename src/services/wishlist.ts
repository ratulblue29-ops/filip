// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// // wishlist create
// export const addToWishlist = async (jobId: string) => {
//     const user = auth().currentUser;
//     if (!user) throw new Error('User not logged in');

//     await firestore()
//         .collection('users')
//         .doc(user.uid)
//         .collection('wishlist')
//         .doc(jobId)
//         .set({
//             jobId,
//             createdAt: firestore.FieldValue.serverTimestamp(),
//         });

//     return true;
// };

// // delete wishlist
// export const removeFromWishlist = async (jobId: string) => {
//     const user = auth().currentUser;
//     if (!user) throw new Error('User not logged in');

//     await firestore()
//         .collection('users')
//         .doc(user.uid)
//         .collection('wishlist')
//         .doc(jobId)
//         .delete();

//     return true;
// };

// // fetchwishlist
// export const fetchWishlistIds = async (): Promise<string[]> => {
//     const user = auth().currentUser;
//     if (!user) return [];

//     const snap = await firestore()
//         .collection('users')
//         .doc(user.uid)
//         .collection('wishlist')
//         .get();

//     return snap.docs.map(doc => doc.id);
// };

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
    getDoc,
    serverTimestamp,
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';

const db = getFirestore();
const auth = getAuth();

export const addToWishlist = async (jobId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const wishlistDoc = doc(db, 'users', user.uid, 'wishlist', jobId);
    await setDoc(wishlistDoc, {
        jobId,
        createdAt: serverTimestamp(),
    });

    return true;
};

export const removeFromWishlist = async (jobId: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    const wishlistDoc = doc(db, 'users', user.uid, 'wishlist', jobId);
    await deleteDoc(wishlistDoc);

    return true;
};

export const fetchWishlistIds = async (): Promise<string[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const wishlistCol = collection(db, 'users', user.uid, 'wishlist');
    const snap = await getDocs(wishlistCol);

    return snap.docs.map((d: FirebaseFirestoreTypes.QueryDocumentSnapshot) => d.id);
};

export const fetchWishlistJobs = async (): Promise<any[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const wishlistCol = collection(db, 'users', user.uid, 'wishlist');
    const snap = await getDocs(wishlistCol);
    const jobIds: string[] = snap.docs.map(
        (d: FirebaseFirestoreTypes.QueryDocumentSnapshot) => d.id,
    );

    if (jobIds.length === 0) return [];

    const jobDocs = await Promise.all(
        jobIds.map(id => getDoc(doc(db, 'jobs', id))),
    );

    const validJobs = jobDocs
        .filter(d => d.exists())
        .map(d => ({ id: d.id, ...d.data() }));

    // Fetch user profile for each job — needed for avatar + name display
    return Promise.all(
        validJobs.map(async (job: any) => {
            if (!job.userId) return job;
            try {
                const userSnap = await getDoc(doc(db, 'users', job.userId));
                if (userSnap.exists()) {
                    const u = userSnap.data();
                    return {
                        ...job,
                        user: {
                            id: userSnap.id,
                            name: u?.profile?.fullName || u?.profile?.name || '',
                            photo: u?.profile?.photo ?? null,
                        },
                        bannerImage: job.bannerImage ?? null,
                    };
                }
            } catch {
                // user fetch failed — return job without user data
            }
            return job;
        }),
    );
};