import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

const ADMIN_UID = 's6hdrETKNzRCalRup2ONhZZNzGu1';

// Fetches paymentEnabled flag from admin doc — single source of truth
export const fetchPaymentFlag = async (): Promise<boolean> => {
    const db = getFirestore();
    const snap = await getDoc(doc(db, 'admin', ADMIN_UID));
    if (!snap.exists()) return false;
    return snap.data()?.paymentEnabled ?? false;
};