import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/login/LoginScreen';
import SplashScreen from '../screen/splash/SplashScreen';
import BottomTabs from './Buttomtabs';
import MembershipScreen from '../screen/membership/membership';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  BottomTabs: undefined;
  Membership: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Membership" component={MembershipScreen} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
