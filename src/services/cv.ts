import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getStorage, ref, putFile, getDownloadURL } from '@react-native-firebase/storage';
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import ReactNativeBlobUtil from 'react-native-blob-util';

const getDb = () => getFirestore(getApp());
const getCurrentUser = () => getAuth(getApp()).currentUser;

// Android returns content:// URIs from the document picker which Firebase Storage
// cannot read directly due to OS permission scoping. We copy the file to the
// app's cache directory first, then upload from that file:// path.
const resolveUploadPath = async (uri: string): Promise<string> => {
  if (!uri.startsWith('content://')) return uri; // already a file:// path on iOS

  const destPath = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/cv_upload.pdf`;
  await ReactNativeBlobUtil.fs.cp(uri, destPath);
  return destPath;
};

// Upload CV PDF to Firebase Storage — always overwrites users/{uid}/cv.pdf
// Returns the public download URL
export const uploadCv = async (contentUri: string): Promise<string> => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not logged in');

  // Resolve content:// → file:// before handing to Firebase Storage
  const localPath = await resolveUploadPath(contentUri);

  const storageRef = ref(getStorage(), `users/${user.uid}/cv.pdf`);
  await putFile(storageRef, localPath);
  const downloadUrl = await getDownloadURL(storageRef);

  // Persist URL to user document so ApplyModal can read it later
  await updateDoc(doc(getDb(), 'users', user.uid), {
    'profile.cvUrl': downloadUrl,
    updatedAt: serverTimestamp(),
  });

  return downloadUrl;
};

// Fetch the stored CV URL from the user's profile
// Returns null if no CV has been uploaded yet
export const fetchUserCvUrl = async (): Promise<string | null> => {
  const user = getCurrentUser();
  if (!user) return null;

  const snap = await getDoc(doc(getDb(), 'users', user.uid));
  if (!snap.exists()) return null;

  return snap.data()?.profile?.cvUrl ?? null;
};