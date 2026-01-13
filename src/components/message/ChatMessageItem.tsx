import React from 'react';
import { View, Text, Image } from 'react-native';
import { ChatMessage } from '../../@types/ChatMessage.type';
import { styles } from '../../screen/chat/chatDetailStyle';

type ChatMessageItemProps = {
  message: ChatMessage;
};

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  if (message.isMe) {
    return (
      <View style={styles.myMessageContainer}>
        <View style={styles.myBubble}>
          <Text style={styles.messageTextBlack}>{message.text}</Text>
        </View>
        <Text style={styles.timeText}>{message.time}</Text>
      </View>
    );
  }

  return (
    <View style={styles.otherMessageWrapper}>
      <Text style={styles.senderName}>
        {message.sender}, {message.time}
      </Text>

      <View style={styles.otherMessageRow}>
        {message.avatar && (
          <Image
            source={{ uri: message.avatar }}
            style={styles.chatAvatar}
          />
        )}

        <View style={styles.otherBubble}>
          <Text style={styles.messageTextBlack}>{message.text}</Text>
        </View>
      </View>
    </View>
  );
};

export default ChatMessageItem;
