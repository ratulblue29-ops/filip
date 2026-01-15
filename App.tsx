import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import ReferralScreen from './src/screen/referral/ReferralScreen ';

const App = () => {
  return (
    // <NavigationContainer>
    //   <RootNavigator />
    // </NavigationContainer>
    <ReferralScreen />
  );
};

export default App;
