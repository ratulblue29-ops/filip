/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import { getApp } from '@react-native-firebase/app';
import { Platform } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

// Android-only — iOS handles background FCM natively via AppDelegate
if (Platform.OS === 'android') {
  setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
    console.log('Background FCM:', remoteMessage);
  });
}

AppRegistry.registerComponent(appName, () => App);
