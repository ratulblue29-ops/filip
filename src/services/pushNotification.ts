import { getApp } from '@react-native-firebase/app';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';

type PushPayload = {
  toUserId: string;
  title: string;
  body: string;
  type: string;
  data?: {
    chatId?: string;
    otherUserId?: string;
    jobId?: string;
  };
};

// Calls sendPushNotification Cloud Function.
// Fire-and-forget — never throw, never block the caller.
// Push is best-effort: UI flow must never depend on this succeeding.
export const sendPush = async (payload: PushPayload): Promise<void> => {
  try {
    const functions = getFunctions(getApp(), 'us-central1');
    const fn = httpsCallable(functions, 'sendPushNotification');
    await fn(payload);
  } catch (err) {
    // Non-critical — log only, never surface to user
    console.log('sendPush failed (non-critical):', err);
  }
};