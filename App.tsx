import React, { useEffect, useRef } from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LogBox } from 'react-native';

import { StripeProvider } from '@stripe/stripe-react-native';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import { navigationRef } from './src/utils/navigationRef';
import { handleNotificationNavigation } from './src/utils/notificationNavigation';
import { registerFCMToken } from './src/services/FCMnotification';
import notifee, { AndroidImportance } from '@notifee/react-native';

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
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    registerFCMToken().catch(err => console.log('FCM Token Error:', err));
  }, []);

  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

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

  // Background tap handler + quit state tap handler
  useEffect(() => {
    const app = getApp();
    const messaging = getMessaging(app);

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

  return (
    <StripeProvider publishableKey="pk_test_51SL7SOLT7u05bl0T7ycIXtQ087oy07qqZxzYrTMR1JjpxGrs8jVcKRtZCte98moBU053lCoqt8aWoXiCT5iNUaRn00AGBjmxrR">
      <QueryClientProvider client={queryClient}>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>

        <Toast />
      </QueryClientProvider>
    </StripeProvider>
  );
};

export default App;
