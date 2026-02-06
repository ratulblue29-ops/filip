

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SignUpData } from '../@types/Signup.type';



// helper for monthKey
const getMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`; // 2026-02
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

  const userCredential = await auth().createUserWithEmailAndPassword(
    normalizedEmail,
    password,
  );

  const user = userCredential.user;

  await firestore()
    .collection('users')
    .doc(user.uid)
    .set({
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
        acceptedAt: firestore.FieldValue.serverTimestamp(),
      },

      active: true,

      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

  return user;
};

// google signup
export const signInWithGoogle = async () => {
  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  await GoogleSignin.signIn();

  const { idToken } = await GoogleSignin.getTokens();

  if (!idToken) {
    throw new Error('Google ID token not found');
  }

  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);

  const user = userCredential.user;

  const userRef = firestore().collection('users').doc(user.uid);
  const snap = await userRef.get();

  if (!snap.exists) {
    await userRef.set({
      email: user.email ? user.email.trim().toLowerCase() : '',

      profile: {
        name: user.displayName ?? '',
        aboutMe: '',
        photo: user.photoURL ?? null,
        city: '',
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

        monthKey: getMonthKey(), // IMPORTANT
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
        acceptedAt: firestore.FieldValue.serverTimestamp(),
      },

      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  return user;
};
