import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  MoreVertical, 
  Info, 
  Coffee, 
  Plus, 
  SendHorizonal 
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './chatDetailStyle';
import ChatMessageItem from '../../components/message/ChatMessageItem';

// Mock Data
const MESSAGES = [
  {
    id: '1',
    text: 'Hi! Thanks For Picking Up The Shift, Are You Available To Arrive 15 Minutes Early For A Quick Briefing',
    time: '4:30 PM',
    sender: 'Alex',
    isMe: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    text: 'Hey Alex! Yes, I Can Definitely Make It By 5:45, Looking Forward To It.',
    time: '4:30 PM',
    sender: 'Me',
    isMe: true,
  },
  {
    id: '3',
    text: 'Just To Confirm, Is The Dress Code All Black?',
    time: '4:30 PM',
    sender: 'Me',
    isMe: true,
  },
  {
    id: '4',
    text: 'Yes, Exactly! Black Shirt, Black Trousers, And Non Slip Shoes If You Have Them. See You Soon',
    time: '4:30 PM',
    sender: 'Alex',
    isMe: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '5',
    text: 'Hey Alex! Yes, I Can Definitely Make It By 5:45, Looking Forward To It.',
    time: '4:30 PM',
    sender: 'Me',
    isMe: true,
  },
  {
    id: '6',
    text: 'Just To Confirm, Is The Dress Code All Black?',
    time: '4:30 PM',
    sender: 'Me',
    isMe: true,
  },
  {
    id: '7',
    text: 'Yes, Exactly! Black Shirt, Black Trousers, And Non Slip Shoes If You Have Them. See You Soon',
    time: '4:30 PM',
    sender: 'Alex',
    isMe: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

const ChatDetailScreen = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.headerAvatar} 
          />
          <View>
            <Text style={styles.headerName}>Alex</Text>
            <Text style={styles.headerStatus}>Barista. <Text style={{color: '#C5A35E'}}>Online</Text></Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreVertical color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      {/* --- SHIFT CARD --- */}
      <View style={styles.shiftCard}>
        <View style={styles.shiftIconContainer}>
          <Coffee color="#C5A35E" size={20} />
        </View>
        <View style={styles.shiftDetails}>
          <Text style={styles.shiftTitle}>Barista Shifts @ The Grand Hotel</Text>
          <Text style={styles.shiftSubtitle}>Today, 6:00 PM-10:00PM . $22/Hr</Text>
        </View>
        <TouchableOpacity>
          <Info color="#C5A35E" size={24} />
        </TouchableOpacity>
      </View>

      {/* --- CHAT AREA --- */}
  <FlatList
  data={MESSAGES}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <ChatMessageItem message={item} />
  )}
  contentContainerStyle={styles.listContent}
  ListHeaderComponent={() => (
    <View style={styles.centeredInfo}>
      <Text style={styles.dateSeparator}>Today</Text>
      <Text style={styles.matchText}>
        You Matched With Sarah! Say Hello To Coordinate The Shift.
      </Text>
    </View>
  )}
/>

      {/* --- INPUT BAR --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.plusButton}>
            <Plus color="#fff" size={24} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder=""
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.sendButton}>
            <SendHorizonal color="#000" size={20} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatDetailScreen;