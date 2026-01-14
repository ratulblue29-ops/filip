import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/login/LoginScreen';
import SplashScreen from '../screen/splash/SplashScreen';
import BottomTabs from './Buttomtabs';
import MemberShipScreen from '../screen/membership/MemberShipScreen';
import PurchaseScreen from '../screen/purchase/PurchaseScreen';
import ChatScreen from '../screen/chat/ChatScreen';
import ChatDetailScreen from '../screen/chat/ChatDetailScreen';
import CreditsScreen from '../screen/credit/CreditScreen';
import OfferScreen from '../screen/offer/OfferScreen';
import LanguageScreen from '../screen/Language/language';
import EngagementScreen from '../screen/Engagement/EngagementScreen';
import NotificationScreen from '../screen/Notification/NotificationScreen';
import HelpSupportScreen from '../screen/support/HelpSupportScreen';
import TermsConditionsScreen from '../screen/termsCondition/TearmsConditionScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  BottomTabs: undefined;
  membership: undefined;
  purchase: undefined;
  Seasonal: undefined;
  fulltime: undefined;
  chat: undefined;
  ChatDetailScreen: undefined;
  credit: undefined;
  offer: undefined;
  language: undefined;  
  engagement: undefined;
  notification: undefined;
  HelpSupport: undefined;
  TermsConditions: undefined;
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
      <Stack.Screen name="membership" component={MemberShipScreen} />
      <Stack.Screen name="purchase" component={PurchaseScreen} />
      <Stack.Screen name="fulltime" component={ChatScreen} />
      <Stack.Screen name="chat" component={ChatScreen} />
      <Stack.Screen name="ChatDetailScreen" component={ChatDetailScreen} />
      <Stack.Screen name="credit" component={CreditsScreen} />
      <Stack.Screen name="offer" component={OfferScreen} />
      <Stack.Screen name="language" component={LanguageScreen} />
      <Stack.Screen name="engagement" component={EngagementScreen} />
      <Stack.Screen name="notification" component={NotificationScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
