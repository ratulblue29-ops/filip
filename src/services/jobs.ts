
// import { getAuth } from '@react-native-firebase/auth';
// import {
//     getFirestore,
//     collection,
//     query,
//     where,
//     getDocs,
//     addDoc,
//     serverTimestamp,
// } from '@react-native-firebase/firestore';

// // Fetch jobs posted by current user
// export const fetchMyJobs = async () => {
//     const user = getAuth().currentUser;
//     if (!user) return [];

//     const q = query(
//         collection(getFirestore(), 'jobs'),
//         where('userId', '==', user.uid)
//     );

//     const snapshot = await getDocs(q);

//     return snapshot.docs.map((doc: { data: () => any; id: any; }) => {
//         const data = doc.data();
//         console.log(data)
//         return {
//             id: doc.id,
//             title: data.title,
//             schedule: data.schedule || { start: '', end: '' },
//             status: data.visibility?.priority ? 'active' : 'expired',
//             createdAt:
//                 data.createdAt && typeof data.createdAt.toDate === 'function'
//                     ? data.createdAt.toDate()
//                     : null,
//             icon: 'cup',
//         };
//     });
// };

// // Create new job 
// export const createJob = async ({
//     title,
//     type = 'seasonal',
//     description = 'No description provided.',
//     bannerImage = '',
//     schedule = { start: '', end: '' },
//     location = [] as string[],
//     rate = { amount: 0, unit: 'hour' },
//     requiredSkills = [] as string[],
//     positions = { total: 5, filled: 0 },
//     visibility = { priority: true, creditUsed: 0 },
// }: {
//     title: string;
//     type?: string;
//     description?: string;
//     bannerImage?: string;
//     schedule?: { start: string; end: string };
//     location?: string[];
//     rate?: { amount: number; unit: string };
//     requiredSkills?: string[];
//     positions?: { total: number; filled: number };
//     visibility?: { priority: boolean; creditUsed: number };
// }) => {
//     const user = getAuth().currentUser;
//     if (!user) throw new Error('User not authenticated');

//     const jobPost = {
//         userId: user.uid,
//         title,
//         type,
//         description,
//         bannerImage,
//         schedule,
//         location,
//         rate,
//         requiredSkills,
//         positions,
//         visibility,
//         applicationsCount: 0,
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//     };

//     await addDoc(collection(getFirestore(), 'jobs'), jobPost);
// };
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';

// Determine current priority based on end date
const computePriority = (visibility: any, schedule: { start: string; end: string }) => {
    const now = new Date();
    const end = new Date(schedule.end);

    // If already marked consumed or withdrawn, respect it
    if (visibility?.priority === 'consumed') return 'consumed';
    if (visibility?.priority === 'withdrawn') return 'withdrawn';

    // Expired if end date passed
    if (now > end) return 'expired';

    return 'active';
};

// Fetch jobs posted by current user
export const fetchMyJobs = async () => {
    const user = getAuth().currentUser;
    if (!user) return [];

    const q = query(
        collection(getFirestore(), 'jobs'),
        where('userId', '==', user.uid)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc: { data: () => any; id: any }) => {
        const data = doc.data();

        // Compute priority dynamically
        const priority = computePriority(data.visibility, data.schedule);

        return {
            id: doc.id,
            title: data.title,
            schedule: data.schedule || { start: '', end: '' },
            status: priority, // active | consumed | withdrawn | expired
            createdAt:
                data.createdAt && typeof data.createdAt.toDate === 'function'
                    ? data.createdAt.toDate()
                    : null,
            icon: 'cup',
        };
    });
};

// Create new job
export const createJob = async ({
    title,
    type = 'seasonal',
    description = 'No description provided.',
    bannerImage = '',
    schedule = { start: '', end: '' },
    location = [] as string[],
    rate = { amount: 0, unit: 'hour' },
    requiredSkills = [] as string[],
    positions = { total: 5, filled: 0 },
    visibility = { priority: 'active', creditUsed: 0, consumed: 0, withdrawn: 0 },
}: {
    title: string;
    type?: string;
    description?: string;
    bannerImage?: string;
    schedule?: { start: string; end: string };
    location?: string[];
    rate?: { amount: number; unit: string };
    requiredSkills?: string[];
    positions?: { total: number; filled: number };
    visibility?: { priority: 'active' | 'consumed' | 'withdrawn' | 'expired'; creditUsed: number; consumed: number; withdrawn: number };
}) => {
    const user = getAuth().currentUser;
    if (!user) throw new Error('User not authenticated');

    // Compute current priority based on end date
    const currentPriority = computePriority(visibility, schedule);

    const jobPost = {
        userId: user.uid,
        title,
        type,
        description,
        bannerImage,
        schedule,
        location,
        rate,
        requiredSkills,
        positions,
        visibility: {
            ...visibility,
            priority: currentPriority, // set computed priority
        },
        applicationsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    await addDoc(collection(getFirestore(), 'jobs'), jobPost);
};
