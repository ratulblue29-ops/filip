import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const REVIEW_WINDOW_DAYS = 7;

// Check if an accepted engagement is eligible for review by current user
// Returns the engagement if eligible, null otherwise
export const getReviewEligibleEngagement = async (
  engagements: any[],
): Promise<any | null> => {
  const user = getAuth().currentUser;
  if (!user) return null;

  const db = getFirestore();
  const now = new Date();

  for (const eng of engagements) {
    if (eng.status !== 'accepted') continue;

    const isEmployer = eng.fromUserId === user.uid;
    const isWorker = eng.workerId === user.uid;

    // Already reviewed by this user
    if (isEmployer && eng.reviewedByEmployer) continue;
    if (isWorker && eng.reviewedByWorker) continue;

    // Fetch the job to get schedule.end
    const jobSnap = await getDoc(doc(db, 'jobs', eng.availabilityPostId));
    if (!jobSnap.exists()) continue;

    const scheduleEnd = jobSnap.data()?.schedule?.end;
    if (!scheduleEnd) continue;

    const endDate = new Date(scheduleEnd);

    // Job must be expired (past end date)
    if (now <= endDate) continue;

    // Must be within 7-day review window
    const windowExpiry = new Date(endDate.getTime() + REVIEW_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    if (now > windowExpiry) continue;

    return { engagement: eng, jobData: jobSnap.data() };
  }

  return null;
};

// Submit a review — marks engagement flag + writes review doc
// export const submitReview = async (
//   engagementId: string,
//   toUserId: string,
//   rating: number,
//   text: string,
//   role: 'employer' | 'worker', // current user's role in this engagement
// ): Promise<void> => {
//   const user = getAuth().currentUser;
//   if (!user) throw new Error('Login required');

//   const db = getFirestore();

//   // Write review
//   await addDoc(collection(db, 'reviews'), {
//     engagementId,
//     fromUserId: user.uid,
//     toUserId,
//     rating,
//     text,
//     isRevealed: false, // revealed after both submit or window expires
//     status: rating <= 2 ? 'pending' : 'approved',
//     createdAt: serverTimestamp(),
//   });

//   // Mark engagement as reviewed by this role
//   const engRef = doc(db, 'engagements', engagementId);
//   const flagField = role === 'employer' ? 'reviewedByEmployer' : 'reviewedByWorker';
//   await updateDoc(engRef, { [flagField]: true });

//   // Check if both sides reviewed — if yes, reveal both
//   const engSnap = await getDoc(engRef);
//   const engData = engSnap.data();
//   const bothReviewed =
//     (role === 'employer' && engData?.reviewedByWorker) ||
//     (role === 'worker' && engData?.reviewedByEmployer);

//   // if (bothReviewed) {
//   //   // Reveal all reviews for this engagement
//   //   const reviewsSnap = await getDocs(
//   //     query(collection(db, 'reviews'), where('engagementId', '==', engagementId)),
//   //   );
//   //   // const batch = reviewsSnap.docs.map((d: any) =>
//   //   //   updateDoc(doc(db, 'reviews', d.id), { isRevealed: true }),
//   //   // );
//   //   const batch = reviewsSnap.docs
//   //     .filter((d: any) => d.data().status === 'approved') // never auto-reveal pending reviews
//   //     .map((d: any) => updateDoc(doc(db, 'reviews', d.id), { isRevealed: true })
//   //   );
//   //   await Promise.all(batch);
//   // }
//   if (bothReviewed) {
//     // Split into two queries Firestore can evaluate at rule level
//     const [asFromSnap, asToSnap] = await Promise.all([
//       getDocs(query(
//         collection(db, 'reviews'),
//         where('engagementId', '==', engagementId),
//         where('fromUserId', '==', user.uid),
//       )),
//       getDocs(query(
//         collection(db, 'reviews'),
//         where('engagementId', '==', engagementId),
//         where('toUserId', '==', user.uid),
//       )),
//     ]);

//     const allDocs = [...asFromSnap.docs, ...asToSnap.docs];

//     const batch = allDocs
//       .filter((d: any) => d.data().status === 'approved')
//       .map((d: any) => updateDoc(doc(db, 'reviews', d.id), { isRevealed: true }));

//     await Promise.all(batch);
//   }

//   // Update user aggregate rating
//   if (rating > 2) {
//     await recalculateUserRating(toUserId);
//   }
// };
export const submitReview = async (
  engagementId: string,
  toUserId: string,
  rating: number,
  text: string,
  role: 'employer' | 'worker',
): Promise<void> => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Login required');
  const db = getFirestore();

  try {
    console.log('[REVIEW] Step 1: addDoc');
    await addDoc(collection(db, 'reviews'), {
      engagementId,
      fromUserId: user.uid,
      toUserId,
      rating,
      text,
      isRevealed: false,
      status: rating <= 2 ? 'pending' : 'approved',
      createdAt: serverTimestamp(),
    });
    console.log('[REVIEW] Step 1: OK');
  } catch (e) { throw new Error(`Step 1 addDoc failed: ${e}`); }

  try {
    console.log('[REVIEW] Step 2: updateDoc engagement');
    const engRef = doc(db, 'engagements', engagementId);
    const flagField = role === 'employer' ? 'reviewedByEmployer' : 'reviewedByWorker';
    await updateDoc(engRef, { [flagField]: true });
    console.log('[REVIEW] Step 2: OK');
  } catch (e) { throw new Error(`Step 2 updateDoc engagement failed: ${e}`); }

  const engRef = doc(db, 'engagements', engagementId);

  try {
    console.log('[REVIEW] Step 3: getDoc engagement');
    const engSnap = await getDoc(engRef);
    const engData = engSnap.data();
    console.log('[REVIEW] Step 3: OK', engData);

    const bothReviewed =
      (role === 'employer' && engData?.reviewedByWorker) ||
      (role === 'worker' && engData?.reviewedByEmployer);

    console.log('[REVIEW] bothReviewed:', bothReviewed);

    if (bothReviewed) {
      try {
        console.log('[REVIEW] Step 4: reveal queries');
        const [asFromSnap, asToSnap] = await Promise.all([
          getDocs(query(
            collection(db, 'reviews'),
            where('engagementId', '==', engagementId),
            where('fromUserId', '==', user.uid),
          )),
          getDocs(query(
            collection(db, 'reviews'),
            where('engagementId', '==', engagementId),
            where('toUserId', '==', user.uid),
          )),
        ]);
        console.log('[REVIEW] Step 4: OK, docs:', asFromSnap.docs.length, asToSnap.docs.length);

        const allDocs = [...asFromSnap.docs, ...asToSnap.docs];
        const batch = allDocs
          .filter((d: any) => d.data().status === 'approved')
          .map((d: any) => updateDoc(doc(db, 'reviews', d.id), { isRevealed: true }));

        await Promise.all(batch);
        console.log('[REVIEW] Step 4 batch update: OK');
      } catch (e) { throw new Error(`Step 4 reveal failed: ${e}`); }
    }
  } catch (e) { throw new Error(`Step 3 getDoc failed: ${e}`); }

  try {
    console.log('[REVIEW] Step 5: recalculate rating, rating=', rating);
    if (rating > 2) {
      await recalculateUserRating(toUserId);
    }
    console.log('[REVIEW] Step 5: OK');
  } catch (e) { throw new Error(`Step 5 recalculate failed: ${e}`); }
};

