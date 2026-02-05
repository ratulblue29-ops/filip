
import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAuth } from '@react-native-firebase/auth';


import SplashScreen from '../screen/splash/SplashScreen';
import LoginScreen from '../screen/login/LoginScreen';
import SignUpScreen from '../screen/login/SignUpScreen';
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
import SendOfferScreen from '../screen/offer/SendOfferScreen';
import SettingScreen from '../screen/profile/SettingScreen';
import PostedAvailabilitiesScreen from '../screen/mypost/PostedAvailabilitiesScreen';
import SeosonalAvailabilityCreation from '../screen/SeosonalAvailabilityCreation/SeosonalAvailabilityCreation';
import RoleScreen from '../screen/profile/RoleScreen';
import ReferralScreen from '../screen/referral/ReferralScreen ';
import FullTimeAvailabilityCreation from '../screen/availabilty/FullTimeAvailabilityCreation';
import MainProfile from '../screen/profile/MainProfile';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  signup: undefined;
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
  sendoffer: undefined;
  referral: undefined;
  profile: undefined;
  postAvailabilites: undefined;
  SeosonalAvailabilityCreation: undefined;
  FullTimeAvailabilityCreation: undefined;
  GetProfile: undefined;
  role: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type PrivateScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  children: React.ReactNode;
};

const PrivateScreen: React.FC<PrivateScreenProps> = ({ navigation, children }) => {
  const user = getAuth().currentUser;

  if (!user) {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    return null;
  }

  return <>{children}</>;
};

const withPrivate = <T extends object>(Screen: React.ComponentType<T>) => {
  return (props: T & { navigation: NativeStackNavigationProp<RootStackParamList> }) => (
    <PrivateScreen navigation={props.navigation}>
      <Screen {...props} />
    </PrivateScreen>
  );
};

const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      {/* Public screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="signup" component={SignUpScreen} />

      {/* Private screens */}
      <Stack.Screen name="BottomTabs" component={withPrivate(BottomTabs)} />
      <Stack.Screen name="membership" component={withPrivate(MemberShipScreen)} />
      <Stack.Screen name="purchase" component={withPrivate(PurchaseScreen)} />
      <Stack.Screen name="fulltime" component={withPrivate(ChatScreen)} />
      <Stack.Screen name="chat" component={withPrivate(ChatScreen)} />
      <Stack.Screen name="ChatDetailScreen" component={withPrivate(ChatDetailScreen)} />
      <Stack.Screen name="credit" component={withPrivate(CreditsScreen)} />
      <Stack.Screen name="offer" component={withPrivate(OfferScreen)} />
      <Stack.Screen name="language" component={withPrivate(LanguageScreen)} />
      <Stack.Screen name="engagement" component={withPrivate(EngagementScreen)} />
      <Stack.Screen name="notification" component={withPrivate(NotificationScreen)} />
      <Stack.Screen name="HelpSupport" component={withPrivate(HelpSupportScreen)} />
      <Stack.Screen name="TermsConditions" component={withPrivate(TermsConditionsScreen)} />
      <Stack.Screen name="sendoffer" component={withPrivate(SendOfferScreen)} />
      <Stack.Screen name="referral" component={withPrivate(ReferralScreen)} />
      <Stack.Screen name="profile" component={withPrivate(SettingScreen)} />
      <Stack.Screen name="postAvailabilites" component={withPrivate(PostedAvailabilitiesScreen)} />
      <Stack.Screen name="SeosonalAvailabilityCreation" component={withPrivate(SeosonalAvailabilityCreation)} />
      <Stack.Screen name="FullTimeAvailabilityCreation" component={withPrivate(FullTimeAvailabilityCreation)} />
      <Stack.Screen name="GetProfile" component={withPrivate(MainProfile)} />
      <Stack.Screen name="role" component={withPrivate(RoleScreen)} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
