import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, MoreVertical, Send } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAuth } from '@react-native-firebase/auth';
import { doc, getDoc } from '@react-native-firebase/firestore';

import { styles } from './chatDetailStyle';
import ChatMessageItem from '../../components/message/ChatMessageItem';

import {
  subscribeToMessages,
  sendMessage,
  markAsRead,
  getOtherUserInfoFromChat,
} from '../../services/chat';

import { ChatMessage } from '../../@types/Chat.type';
import { getFirestore } from '@react-native-firebase/firestore';
import { checkChatAccess } from '../../services/chat';

const db = getFirestore();

const ChatDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { chatId } = route.params;

  const currentUserId = getAuth().currentUser?.uid || '';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatUnlocked, setChatUnlocked] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  /* ================= LOAD OTHER USER ================= */
  useEffect(() => {
    const loadOtherUser = async () => {
      try {
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) return;

        const chatData = chatSnap.data();
        const user = await getOtherUserInfoFromChat(chatData);

        setOtherUser(user);
      } catch (err) {
        console.error('Failed to load other user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOtherUser();
  }, [chatId]);

  /* ================= SUBSCRIBE MESSAGES ================= */
  useEffect(() => {
    const unsubscribe = subscribeToMessages(chatId, msgs => {
      setMessages(msgs);

      // const hasAccepted = msgs.some(
      //   (m: any) =>
      //     m.type === 'job_attachment' &&
      //     m.metadata?.offerCard?.status === 'accepted',
      // );
      // setChatUnlocked(hasAccepted);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    markAsRead(chatId);

    return () => unsubscribe();
  }, [chatId]);

  /* ================= CHECK CHAT ACCESS ================= */
  useEffect(() => {
    const verifyAccess = async () => {
      if (!otherUser?.id) return;

      // Read current user membership from Firestore
      const db = getFirestore();
      const userSnap = await getDoc(doc(db, 'users', currentUserId));
      const tier = userSnap.data()?.membership?.tier ?? 'free';

      const access = await checkChatAccess(otherUser.id, tier);
      setChatUnlocked(access);
    };

    verifyAccess();
  }, [otherUser]); // re-run when otherUser loads

  /* ================= SEND MESSAGE ================= */
  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage(chatId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFD900" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>

          <Image
            source={{
              uri:
                otherUser?.photo ||
                'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
            }}
            style={styles.headerAvatar}
          />

          <View>
            <Text style={styles.headerName}>{otherUser?.name || 'User'}</Text>
          </View>
        </View>

        <TouchableOpacity>
          <MoreVertical color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* ================= MESSAGES ================= */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isMe = item.senderId === currentUserId;

          const time =
            item.createdAt && typeof item.createdAt.toDate === 'function'
              ? item.createdAt.toDate().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })
              : '';

          return (
            <ChatMessageItem
              message={{
                id: item.id,
                text: item.text,
                time,
                sender: isMe ? 'Me' : otherUser?.name || 'User',
                isMe,
                avatar: isMe ? undefined : otherUser?.photo,
                type: item.type,
                metadata: { ...(item.metadata ?? {}), chatId },
              }}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ================= INPUT ================= */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        {chatUnlocked ? (
          // Normal input when chat is unlocked
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#666"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send width={14} height={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          // Disabled state — waiting for worker to accept
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, { opacity: 0.4 }]}
              placeholder="Waiting for acceptance..."
              placeholderTextColor="#666"
              editable={false}
            />
            <View style={[styles.sendButton, { opacity: 0.4 }]}>
              <Send width={14} height={14} color="#fff" />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;