// Recalculate and update user's average rating + reviewsCount
// const recalculateUserRating = async (userId: string): Promise<void> => {
//   const db = getFirestore();

//   const snap = await getDocs(
//     query(
//       collection(db, 'reviews'),
//       where('toUserId', '==', userId),
//       // where('isRevealed', '==', true),
//       where('status', '==', 'approved'),
//     ),
//   );

//   if (snap.empty) return;

//   const total = snap.docs.reduce((sum: number, d: any) => sum + (d.data().rating ?? 0), 0);
//   const avg = parseFloat((total / snap.docs.length).toFixed(1));
//   await updateDoc(doc(db, 'users', userId), {
//     'profile.rating': avg,
//     'profile.reviewsCount': snap.docs.length,
//   });
// };
const recalculateUserRating = async (userId: string): Promise<void> => {
  const db = getFirestore();

  console.log('[RECALC] querying for userId:', userId);

  const snap = await getDocs(
    query(
      collection(db, 'reviews'),
      where('toUserId', '==', userId),
      where('status', '==', 'approved'),
    ),
  );

  console.log('[RECALC] snap size:', snap.size);

  if (snap.empty) {
    console.log('[RECALC] no approved reviews found, returning');
    return;
  }

  const total = snap.docs.reduce((sum: number, d: any) => sum + (d.data().rating ?? 0), 0);
  const avg = parseFloat((total / snap.docs.length).toFixed(1));

  console.log('[RECALC] avg:', avg, 'count:', snap.docs.length);

  await updateDoc(doc(db, 'users', userId), {
    'profile.rating': avg,
    'profile.reviewsCount': snap.docs.length,
  });

  console.log('[RECALC] updateDoc OK');
};

// Fetch revealed reviews for a user (for ViewProfileScreen)
export const fetchUserReviews = async (userId: string) => {
  const db = getFirestore();

  const snap = await getDocs(
    query(
      collection(db, 'reviews'),
      where('toUserId', '==', userId),
      // where('isRevealed', '==', true),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'),
    ),
  );

  const reviews = await Promise.all(
    snap.docs.map(async (d: any) => {
      const data = d.data();

      // Fetch reviewer's name + photo
      const fromSnap = await getDoc(doc(db, 'users', data.fromUserId));
      const fromData = fromSnap.exists() ? fromSnap.data() : null;

      return {
        id: d.id,
        ...data,
        fromUserName: fromData?.profile?.name ?? 'Unknown',
        fromUserPhoto: fromData?.profile?.photo ?? null,
        fromUserRole: fromData?.profile?.skills?.[0] ?? '',
      };
    }),
  );

  return reviews;
};