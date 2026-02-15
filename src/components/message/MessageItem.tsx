// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { MessageData } from '../../@types/MessageData.type';
// import { useNavigation } from '@react-navigation/native';

// type MessageItemProps = {
//   item: MessageData;
//   chatId?: string;
//   otherUserId?: string;
// };

// const MessageItem: React.FC<MessageItemProps> = React.memo(
//   ({ item, chatId, otherUserId }) => {
//     const navigation = useNavigation<any>();

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         activeOpacity={0.7}
//         onPress={() =>
//           navigation.navigate('ChatDetailScreen', {
//             chatId: chatId || item.id,
//             otherUserId: otherUserId || '',
//           })
//         }
//       >
//         <Image source={{ uri: item.image }} style={styles.avatar} />
//         <View style={styles.contentContainer}>
//           <View style={styles.row}>
//             <Text style={styles.nameText}>{item.name}</Text>
//             <Text style={styles.timeText}>{item.time}</Text>
//           </View>

//           <View style={styles.statusRow}>
//             <View style={[styles.badge, { backgroundColor: item.statusColor }]}>
//               <Text style={[styles.badgeText, { color: item.statusTextColor }]}>
//                 {item.status}
//               </Text>
//             </View>
//             {item.role !== '' && (
//               <Text style={styles.roleText}> • {item.role}</Text>
//             )}
//           </View>

//           <Text numberOfLines={1} style={styles.messageSnippet}>
//             {item.message}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   },
// );

// export default MessageItem;
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MessageData } from '../../@types/MessageData.type';
import { useNavigation } from '@react-navigation/native';

type MessageItemProps = {
  item: MessageData;
  chatId?: string;
  otherUserId?: string;
};

const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ item, chatId, otherUserId }) => {
    const navigation = useNavigation<any>();

    const avatarSource =
      item.image && item.image.trim().length > 0
        ? { uri: item.image }
        : { uri: 'https://via.placeholder.com/100' };

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() =>
          navigation.navigate('ChatDetailScreen', {
            chatId: chatId || item.id,
            otherUserId: otherUserId || '',
          })
        }
      >
        {/* Avatar */}
        <Image source={avatarSource} style={styles.avatar} />

        {/* Content */}
        <View style={styles.contentContainer}>
          {/* Top Row: Name + Time */}
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.nameText}>
              {item.name}
            </Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          {/* Status + Role */}
          <View style={styles.statusRow}>
            {item.status ? (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: item.statusColor || '#EAB308' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: item.statusTextColor || '#000' },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            ) : null}

            {item.role ? (
              <Text numberOfLines={1} style={styles.roleText}>
                {' '}
                • {item.role}
              </Text>
            ) : null}
          </View>

          {/* Message Preview */}
          <Text numberOfLines={1} style={styles.messageSnippet}>
            {item.message}
          </Text>
        </View>

        {/* Optional Unread Dot */}
        {item.unreadCount && item.unreadCount > 0 ? (
          <View style={styles.unreadDot} />
        ) : null}
      </TouchableOpacity>
    );
  },
);

export default MessageItem;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#1E1E1E',
//     borderRadius: 16,
//     flexDirection: 'row',
//     marginBottom: 12,
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 100,
//     backgroundColor: '#333',
//   },
//   contentContainer: {
//     flex: 1,
//     marginLeft: 15,
//     justifyContent: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   nameText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'InterDisplayMedium',
//   },
//   timeText: {
//     color: '#FFD900',
//     fontSize: 13,
//     fontWeight: '500',
//     fontFamily: 'InterDisplayMedium',
//   },
//   statusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 6,
//   },
//   badge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#383119',
//   },
//   badgeText: {
//     fontSize: 14,
//     fontWeight: '400',
//     fontFamily: 'InterDisplayRegular',
//   },
//   roleText: {
//     color: '#fff',
//     fontSize: 13,
//     marginLeft: 4,
//     fontWeight: '400',
//     fontFamily: 'InterDisplayRegular',
//   },
//   messageSnippet: {
//     color: '#fff',
//     fontSize: 14,
//     marginTop: 12,
//     fontWeight: '400',
//     fontFamily: 'InterDisplayRegular',
//   },
// });

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    flexDirection: 'row',
    marginBottom: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 100,
    backgroundColor: '#333',
  },

  contentContainer: {
    flex: 1,
    marginLeft: 15,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nameText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InterDisplayMedium',
    flex: 1,
  },

  timeText: {
    color: '#FFD900',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'InterDisplayMedium',
    marginLeft: 8,
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
  },

  badgeText: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'InterDisplayRegular',
  },

  roleText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '400',
    fontFamily: 'InterDisplayRegular',
  },

  messageSnippet: {
    color: '#BDBDBD',
    fontSize: 14,
    marginTop: 10,
    fontWeight: '400',
    fontFamily: 'InterDisplayRegular',
  },

  unreadDot: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFD900',
  },
});
