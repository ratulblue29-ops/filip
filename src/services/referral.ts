// src/services/referral.ts

import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { ReferralData, ReferralItem } from '../@types/Referral.type';

const getDb = () => getFirestore();
const getCurrentUser = () => getAuth().currentUser;

// Pure: "MARLO-X7K2" — 5-char name prefix + dash + 4-char random alphanumeric
const buildReferralCode = (name: string): string => {
  const prefix = name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  const suffix = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4).padEnd(4, 'X');
  return `${prefix}-${suffix}`;
};

// Reads user's referralCode; generates + persists one if missing — idempotent
export const ensureReferralCode = async (): Promise<string> => {
  const user = getCurrentUser();
  if (!user) throw new Error('Login required');

  const db = getDb();
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) throw new Error('User not found');

  const data = snap.data();

  if (data?.referralCode) return data.referralCode as string;

  const code = buildReferralCode(data?.profile?.name ?? 'USER');
  await updateDoc(userRef, { referralCode: code });
  return code;
};

// Fetch referrals for current user.
// Lazy verification: checks referred user's profile.verified and awards +1 credit
// atomically if newly verified and credit not yet awarded.
export const fetchReferralData = async (): Promise<ReferralData> => {
  const user = getCurrentUser();
  if (!user) throw new Error('Login required');

  const db = getDb();
  const referralCode = await ensureReferralCode();

  const q = query(
    collection(db, 'referrals'),
    where('referrerId', '==', user.uid),
    orderBy('createdAt', 'desc'),
  );

  const snap = await getDocs(q);

  // Resolve each referral — parallel fetches then sequential credit awards
  const referrals: ReferralItem[] = await Promise.all(
    snap.docs.map(async (d: any) => {
      const data = d.data();

      const referredSnap = await getDoc(doc(db, 'users', data.referredId));
      const isVerified = referredSnap.data()?.profile?.verified === true;

      // Lazy credit award — atomic transaction guards against double award
      if (isVerified && !data.creditAwarded) {
        try {
          await runTransaction(db, async tx => {
            const referralRef = doc(db, 'referrals', d.id);
            const referrerRef = doc(db, 'users', user.uid);

            const [referralSnap, referrerSnap] = await Promise.all([
              tx.get(referralRef),
              tx.get(referrerRef),
            ]);

            // Guard: already awarded in a concurrent session
            if (referralSnap.data()?.creditAwarded) return;

            const credits = referrerSnap.data()?.credits ?? { balance: 0, lifetimeEarned: 0 };

            tx.update(referrerRef, {
              'credits.balance': (credits.balance ?? 0) + 1,
              'credits.lifetimeEarned': (credits.lifetimeEarned ?? 0) + 1,
            });
            tx.update(referralRef, {
              creditAwarded: true,
              status: 'verified',
            });
          });
        } catch (err) {
          // Non-fatal: credit award will retry on next fetch
          console.error('[fetchReferralData] credit award failed:', err);
        }
      }

      return {
        id: d.id,
        referredId: data.referredId as string,
        referredName: data.referredName ?? 'Unknown',
        referredPhoto: data.referredPhoto ?? null,
        status: isVerified ? 'verified' : 'pending',
        createdAt: data.createdAt,
      } satisfies ReferralItem;
    }),
  );

  return {
    referralCode,
    totalInvited: referrals.length,
    totalVerified: referrals.filter(r => r.status === 'verified').length,
    referrals,
  };
};

// Called from SignUp flow when new user enters a referral code.
// Silent no-op on invalid/duplicate codes — never blocks signup.
export const registerReferral = async (
  referralCode: string,
  newUser: { uid: string; name: string; photo: string | null },
): Promise<void> => {
  const db = getDb();
  const normalizedCode = referralCode.trim().toUpperCase();

  // Resolve referrer uid from code
  const referrerSnap = await getDocs(
    query(collection(db, 'users'), where('referralCode', '==', normalizedCode)),
  );
  if (referrerSnap.empty) return;

  const referrerId = referrerSnap.docs[0].id;
  if (referrerId === newUser.uid) return; // Self-referral guard

  // Idempotency — one referral per referred user globally
  const existingSnap = await getDocs(
    query(collection(db, 'referrals'), where('referredId', '==', newUser.uid)),
  );
  if (!existingSnap.empty) return;

  await addDoc(collection(db, 'referrals'), {
    referrerId,
    referredId: newUser.uid,
    referredName: newUser.name,
    referredPhoto: newUser.photo,
    status: 'pending',
    creditAwarded: false,
    createdAt: serverTimestamp(),
  });
};