import React, { useEffect, useRef } from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LogBox } from 'react-native';

import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';
// import { StripeProvider } from '@stripe/stripe-react-native';

// import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import { navigationRef } from './src/utils/navigationRef';
import { handleNotificationNavigation } from './src/utils/notificationNavigation';
import { registerFCMToken } from './src/services/FCMnotification';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { initI18n } from './src/i18n';

// Ignore deprecated Firebase namespaced API warnings
LogBox.ignoreLogs([
  'This method is deprecated (as well as all React Native Firebase namespaced API)',
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Holds presence cleanup fn — reserved for RTDB presence feature
  const presenceCleanup = useRef<(() => void) | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '842815751322-fgg618jn2o3uldffnhaabi6k2se3kedm.apps.googleusercontent.com',
      iosClientId: '842815751322-js7cpvgv36j81mkvh47rjln48hdo3gre.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    // RevenueCat init — uses Firebase UID as appUserID for webhook linking
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE); // remove in production
    Purchases.configure({
      apiKey: Platform.OS === 'ios'
        ? 'appl_JcVvEfpDBhpZcxOQGqjXdmanQOh'
        : 'goog_uAKkDJTCCTTgPsysmWkyytHQqMQ',  // TODO: replace with your Android RC key
    });

    // Identify user so RC webhook knows which Firebase UID to grant credits to
    const unsubscribeAuth = onAuthStateChanged(getAuth(), user => {
      if (user) {
        Purchases.logIn(user.uid).catch(err =>
          console.warn('[RC] logIn error:', err),
        );
        unsubscribeAuth(); // unsubscribe after first auth state — RC only needs login once
      }
    });
  }, []);

  useEffect(() => {
    registerFCMToken().catch(err => console.log('FCM Token Error:', err));
  }, []);

  useEffect(() => {
    // const app = getApp();
    // const messaging = getMessaging(app);
    const messaging = getMessaging();

    const unsubscribe = onMessage(messaging, async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);

      // Show system notification even when app is foreground
      await notifee.displayNotification({
        title: remoteMessage.notification?.title ?? 'Notification',
        body: remoteMessage.notification?.body ?? '',
        android: {
          channelId: await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
          }),
        },
      });
    });

    return unsubscribe;
  }, []);

  // Notifee foreground notification tap → navigate to notification screen
  useEffect(() => {
    return notifee.onForegroundEvent(({ type }) => {
      if (type === EventType.PRESS) {
        navigationRef.current?.navigate('notification');
      }
    });
  }, []);

  // Background tap handler + quit state tap handler
  useEffect(() => {
    // const app = getApp();
    // const messaging = getMessaging(app);
    const messaging = getMessaging();

    // App was in background when notification was tapped
    const unsubscribeBackground = onNotificationOpenedApp(
      messaging,
      remoteMessage => {
        handleNotificationNavigation(remoteMessage);
      },
    );

    // App was killed when notification was tapped
    // 1s delay ensures NavigationContainer is fully mounted before navigating
    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        setTimeout(() => handleNotificationNavigation(remoteMessage), 1000);
      }
    });

    return unsubscribeBackground;
  }, []);

  useEffect(() => {
    initI18n().catch(err => console.warn('[i18n] init failed:', err));
  }, []);

  return (
    // <StripeProvider publishableKey="pk_test_51SL7SOLT7u05bl0T7ycIXtQ087oy07qqZxzYrTMR1JjpxGrs8jVcKRtZCte98moBU053lCoqt8aWoXiCT5iNUaRn00AGBjmxrR">
    //   <QueryClientProvider client={queryClient}>
    //     <NavigationContainer ref={navigationRef}>
    //       <RootNavigator />
    //     </NavigationContainer>
    //     <Toast />
    //   </QueryClientProvider>
    // </StripeProvider>
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef}>
        <RootNavigator />
      </NavigationContainer>
      <Toast />
    </QueryClientProvider>
  );
};

export default App;
