import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from '@react-native-firebase/auth';
import { useQueryClient } from '@tanstack/react-query';

import MessageItem from '../../components/message/MessageItem';
import styles from './style';
import {
  subscribeToChats,
  getOtherUserInfoFromChat,
} from '../../services/chat';
import { timeAgo } from '../../helper/timeAgo';
import { MessageData } from '../../@types/MessageData.type';
import { ChatWithUser } from '../../@types/Chat.type';

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const currentUserId = getAuth().currentUser?.uid || '';

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<ChatWithUser[]>([]);

  /* ================= REALTIME SUBSCRIBE ================= */

  useEffect(() => {
    const unsubscribe = subscribeToChats(async fetchedChats => {
      const enriched: ChatWithUser[] = await Promise.all(
        fetchedChats.map(async chat => {
          const otherUser = await getOtherUserInfoFromChat(chat);

          return {
            ...chat,
            otherUser: otherUser || {
              id: '',
              name: 'Unknown',
              photo: '',
            },
          };
        }),
      );

      setChats(enriched);
      queryClient.setQueryData(['chats'], enriched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [queryClient]);

  /* ================= STATUS COLORS ================= */

  const getStatusColors = (status?: string) => {
    switch (status) {
      case 'Accepted':
        return { bg: '#22C55E', text: '#fff' };
      case 'Rejected':
        return { bg: '#EF4444', text: '#fff' };
      default:
        return { bg: '#EAB308', text: '#000' };
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#FFD900" />
        <Text style={{ color: '#fff', marginTop: 10 }}>
          Loading chats...
        </Text>
      </SafeAreaView>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#9E9E9E"
          style={styles.input}
        />
      </View>

      {/* CHAT LIST */}
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>
              No chats yet
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const unreadCount =
            item.unreadCount?.[currentUserId] || 0;

          const status =
            item.offerStatus || 'Offer Pending';

          const colors = getStatusColors(status);

          const messageData: MessageData = {
            id: item.id,
            name: item.otherUser?.name || 'Unknown',
            role: item.jobRole || '',
            status,
            statusColor: colors.bg,
            statusTextColor: colors.text,
            message: item.lastMessage || '',
            time: timeAgo(item.lastMessageAt),
            image:
              item.otherUser?.photo ||
              'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
            unreadCount,
          };

          return (
            <MessageItem
              item={messageData}
              chatId={item.id}
              otherUserId={item.otherUser?.id}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;
