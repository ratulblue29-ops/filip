
import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
    orderBy,
} from '@react-native-firebase/firestore';

// Determine current priority based on end date
const computePriority = (
    visibility: any,
    schedule: { start: string; end: string }
) => {
    const now = new Date();
    if (!schedule?.end) return 'active';

    const end = new Date(schedule.end);
    if (visibility?.priority === 'consumed') return 'consumed';
    if (visibility?.priority === 'withdrawn') return 'withdrawn';
    if (now > end) return 'expired';

    return 'active';
};

// my jobs fetch
export const fetchMyJobs = async () => {
    const user = getAuth().currentUser;
    if (!user) return [];

    const db = getFirestore();
    const q = query(
        collection(db, 'jobs'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc: { data: () => any; id: any }) => {
        const data = doc.data();
        const priority = computePriority(data.visibility, data.schedule || { start: '', end: '' });

        return {
            id: doc.id,
            title: data.title,
            schedule: data.schedule || { start: '', end: '' },
            status: priority,
            type: data.type,
            createdAt:
                data.createdAt && typeof data.createdAt.toDate === 'function'
                    ? data.createdAt.toDate()
                    : null,
            icon: 'cup',
        };
    });
};

// create new job
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
    contact = { phone: '', email: '' },
    daysPerWeek = 0,
}: {
    title: string;
    type?: 'seasonal' | 'fulltime';
    description?: string;
    bannerImage?: string;
    schedule?: { start: string; end: string };
    location?: string[];
    rate?: { amount: number; unit: string };
    requiredSkills?: string[];
    positions?: { total: number; filled: number };
    visibility?: { priority: 'active' | 'consumed' | 'withdrawn' | 'expired'; creditUsed: number; consumed: number; withdrawn: number };
    contact?: { phone: string; email: string };
    daysPerWeek?: number;
}) => {
    const user = getAuth().currentUser;
    if (!user) throw new Error('User not authenticated');

    const currentPriority = computePriority(visibility, schedule);

    const db = getFirestore();

    const jobPost: any = {
        userId: user.uid,
        title: title || 'No Title',
        type,
        description: description || 'No description provided.',
        bannerImage,
        location,
        rate,
        requiredSkills,
        positions,
        visibility: {
            ...visibility,
            priority: currentPriority,
        },
        applicationsCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    // Only add optional fields if valid
    if (type === 'seasonal') jobPost.schedule = schedule;
    if (type === 'fulltime') {
        jobPost.contact = contact;
        jobPost.daysPerWeek = daysPerWeek;
    }

    await addDoc(collection(db, 'jobs'), jobPost);
};
