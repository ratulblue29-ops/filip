// import React, { useMemo, useState } from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import {
//   ArrowLeft,
//   Search,
//   BriefcaseBusiness,
//   MessageSquareText,
//   CircleCheck,
//   X,
//   Eye,
// } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import firestore from '@react-native-firebase/firestore';

// import styles from './style';
// import WalletIcon from '../../components/svg/WalletIcon';
// import { fetchMyNotifications } from '../../services/notification';
// import { NotificationItem } from '../../@types/notificationIte.type';

// /* Helpers */

// const formatTimeAgo = (timestamp: any): string => {
//   if (!timestamp) return '';

//   const date =
//     typeof timestamp?.toDate === 'function'
//       ? timestamp.toDate()
//       : new Date(timestamp);

//   const diffMs = Date.now() - date.getTime();
//   const diffMinutes = Math.floor(diffMs / (1000 * 60));
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//   if (diffMinutes < 60) return `${diffMinutes}m ago`;
//   if (diffHours < 24) return `${diffHours}h ago`;
//   if (diffDays === 1) return `1d ago`;
//   return `${diffDays}d ago`;
// };

// const getSectionLabel = (timestamp: any): 'Today' | 'Yesterday' | 'Earlier' => {
//   if (!timestamp) return 'Earlier';

//   const date =
//     typeof timestamp?.toDate === 'function'
//       ? timestamp.toDate()
//       : new Date(timestamp);

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const yesterday = new Date(today);
//   yesterday.setDate(today.getDate() - 1);

//   const inputDate = new Date(date);
//   inputDate.setHours(0, 0, 0, 0);

//   if (inputDate.getTime() === today.getTime()) return 'Today';
//   if (inputDate.getTime() === yesterday.getTime()) return 'Yesterday';
//   return 'Earlier';
// };

// const mapNotificationTypeToIcon = (
//   type: string,
//   isNew: boolean,
// ): React.ReactNode => {
//   if (type === 'JOB_APPLY') {
//     return (
//       <View style={styles.iconContainer}>
//         <BriefcaseBusiness width={28} height={28} color="#2BEE79" />
//         {isNew && <View style={styles.newDot} />}
//       </View>
//     );
//   }

//   if (type === 'MESSAGE') {
//     return (
//       <View style={styles.iconContainer}>
//         <MessageSquareText width={28} height={28} color="#60A5FA" />
//       </View>
//     );
//   }

//   if (type === 'OFFER_ACCEPTED') {
//     return (
//       <View style={styles.iconContainer}>
//         <CircleCheck width={28} height={28} color="#16A34A" />
//         {isNew && <View style={styles.newDot} />}
//       </View>
//     );
//   }

//   if (type === 'OFFER_REJECTED') {
//     return (
//       <View style={styles.iconContainer}>
//         <View style={styles.iconContainerRed}>
//           <X width={22} height={22} color="#DC2626" />
//         </View>
//         {isNew && <View style={styles.newDot} />}
//       </View>
//     );
//   }

//   if (type === 'PAYMENT') {
//     return (
//       <View style={styles.iconContainer}>
//         <WalletIcon width={28} height={28} color="#EAB308" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.iconContainer}>
//       <Eye width={28} height={28} color="#9CA3AF" />
//     </View>
//   );
// };

// const NotificationScreen = () => {
//   const navigation = useNavigation<any>();
//   const queryClient = useQueryClient();

//   const [searchQuery, setSearchQuery] = useState('');

//   const { data: notifications = [], isLoading } = useQuery({
//     queryKey: ['notifications'],
//     queryFn: fetchMyNotifications,
//   });

//   /* Mark all as read */
//   const { mutate: markAllRead, isPending } = useMutation({
//     mutationFn: async () => {
//       const batch = firestore().batch();
//       notifications.forEach(n => {
//         if (!n.isRead) {
//           batch.update(firestore().collection('notifications').doc(n.id), {
//             isRead: true,
//           });
//         }
//       });
//       await batch.commit();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notifications'] });
//     },
//   });

//   /* Format UI data */
//   const formattedNotifications = useMemo(() => {
//     return notifications.map((n: NotificationItem) => ({
//       id: n.id,
//       type: n.type,
//       title: n.title ?? 'Notification',
//       description: n.body ?? '',
//       time: formatTimeAgo(n.createdAt),
//       section: getSectionLabel(n.createdAt),
//       isNew: !n.isRead,
//       raw: n,
//       jobTitle: n.jobTitle ?? 'Job Update',
//       jobRate: n.jobRate ?? '',
//       jobUnit: n.jobUnit ?? '',
//     }));
//   }, [notifications]);

