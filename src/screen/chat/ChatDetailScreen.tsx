import React, { useState } from 'react';
import {
  StyleSheet,
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
];

const ChatDetailScreen = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');

  const renderMessage = ({ item }: { item: typeof MESSAGES[0] }) => {
    if (item.isMe) {
      return (
        <View style={styles.myMessageContainer}>
          <View style={styles.myBubble}>
            <Text style={styles.messageTextBlack}>{item.text}</Text>
          </View>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
      );
    }

    return (
      <View style={styles.otherMessageWrapper}>
        <Text style={styles.senderName}>{item.sender}, {item.time}</Text>
        <View>
           <View style={styles.otherMessageRow}>
            <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
            <View style={styles.otherBubble}>
                <Text style={styles.messageTextBlack}>{item.text}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

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
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.centeredInfo}>
            <Text style={styles.dateSeparator}>Today</Text>
            <Text style={styles.matchText}>You Matched With Sarah! Say Hello To Coordinate The Shift.</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  headerName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerStatus: { color: '#888', fontSize: 12 },

  // Shift Card
  shiftCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    margin: 16,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  shiftIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2519',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shiftDetails: { flex: 1, marginLeft: 12 },
  shiftTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  shiftSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },

  // Messages
  listContent: { padding: 16 },
  centeredInfo: { alignItems: 'center', marginBottom: 20 },
  dateSeparator: { color: '#888', fontSize: 12, marginBottom: 8 },
  matchText: { color: '#888', fontSize: 12, textAlign: 'center', paddingHorizontal: 40 },
  
  otherMessageWrapper: { marginBottom: 20 },
  senderName: { color: '#888', fontSize: 12, marginLeft: 50, marginBottom: 4 },
  otherMessageRow: { flexDirection: 'row', alignItems: 'flex-end' },
  chatAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  otherBubble: {
    backgroundColor: '#D1D1D1',
    padding: 12,
    borderRadius: 15,
    borderBottomLeftRadius: 2,
    maxWidth: '80%',
  },

  myMessageContainer: { alignItems: 'flex-end', marginBottom: 20 },
  myBubble: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 15,
    borderBottomRightRadius: 2,
    maxWidth: '80%',
  },
  messageTextBlack: { color: '#000', fontSize: 14, lineHeight: 20 },
  timeText: { color: '#888', fontSize: 11, marginTop: 4 },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  plusButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    marginHorizontal: 12,
    paddingHorizontal: 15,
    color: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C5A35E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatDetailScreen;