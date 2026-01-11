import React from 'react';
import RootNavigator from './src/navigator/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import MembershipScreen from './src/screen/membership/membership';

const App = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
      {/* <MembershipScreen /> */}
    </NavigationContainer>
  );
};

export default App;
