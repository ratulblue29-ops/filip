/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { getApp } from '@react-native-firebase/app';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

// Must be registered at root level — handles FCM when app is background or killed.
// Must be called before AppRegistry.registerComponent.
setBackgroundMessageHandler(getMessaging(getApp()), async remoteMessage => {
  console.log('Background FCM:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
