import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { onSnapshot, Unsubscribe } from '@react-native-firebase/firestore';

// Credit costs per action type
export const CREDIT_COSTS = {
  ENGAGEMENT_SEASONAL: 5,
  ENGAGEMENT_DAILY: 5,
  ENGAGEMENT_FULLTIME: 5,
} as const;

// Deduct 1 credit from current user — call before creating engagement.
// Returns ledgerTransactionId for audit trail linkage.
// Throws if balance < 1 to block engagement creation.
export const deductCredit = async (engagementId: string, amount: number): Promise<string> => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  // Atomic read-modify-write — prevents race condition / double deduction
  await runTransaction(db, async tx => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) throw new Error('User not found');

    const credits = userSnap.data()?.credits ?? {
      balance: 0,
      used: 0,
      lifetimeEarned: 0,
    };

    if ((credits.balance ?? 0) < amount) {
      throw new Error('Insufficient credits...');
    }
    tx.update(userRef, {
      'credits.balance': credits.balance - amount,
      'credits.used': (credits.used ?? 0) + amount,
    });
  });

  // Write deduction to ledger and return the document id as ledgerTransactionId
  const ledgerRef = await addDoc(collection(db, 'creditTransactions'), {
    userId: user.uid,
    type: 'deduction',
    amount,
    reason: 'Engagement sent',
    engagementId,
    createdAt: serverTimestamp(),
  });

  return ledgerRef.id;
};

// Refund 1 credit to a specific user (employer).
// targetUserId: the employer who originally spent the credit.
export const refundCredit = async (
  engagementId: string,
  reason: 'worker_declined' | 'employer_withdrew' | 'expired',
  targetUserId: string,
  amount: number,
): Promise<void> => {
  const db = getFirestore();
  const userRef = doc(db, 'users', targetUserId);

  // Atomic refund
  await runTransaction(db, async tx => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) throw new Error('User not found');

    const credits = userSnap.data()?.credits ?? { balance: 0, used: 0 };

    tx.update(userRef, {
      'credits.balance': (credits.balance ?? 0) + amount,
      'credits.used': Math.max(0, (credits.used ?? 0) - amount),
    });
  });

  const reasonLabel: Record<string, string> = {
    worker_declined: 'Worker declined — credit refunded',
    employer_withdrew: 'Offer withdrawn — credit refunded',
    expired: 'Engagement expired — credit refunded',
  };

  // Write refund to ledger
  await addDoc(collection(db, 'creditTransactions'), {
    userId: targetUserId,
    type: 'refund',
    amount,
    reason: reasonLabel[reason],
    engagementId,
    createdAt: serverTimestamp(),
  });
};

// Fetch all credit transactions for current user (newest first)
export const fetchCreditTransactions = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = getFirestore();

  const q = query(
    collection(db, 'creditTransactions'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
};

// Real-time listener for credit transactions — newest first
export const subscribeCreditTransactions = (
  onUpdate: (txs: any[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');

  const db = getFirestore();

  const q = query(
    collection(db, 'creditTransactions'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    snap => {
      const txs = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
      onUpdate(txs);
    },
    (err: Error) => {
      console.error('subscribeCreditTransactions error:', err);
      onError?.(err);
    },
  );
};