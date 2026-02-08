// import React, { useEffect } from 'react';
// import RootNavigator from './src/navigator/RootNavigator';
// import { NavigationContainer } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';

// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

// import messaging from '@react-native-firebase/messaging';
// import { registerFCMToken } from './src/services/notification';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// const App = () => {
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId:
//         '16841583186-osf9eoaidpt6l1892ro4oovv8aujdkd9.apps.googleusercontent.com',
//       offlineAccess: true,
//     });
//   }, []);

//   // register token once
//   useEffect(() => {
//     registerFCMToken();
//   }, []);

//   // listen foreground notification
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       console.log('Foreground Notification:', remoteMessage);

//       Toast.show({
//         type: 'info',
//         text1: remoteMessage.notification?.title ?? 'Notification',
//         text2: remoteMessage.notification?.body ?? '',
//       });
//     });

//     return unsubscribe;
//   }, []);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <NavigationContainer>
//         <RootNavigator />
//       </NavigationContainer>

//       <Toast />
//     </QueryClientProvider>
//   );
// };

// export default App;

import React, { useEffect } from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { getMessaging } from '@react-native-firebase/messaging';
import { registerFCMToken } from './src/services/notification';
import { LogBox } from 'react-native';

// Ignore deprecated Firebase namespaced API warnings
LogBox.ignoreLogs([
  'This method is deprecated (as well as all React Native Firebase namespaced API)',
]);

// Initialize React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '16841583186-osf9eoaidpt6l1892ro4oovv8aujdkd9.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  // Register FCM token once
  useEffect(() => {
    registerFCMToken().catch(err => console.log('FCM Token Error:', err));
  }, []);

  // Listen to foreground notifications
  useEffect(() => {
    const unsubscribe = getMessaging().onMessage(async remoteMessage => {
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
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>

      <Toast />
    </QueryClientProvider>
  );
};

export default App;
