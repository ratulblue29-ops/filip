import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  city: string;
  acceptedTerms: boolean;
}

// email signup
export const signUpUser = async (data: SignUpData) => {
  const { fullName, email, password, city, acceptedTerms } = data;
  if (!fullName || !email || !password || !city) {
    throw new Error('Please fill in all required fields.');
  }
  if (!acceptedTerms) {
    throw new Error('You must accept the terms and conditions.');
  }
  const userCredential = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  const user = userCredential.user;
  await firestore()
    .collection('users')
    .doc(user.uid)
    .set({
      email,
      role: 'worker',
      profile: {
        name: fullName,
        photo: null,
        city,
        skills: [],
      },
      workerProfile: {
        aboutMe: '',
        baseCity: city,
        skills: [],
        status: 'open',
      },
      employerProfile: null,
      membership: {
        tier: 'free',
        freePostsUsed: 0,
        postLimit: 10,
      },
      credits: {
        balance: 0,
        lifetimeEarned: 0,
        used: 0,
      },
      terms: {
        accepted: true,
        acceptedAt: firestore.FieldValue.serverTimestamp(),
      },

      verified: false,
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
      email: user.email,
      role: 'worker',

      profile: {
        name: user.displayName ?? '',
        photo: user.photoURL ?? null,
        city: '',
        skills: [],
      },

      workerProfile: {
        aboutMe: '',
        baseCity: '',
        skills: [],
        status: 'open',
      },

      employerProfile: null,

      membership: {
        tier: 'free',
        freePostsUsed: 0,
        postLimit: 10,
      },

      credits: {
        balance: 0,
        lifetimeEarned: 0,
        used: 0,
      },

      terms: {
        accepted: true,
        acceptedAt: firestore.FieldValue.serverTimestamp(),
      },

      verified: true,

      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }
  return user;
};
