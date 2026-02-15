import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc as firestoreDoc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  Unsubscribe,
  writeBatch,
} from '@react-native-firebase/firestore';

import { Chat, ChatMessage, JobAttachment } from '../@types/Chat.type';

const app = getApp();
const db = getFirestore(app);

/* ================= CHAT ID ================= */

const getChatId = (userId1: string, userId2: string): string =>
  [userId1, userId2].sort().join('_');

/* ================= CREATE OR GET CHAT ================= */

export const createOrGetChat = async (
  otherUserId: string,
  jobContext?: JobAttachment,
): Promise<string> => {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;

  if (!currentUser) throw new Error('Not authenticated');
  if (!otherUserId || currentUser.uid === otherUserId)
    throw new Error('Invalid user');

  const chatId = getChatId(currentUser.uid, otherUserId);
  const chatRef = firestoreDoc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) return chatId;

  await setDoc(chatRef, {
    participants: [currentUser.uid, otherUserId],
    participantIds: {
      [currentUser.uid]: true,
      [otherUserId]: true,
    },

    // UI Support Fields
    offerStatus: jobContext ? 'Offer Pending' : '',
    jobRole: jobContext?.title || '',

    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    lastMessageBy: '',
    unreadCount: {
      [currentUser.uid]: 0,
      [otherUserId]: 0,
    },

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (jobContext) {
    await sendMessage(chatId, '', 'job_attachment', {
      jobAttachment: jobContext,
    });
  }

  return chatId;
};

/* ================= SEND MESSAGE ================= */

export const sendMessage = async (
  chatId: string,
  text: string,
  type: 'text' | 'job_attachment' | 'system' = 'text',
  metadata?: unknown,
): Promise<void> => {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  const chatRef = firestoreDoc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) throw new Error('Chat not found');

  const chatData = chatSnap.data();
  if (!chatData) throw new Error('Chat data missing');

  const participants = chatData.participants as string[];
  const otherUserId = participants.find(id => id !== currentUser.uid);

  const messagesRef = collection(db, 'chats', chatId, 'messages');

  await addDoc(messagesRef, {
    senderId: currentUser.uid,
    text,
    type,
    createdAt: serverTimestamp(),
    readBy: [currentUser.uid],
    metadata: metadata ?? {},
  });

  const updatePayload: Record<string, unknown> = {
    lastMessage: type === 'job_attachment' ? 'Sent a job' : text,
    lastMessageAt: serverTimestamp(),
    lastMessageBy: currentUser.uid,
    updatedAt: serverTimestamp(),
  };

  if (otherUserId) {
    updatePayload[`unreadCount.${otherUserId}`] = increment(1);
  }

  await updateDoc(chatRef, updatePayload);
};

/* ================= SUBSCRIBE TO MESSAGES ================= */

export const subscribeToMessages = (
  chatId: string,
  onMessagesUpdate: (messages: ChatMessage[]) => void,
): Unsubscribe => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    snapshot => {
      const messages: ChatMessage[] = snapshot.docs.map(
        (snap: { id: any; data: () => object }) => ({
          id: snap.id,
          ...(snap.data() as object),
        }),
      ) as ChatMessage[];

      onMessagesUpdate(messages);
    },
    error => {
      console.error('subscribeToMessages error:', error);
      onMessagesUpdate([]);
    },
  );
};

/* ================= SUBSCRIBE TO CHATS ================= */

export const subscribeToChats = (
  onChatsUpdate: (chats: Chat[]) => void,
): Unsubscribe => {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  const chatsRef = collection(db, 'chats');

  const q = query(
    chatsRef,
    where('participants', 'array-contains', currentUser.uid),
    // orderBy('lastMessageAt', 'desc'),
  );

  return onSnapshot(
    q,
    snapshot => {
      const chats: Chat[] = snapshot.docs.map(
        (snap: { id: any; data: () => object }) => ({
          id: snap.id,
          ...(snap.data() as object),
        }),
      ) as Chat[];

      onChatsUpdate(chats);
    },
    error => {
      console.error('subscribeToChats error:', error);
      onChatsUpdate([]);
    },
  );
};

/* ================= MARK AS READ ================= */

export const markAsRead = async (chatId: string): Promise<void> => {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  const chatRef = firestoreDoc(db, 'chats', chatId);
  const messagesRef = collection(db, 'chats', chatId, 'messages');

  const q = query(messagesRef, where('senderId', '!=', currentUser.uid));
  const snapshot = await getDocs(q);

  const batch = writeBatch(db);

  snapshot.docs.forEach((snap: { id: string }) => {
    const msgRef = firestoreDoc(db, 'chats', chatId, 'messages', snap.id);

    batch.update(msgRef, {
      readBy: arrayUnion(currentUser.uid),
    });
  });

  batch.update(chatRef, {
    [`unreadCount.${currentUser.uid}`]: 0,
  });

  await batch.commit();
};

/* ================= GET OTHER USER INFO ================= */

export const getOtherUserInfoFromChat = async (chatData: any) => {
  const auth = getAuth(app);
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Not authenticated');

  const participants = chatData.participants as string[];
  const otherUserId = participants.find(id => id !== currentUser.uid);

  if (!otherUserId) return null;

  const userRef = firestoreDoc(db, 'users', otherUserId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  const userData = userSnap.data();
  if (!userData) return null;

  return {
    id: otherUserId,
    name: userData.profile?.name || 'Unknown',
    photo: userData.profile?.photo || null,
  };
};
