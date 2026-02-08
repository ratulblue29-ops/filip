import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export const timeAgo = (ts?: FirebaseFirestoreTypes.Timestamp | null) => {
  if (!ts) return '';

  const diff = Date.now() - ts.toDate().getTime();

  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
