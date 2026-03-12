import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { navigationRef } from './navigationRef';

// Routes FCM tap to correct screen based on notification type.
// Add new type → route mappings here as notification types grow.
export const handleNotificationNavigation = (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): void => {
  if (!navigationRef.current?.isReady()) return;

  const type = remoteMessage.data?.type as string | undefined;
  const data = remoteMessage.data ?? {};

  // Chat message → open that specific conversation
  if (type === 'NEW_MESSAGE' && data.chatId && data.otherUserId) {
    navigationRef.current?.navigate('ChatDetailScreen', {
      chatId: data.chatId as string,
      otherUserId: data.otherUserId as string,
    });
    return;
  }

  // All other types → notification screen
  navigationRef.current?.navigate('notification');
};