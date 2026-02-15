import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type MessageType = 'text' | 'job_attachment' | 'system';

/* ================= JOB ATTACHMENT ================= */

export interface JobAttachment {
  jobId: string;
  title: string;
  type: 'seasonal' | 'fulltime';

  rate?: {
    amount: number;
    unit: string;
  };

  location?: string[];

  schedule?: {
    start: string;
    end: string;
  };
}

/* ================= CHAT MESSAGE ================= */

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  type: MessageType;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  readBy: string[];

  metadata?: {
    jobAttachment?: JobAttachment;
  };
}

/* ================= BASE CHAT ================= */

export interface Chat {
  id: string;

  participants: string[];
  participantIds: Record<string, boolean>;

  lastMessage: string;
  lastMessageAt: FirebaseFirestoreTypes.Timestamp;
  lastMessageBy: string;

  unreadCount: Record<string, number>;

  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;

  /* ---------- OPTIONAL EXTENSIONS (UI LEVEL) ---------- */

  offerStatus?: 'Offer Pending' | 'Accepted' | 'Rejected';
  jobRole?: string;
}

/* ================= CHAT WITH USER (ENRICHED) ================= */

export interface ChatWithUser extends Chat {
  otherUser: {
    id: string;
    name: string;
    photo?: string | null;
  };
}
