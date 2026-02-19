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

// Deduct 1 credit from current user — call before creating engagement.
// Returns ledgerTransactionId for audit trail linkage.
// Throws if balance < 1 to block engagement creation.
export const deductCredit = async (engagementId: string): Promise<string> => {
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

    if ((credits.balance ?? 0) < 1) {
      throw new Error(
        'Insufficient credits. Please purchase more credits to send an engagement.',
      );
    }

    tx.update(userRef, {
      'credits.balance': credits.balance - 1,
      'credits.used': (credits.used ?? 0) + 1,
    });
  });

  // Write deduction to ledger and return the document id as ledgerTransactionId
  const ledgerRef = await addDoc(collection(db, 'creditTransactions'), {
    userId: user.uid,
    type: 'deduction',
    amount: 1,
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
): Promise<void> => {
  const db = getFirestore();
  const userRef = doc(db, 'users', targetUserId);

  // Atomic refund
  await runTransaction(db, async tx => {
    const userSnap = await tx.get(userRef);
    if (!userSnap.exists) throw new Error('User not found');

    const credits = userSnap.data()?.credits ?? { balance: 0, used: 0 };

    tx.update(userRef, {
      'credits.balance': (credits.balance ?? 0) + 1,
      'credits.used': Math.max(0, (credits.used ?? 0) - 1),
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
    amount: 1,
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