import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface NotificationItem {
  id: string;
  toUserId: string;
  fromUserId: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: FirebaseFirestoreTypes.Timestamp | null;
  data?: Record<string, any>;
  jobTitle?: string;
  jobRate?: string;
  jobUnit?: string;
}

export type JobItem = {
  id: string;
  title: string;
  description?: string;
  salary?: number;
  location?: string;
  createdAt?: FirebaseFirestoreTypes.Timestamp | null;
  [key: string]: any;
};
