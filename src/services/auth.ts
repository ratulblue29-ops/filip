import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  AppleAuthProvider,
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
import { registerReferral } from './referral';
import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';

// const auth = getAuth();
// const db = getFirestore();

// helper for monthKey e.g. 2026-02
const getMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// email signup
export const signUpUser = async (data: SignUpData) => {
  const auth = getAuth();
  const db = getFirestore();
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
      openToWork: true,
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

  if (data.referralCode) {
    await registerReferral(data.referralCode, {
      uid: user.uid,
      name: fullName,
      photo: null,
    });
  }

  return user;
};

// google signup
export const signInWithGoogle = async (referralCode?: string) => {
  const auth = getAuth();
  const db = getFirestore();
  try {
    // hasPlayServices is Android-only — throws on iOS without this guard
    if (Platform.OS === 'android') {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    await GoogleSignin.signIn();

    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) throw new Error('Google ID token not found');

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, googleCredential);
    const user = userCredential.user;

    const userRef = doc(collection(db, 'users'), user.uid);
    const snap = await getDoc(userRef);
    const isNewUser = !snap.exists();
    console.log('[signInWithGoogle] isNewUser:', isNewUser, '| uid:', user.uid); // DEBUG

    const existingData = snap.exists() ? (snap.data() as Record<string, any>) : null;
    const existingProfile = existingData?.profile ?? null;

    // Patch: existing Google accounts missing credits (one-time heal)
    const existingCredits = existingData?.credits ?? null;

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

        // Seed credits for new Google users
        credits: {
          balance: 10,
          lifetimeEarned: 10,
          used: 0,
        },

        terms: {
          accepted: false,
          acceptedAt: null,
        },

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (referralCode) {
        await registerReferral(referralCode, {
          uid: user.uid,
          name: finalName,
          photo: finalPhoto,
        });
      }
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

        // Only seed credits if missing — never overwrite existing balance
        ...(!existingCredits && {
          credits: {
            balance: 10,
            lifetimeEarned: 10,
            used: 0,
          },
        }),

        active: true,
      },
      { merge: true },
    );

    return { user, isNewUser };
  } catch (error) {
    console.log('Google Signup Error:', error);
    throw error;
  }
};

// apple signin — iOS only
export const signInWithApple = async (referralCode?: string) => {
  const auth = getAuth();
  const db = getFirestore();

  // Request name + email on first auth; Apple only sends them once
  const appleAuthResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    nonceEnabled: true,
  });

  const { identityToken, nonce, fullName, email } = appleAuthResponse;
  if (!identityToken) throw new Error('Apple identity token not found');

  const appleCredential = AppleAuthProvider.credential(identityToken, nonce ?? '');

  console.log('[Apple] identityToken:', identityToken?.slice(0, 20));
  console.log('[Apple] nonce:', nonce);

  console.log('[Apple] credential object:', JSON.stringify(appleCredential));
  try {
    const userCredential = await signInWithCredential(auth, appleCredential);
    const user = userCredential.user;

    // Apple only provides name/email on FIRST login — cache before Firestore check
    const finalName =
      fullName?.givenName && fullName?.familyName
        ? `${fullName.givenName} ${fullName.familyName}`.trim()
        : fullName?.givenName ?? user.displayName ?? '';

    // Apple may give relay email on first login; subsequent logins email is null
    const finalEmail = (email ?? user.email ?? '').trim().toLowerCase();

    const userRef = doc(collection(db, 'users'), user.uid);
    const snap = await getDoc(userRef);

    const existingData = snap.exists() ? (snap.data() as Record<string, any>) : null;
    const existingCredits = existingData?.credits ?? null;
    const existingProfile = existingData?.profile ?? null;

    // Prefer stored name over Apple's (Apple sends name only once)
    const resolvedName = existingProfile?.name || finalName;
    const resolvedPhoto = existingProfile?.photo || null;

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: finalEmail,

        profile: {
          name: resolvedName,
          aboutMe: '',
          photo: resolvedPhoto,
          city: '',
          skills: [],
          hourlyRate: null,
          experienceYears: 0,
          rating: 0,
          reviewsCount: 0,
          verified: false,
          openToWork: true,
        },

        credits: {
          balance: 10,
          lifetimeEarned: 10,
          used: 0,
        },

        terms: {
          accepted: false,
          acceptedAt: null,
        },

        membership: {
          tier: 'free',
          startedAt: null,
          expiresAt: null,
          monthKey: getMonthKey(),
          fullTimeAdsPostedThisMonth: 0,
          fullTimeAdsLimit: 0,
        },

        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      if (referralCode) {
        await registerReferral(referralCode, {
          uid: user.uid,
          name: resolvedName,
          photo: resolvedPhoto,
        });
      }
    }

    // Merge on every login — never overwrite credits or name if already set
    await setDoc(
      userRef,
      {
        updatedAt: serverTimestamp(),
        ...(finalEmail && { email: finalEmail }),

        profile: {
          name: resolvedName,
          photo: resolvedPhoto,
        },

        ...(!existingCredits && {
          credits: {
            balance: 10,
            lifetimeEarned: 10,
            used: 0,
          },
        }),

        active: true,
      },
      { merge: true },
    );

    const isNewUser = !snap.exists();
    console.log('[signInWithApple] isNewUser:', isNewUser, '| uid:', user.uid);

    return { user, isNewUser };
  } catch (e: any) {
    console.log('[Apple] signInWithCredential error code:', e.code);
    console.log('[Apple] signInWithCredential error message:', e.message);
    console.log('[Apple] signInWithCredential full error:', JSON.stringify(e));
    throw e;
  }
};