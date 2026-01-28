import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>

      {/* Toast message */}
      <Toast />
    </QueryClientProvider>
  );
};

export default App;
