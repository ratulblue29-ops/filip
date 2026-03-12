import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../navigator/RootNavigator';

// Shared ref — allows navigation outside React tree (FCM tap handlers)
export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();