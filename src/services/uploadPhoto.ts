import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

export const uploadProfilePhoto = async (localUri: string) => {
    const user = auth().currentUser;
    if (!user) throw new Error('User not logged in');

    const ref = storage().ref(`users/${user.uid}/profile.jpg`);

    await ref.putFile(localUri);

    const downloadURL = await ref.getDownloadURL();
    return downloadURL;
};
