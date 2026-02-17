import { getStorage, ref, putFile, getDownloadURL } from '@react-native-firebase/storage';
import { getAuth } from '@react-native-firebase/auth';

// Upload user profile photo to Firebase Storage
export const uploadProfilePhoto = async (localUri: string): Promise<string> => {
    const user = getAuth().currentUser;
    if (!user) throw new Error('User not logged in');

    const storageRef = ref(getStorage(), `users/${user.uid}/profile.jpg`);
    await putFile(storageRef, localUri);
    return getDownloadURL(storageRef);
};

// Upload seasonal job banner to Firebase Storage
export const uploadJobBanner = async (localUri: string): Promise<string> => {
    const user = getAuth().currentUser;
    if (!user) throw new Error('User not logged in');

    const fileName = `job_banner_${user.uid}_${Date.now()}.jpg`;
    const storageRef = ref(getStorage(), `jobBanners/${fileName}`);
    await putFile(storageRef, localUri);
    return getDownloadURL(storageRef);
};