//   /* Search filter */
//   const filteredNotifications = useMemo(() => {
//     const q = searchQuery.toLowerCase().trim();
//     if (!q) return formattedNotifications;

//     return formattedNotifications.filter(
//       n =>
//         n.title.toLowerCase().includes(q) ||
//         n.description.toLowerCase().includes(q),
//     );
//   }, [formattedNotifications, searchQuery]);

//   const sections: Array<'Today' | 'Yesterday' | 'Earlier'> = [
//     'Today',
//     'Yesterday',
//     'Earlier',
//   ];

//   /* Read on click */
//   const handleNotificationPress = async (notif: NotificationItem) => {
//     try {
//       if (!notif.isRead) {
//         await firestore()
//           .collection('notifications')
//           .doc(notif.id)
//           .update({ isRead: true });
//       }

//       queryClient.invalidateQueries({ queryKey: ['notifications'] });
//     } catch (err) {
//       console.log('Notification update failed', err);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <ArrowLeft width={24} height={24} color="#fff" />
//         </TouchableOpacity>

//         <Text style={styles.title}>Notifications</Text>

//         <TouchableOpacity onPress={() => markAllRead()} disabled={isPending}>
//           <Text style={styles.markAllRead}>
//             {isPending ? 'Marking...' : 'Mark all read'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Search */}
//       <View style={styles.searchContainer}>
//         <Search width={24} height={24} color="#fff" />
//         <TextInput
//           placeholder="Search Notification"
//           placeholderTextColor="#9CA3AF"
//           style={styles.input}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Content */}
//       {isLoading ? (
//         <View style={{ marginTop: 40 }}>
//           <ActivityIndicator size="large" color="#FFD900" />
//         </View>
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           {sections.map(section => {
//             const items = filteredNotifications.filter(
//               n => n.section === section,
//             );
//             if (items.length === 0) return null;

//             return (
//               <View key={section}>
//                 <Text style={styles.sectionTitle}>{section}</Text>

//                 {items.map(item => (
//                   <TouchableOpacity
//                     key={item.id}
//                     style={styles.notificationCard}
//                     onPress={() => handleNotificationPress(item.raw)}
//                   >
//                     {mapNotificationTypeToIcon(item.type, item.isNew)}

//                     <View style={styles.notificationContent}>
//                       <View style={styles.notificationHeader}>
//                         <Text style={styles.notificationTitle}>
//                           {item.title}
//                         </Text>
//                         <Text style={styles.notificationTime}>{item.time}</Text>
//                       </View>

//                       <Text
//                         style={styles.notificationDescription}
//                         numberOfLines={2}
//                       >
//                         {item.jobTitle}
//                       </Text>

//                       {item.jobRate && item.jobUnit && (
//                         <Text
//                           style={styles.notificationDescription}
//                           numberOfLines={1}
//                         >
//                           €{item.jobRate}/{item.jobUnit} · Tap to view details
//                         </Text>
//                       )}
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             );
//           })}

//           {filteredNotifications.length === 0 && (
//             <Text style={styles.noResults}>No notifications found</Text>
//           )}
//         </ScrollView>
//       )}
//     </SafeAreaView>
//   );
// };

// export default NotificationScreen;
import React, { useMemo, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  BriefcaseBusiness,
  MessageSquareText,
  CircleCheck,
  X,
  Eye,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import firestore from '@react-native-firebase/firestore';

import styles from './style';
import WalletIcon from '../../components/svg/WalletIcon';
import { fetchMyNotifications } from '../../services/notification';
import { NotificationItem } from '../../@types/notificationIte.type';

const formatTimeAgo = (timestamp: any): string => {
  if (!timestamp) return '';

  const date =
    typeof timestamp?.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp);

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return `1d ago`;
  return `${diffDays}d ago`;
};

const getSectionLabel = (timestamp: any): 'Today' | 'Yesterday' | 'Earlier' => {
  if (!timestamp) return 'Earlier';

  const date =
    typeof timestamp?.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === today.getTime()) return 'Today';
  if (inputDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return 'Earlier';
};

const ICON_MAP: Record<string, (isNew: boolean) => React.ReactNode> = {
  job_apply: isNew => (
    <View style={styles.iconContainer}>
      <BriefcaseBusiness width={28} height={28} color="#2BEE79" />
      {isNew && <View style={styles.newDot} />}
    </View>
  ),

  message: isNew => (
    <View style={styles.iconContainer}>
      <MessageSquareText width={28} height={28} color="#60A5FA" />
      {isNew && <View style={styles.newDot} />}
    </View>
  ),

  offer_accepted: isNew => (
    <View style={styles.iconContainer}>
      <CircleCheck width={28} height={28} color="#16A34A" />
      {isNew && <View style={styles.newDot} />}
    </View>
  ),

  offer_rejected: isNew => (
    <View style={styles.iconContainer}>
      <View style={styles.iconContainerRed}>
        <X width={22} height={22} color="#DC2626" />
      </View>
      {isNew && <View style={styles.newDot} />}
    </View>
  ),

  payment: isNew => (
    <View style={styles.iconContainer}>
      <WalletIcon width={28} height={28} color="#EAB308" />
      {isNew && <View style={styles.newDot} />}
    </View>
  ),
};

const mapNotificationTypeToIcon = (type: string, isNew: boolean) => {
  const key = type?.toLowerCase();
  return (
    ICON_MAP[key]?.(isNew) ?? (
      <View style={styles.iconContainer}>
        <Eye width={28} height={28} color="#9CA3AF" />
      </View>
    )
  );
};

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchMyNotifications,
  });

  /* Mark all as read */
  const { mutate: markAllRead, isPending } = useMutation({
    mutationFn: async () => {
      const batch = firestore().batch();

      notifications.forEach(n => {
        if (!n.isRead) {
          batch.update(firestore().collection('notifications').doc(n.id), {
            isRead: true,
          });
        }
      });

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  /* Format notifications */
  const formattedNotifications = useMemo(() => {
    return notifications.map((n: NotificationItem) => ({
      id: n.id,
      type: n.type,
      title: n.title ?? 'Notification',
      description: n.body ?? '',
      time: formatTimeAgo(n.createdAt),
      section: getSectionLabel(n.createdAt),
      isNew: !n.isRead,
      raw: n,
      jobTitle: n.jobTitle ?? '',
      jobRate: n.jobRate ?? '',
      jobUnit: n.jobUnit ?? '',
    }));
  }, [notifications]);

  /* Search filter */
  const filteredNotifications = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return formattedNotifications;

    return formattedNotifications.filter(
      n =>
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q),
    );
  }, [formattedNotifications, searchQuery]);

  const sections: Array<'Today' | 'Yesterday' | 'Earlier'> = [
    'Today',
    'Yesterday',
    'Earlier',
  ];

  /* -------- On press -------- */
  const handleNotificationPress = async (notif: NotificationItem) => {
    try {
      if (!notif.isRead) {
        await firestore()
          .collection('notifications')
          .doc(notif.id)
          .update({ isRead: true });
      }

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err) {
      console.log('Notification update failed', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft width={24} height={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>

        <TouchableOpacity onPress={() => markAllRead()} disabled={isPending}>
          <Text style={styles.markAllRead}>
            {isPending ? 'Marking...' : 'Mark all read'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="#fff" />
        <TextInput
          placeholder="Search Notification"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#FFD900" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {sections.map(section => {
            const items = filteredNotifications.filter(
              n => n.section === section,
            );
            if (items.length === 0) return null;

            return (
              <View key={section}>
                <Text style={styles.sectionTitle}>{section}</Text>

                {items.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.notificationCard}
                    onPress={() => handleNotificationPress(item.raw)}
                  >
                    {mapNotificationTypeToIcon(item.type, item.isNew)}

                    <View style={styles.notificationContent}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>
                          {item.title}
                        </Text>
                        <Text style={styles.notificationTime}>{item.time}</Text>
                      </View>

                      {!!item.jobTitle && (
                        <Text
                          style={styles.notificationDescription}
                          numberOfLines={1}
                        >
                          {item.jobTitle}
                        </Text>
                      )}

                      {item.jobRate && item.jobUnit && (
                        <Text
                          style={styles.notificationDescription}
                          numberOfLines={1}
                        >
                          €{item.jobRate}/{item.jobUnit} · Tap to view
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}

          {filteredNotifications.length === 0 && (
            <Text style={styles.noResults}>No notifications found</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;
