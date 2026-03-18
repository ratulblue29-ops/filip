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

const getDb = () => getFirestore();

/* ================= CHAT ID ================= */

const getChatId = (userId1: string, userId2: string): string =>
  [userId1, userId2].sort().join('_');

/* ================= CHECK CHAT ACCESS ================= */
// Returns true if user can chat: either Premium OR has accepted engagement with otherUser
export const checkChatAccess = async (
  otherUserId: string,
  membershipTier: string,
): Promise<boolean> => {
  if (membershipTier === 'premium') return true;

  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  const db = getDb();
  const [asEmployer, asWorker] = await Promise.all([
    getDocs(query(
      collection(db, 'engagements'),
      where('fromUserId', '==', currentUser.uid),
      where('workerId', '==', otherUserId),
      where('status', '==', 'accepted'),
    )),
    getDocs(query(
      collection(db, 'engagements'),
      where('workerId', '==', currentUser.uid),
      where('fromUserId', '==', otherUserId),
      where('status', '==', 'accepted'),
    )),
  ]);
  return !asEmployer.empty || !asWorker.empty;
};

/* ================= CREATE OR GET CHAT ================= */

export const createOrGetChat = async (
  otherUserId: string,
  jobContext?: JobAttachment,
): Promise<string> => {
  const auth = getAuth();
  const db = getDb();
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
  const auth = getAuth();
  const db = getDb();
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
  const db = getDb();
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
  const auth = getAuth();
  const db = getDb();
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
  const auth = getAuth();
  const db = getDb();
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
  const auth = getAuth();
  const db = getDb();
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

/* ================= CREATE ENGAGEMENT CHAT ================= */
// One chat per engagement — chatId IS the engagementId
// jobName stored for display in ChatScreen list title
export const createEngagementChat = async (
  engagementId: string,
  fromUserId: string,
  workerId: string,
  jobId: string,
  jobName: string,
): Promise<void> => {
  const db = getDb();
  const chatRef = firestoreDoc(db, 'chats', engagementId);
  const chatSnap = await getDoc(chatRef);

  // Idempotent — skip if already exists
  if (chatSnap.exists()) return;

  await setDoc(chatRef, {
    engagementId,
    jobId,
    jobName,

    participants: [fromUserId, workerId],
    participantIds: {
      [fromUserId]: true,
      [workerId]: true,
    },

    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    lastMessageBy: '',
    unreadCount: {
      [fromUserId]: 0,
      [workerId]: 0,
    },

    offerStatus: 'Offer Pending',
    jobRole: jobName,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/* ================= CHAT LOCK STATUS (DAILY SHIFTS ONLY) ================= */
// chatId === engagementId — allows direct engagement lookup without extra mapping
export const getChatLockStatus = async (
  chatId: string,
): Promise<{ isLocked: boolean }> => {
  const db = getDb();

  // chatId is the engagementId — fetch engagement directly
  const engSnap = await getDoc(firestoreDoc(db, 'engagements', chatId));
  if (!engSnap.exists()) return { isLocked: false };

  const engData = engSnap.data();
  if (!engData?.availabilityPostId) return { isLocked: false };

  // Fetch the linked availability post
  const postSnap = await getDoc(firestoreDoc(db, 'jobs', engData.availabilityPostId));
  if (!postSnap.exists()) return { isLocked: false };

  const post = postSnap.data();

  // Only daily shifts have a lock lifecycle
  if (post?.type !== 'daily') return { isLocked: false };

  const { date, endTime } = post;
  if (!date || !endTime) return { isLocked: false };

  // Build shift end datetime and compare to now
  const shiftEnd = new Date(`${date}T${endTime}:00`);
  const isLocked = new Date() > shiftEnd;

  // Lazily write lockedAt to chat doc on first detection — lets ChatScreen show "Ended" badge
  if (isLocked) {
    const chatRef = firestoreDoc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatRef);
    if (chatSnap.exists() && !chatSnap.data()?.lockedAt) {
      await updateDoc(chatRef, { lockedAt: serverTimestamp() });
    }
  }

  return { isLocked };
};