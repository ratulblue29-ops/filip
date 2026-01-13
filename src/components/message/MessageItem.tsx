import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageData } from '../../@types/MessageData.type';

interface MessageItemProps {
  item: MessageData;
}

const MessageItem: React.FC<MessageItemProps> = React.memo(({ item }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <View style={styles.statusRow}>
          <View style={[styles.badge, { backgroundColor: item.statusColor }]}>
            <Text style={[styles.badgeText, { color: item.statusTextColor }]}>
              {item.status}
            </Text>
          </View>
          {item.role !== '' && <Text style={styles.roleText}> • {item.role}</Text>}
        </View>

        <Text numberOfLines={1} style={styles.messageSnippet}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

export default MessageItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    flexDirection: 'row',
        marginBottom: 12,
        paddingHorizontal: 15,
    paddingVertical:8,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: '#333',
    objectFit: 'cover',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'InterDisplayMedium',
  },
  timeText: {
    color: '#FFD900',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
      borderRadius: 8,
    borderWidth: 1,
      borderColor: '#383119',
    backgroundColor: '#383119',
  },
    badgeText: {
      color:'#fff',
    fontSize: 14,
    fontWeight: 400,
      fontFamily: 'InterDisplayRegular',
  },
  roleText: {
    color: '#fff',
    fontSize: 13,
      marginLeft: 4,
     fontWeight: 400,
      fontFamily: 'InterDisplayRegular',
  },
  messageSnippet: {
    color: '#fff',
    fontSize: 14,
    marginTop: 12,
     fontWeight: 400,
      fontFamily: 'InterDisplayRegular',
  },
});
