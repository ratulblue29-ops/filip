import React, { useEffect } from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LogBox } from 'react-native';

import { StripeProvider } from '@stripe/stripe-react-native';

import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';

import { registerFCMToken } from './src/services/FCMnotification';

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

      Toast.show({
        type: 'info',
        text1: remoteMessage.notification?.title ?? 'Notification',
        text2: remoteMessage.notification?.body ?? '',
      });
    });

    return unsubscribe;
  }, []);

  return (
    <StripeProvider publishableKey="pk_test_51SL7SOLT7u05bl0T7ycIXtQ087oy07qqZxzYrTMR1JjpxGrs8jVcKRtZCte98moBU053lCoqt8aWoXiCT5iNUaRn00AGBjmxrR">
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>

        <Toast />
      </QueryClientProvider>
    </StripeProvider>
  );
};

export default App;
