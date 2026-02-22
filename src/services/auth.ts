import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SignUpData } from '../@types/Signup.type';

const auth = getAuth();
const db = getFirestore();

// helper for monthKey e.g. 2026-02
const getMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// email signup
export const signUpUser = async (data: SignUpData) => {
  const { fullName, email, password, city, acceptedTerms } = data;

  if (!fullName || !email || !password || !city) {
    throw new Error('Please fill in all required fields.');
  }

  if (!acceptedTerms) {
    throw new Error('You must accept the terms and conditions.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    normalizedEmail,
    password,
  );

  const user = userCredential.user;

  await setDoc(doc(collection(db, 'users'), user.uid), {
    email: normalizedEmail,

    profile: {
      name: fullName,
      aboutMe: '',
      photo: null,
      city,
      skills: [],
      hourlyRate: null,
      experienceYears: 0,
      rating: 0,
      reviewsCount: 0,
      verified: false,
      opentowork: true,
    },

    membership: {
      tier: 'free', // free | basic | premium
      startedAt: null,
      expiresAt: null,
      monthKey: getMonthKey(),
      fullTimeAdsPostedThisMonth: 0,
      fullTimeAdsLimit: 0, // free = 0, basic = 1, premium = unlimited (null)
    },

    credits: {
      balance: 10,
      lifetimeEarned: 10,
      used: 0,
    },

    terms: {
      accepted: true,
      acceptedAt: serverTimestamp(),
    },

    active: true,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
};

// google signup
export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    await GoogleSignin.signIn();

    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error('Google ID token not found');

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, googleCredential);
    const user = userCredential.user;

    const userRef = doc(collection(db, 'users'), user.uid);
    const snap = await getDoc(userRef);

    const existingProfile = snap.exists() ? (snap.data() as Record<string, any>)?.profile : null;

    const finalPhoto = existingProfile?.photo || user.photoURL || null;
    const finalName = existingProfile?.name || user.displayName || '';

    // first time user — seed full document
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email?.trim().toLowerCase() ?? '',

        profile: {
          name: finalName,
          aboutMe: '',
          photo: finalPhoto,
          city: '',
          skills: [],
          hourlyRate: null,
          experienceYears: 0,
          rating: 0,
          reviewsCount: 0,
          verified: false,
          openToWork: true,
        },

        terms: {
          accepted: false,
          acceptedAt: null,
        },

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // merge latest auth data on every login
    await setDoc(
      userRef,
      {
        email: user.email?.trim().toLowerCase() ?? '',
        updatedAt: serverTimestamp(),

        profile: {
          name: finalName,
          photo: finalPhoto,
        },

        membership: {
          tier: 'free',
          startedAt: null,
          expiresAt: null,
          monthKey: getMonthKey(),
          fullTimeAdsPostedThisMonth: 0,
          fullTimeAdsLimit: 0,
        },

        credits: {
          balance: 10,
          lifetimeEarned: 10,
          used: 0,
        },

        active: true,
      },
      { merge: true },
    );

    return user;
  } catch (error) {
    console.log('Google Signup Error:', error);
    throw error;
  }
};