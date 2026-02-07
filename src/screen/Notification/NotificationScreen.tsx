// import React, { useState } from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   TextInput,
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
// import styles from './style';
// import WalletIcon from '../../components/svg/WalletIcon';

// const NotificationScreen = () => {
//   const navigation = useNavigation();
//   const [searchQuery, setSearchQuery] = useState('');

//   const notifications = [
//     {
//       id: '1',
//       type: 'shift',
//       title: 'New Shift Offer',
//       description:
//         'Barista Shift\nAt The Coffee Club • $25/Hr. Tap To View Details.',
//       time: '2h Ago',
//       section: 'Today',
//       isNew: true,
//     },
//     {
//       id: '2',
//       type: 'message',
//       title: 'Message From Sarah',
//       description:
//         'Hey, Are You Available To Start An Hour Early Tomorrow? The Manager Was Asking...',
//       time: '4h Ago',
//       section: 'Today',
//     },
//     {
//       id: '3',
//       type: 'confirmation',
//       title: 'Offer Accepted',
//       description:
//         'Confirmed! You Are Booked For The Friday Night Shift At Hotel Grand',
//       time: '5h Ago',
//       section: 'Today',
//     },
//     {
//       id: '4',
//       type: 'payment',
//       title: 'Payment Processed',
//       description:
//         'Your Payment Of $150.00 For The Shift At The Burger Joint Has Been Processed.',
//       time: '1d Ago',
//       section: 'Yesterday',
//     },
//     {
//       id: '5',
//       type: 'rejection',
//       title: 'Application Declined',
//       description:
//         'Unfortunately, The Position At Seaside Cafe Has Been Filled.',
//       time: '3d Ago',
//       section: 'Yesterday',
//     },
//     {
//       id: '6',
//       type: 'view',
//       title: 'Profile View',
//       description:
//         '5 Employers Viewed Your Profile This Week. Keep Your Availability Updated!',
//       time: 'Oct 27',
//       section: 'Earlier',
//     },
//   ];

//   const filteredNotifications = notifications.filter(n => {
//     const query = searchQuery.toLowerCase();
//     return (
//       n.title.toLowerCase().includes(query) ||
//       n.description.toLowerCase().includes(query)
//     );
//   });

//   const renderIcon = (type: string, isNew: boolean) => {
//     if (type === 'shift') {
//       return (
//         <View style={styles.iconContainer}>
//           <BriefcaseBusiness width={28} height={28} color="#2BEE79" />
//           {isNew && <View style={styles.newDot} />}
//         </View>
//       );
//     }
//     if (type === 'message') {
//       return (
//         <View style={styles.iconContainer}>
//           <MessageSquareText width={28} height={28} color="#60A5FA" />
//         </View>
//       );
//     }
//     if (type === 'confirmation') {
//       return (
//         <View style={styles.iconContainer}>
//           <CircleCheck width={28} height={28} color="#525252" fill="#2BEE79" />
//         </View>
//       );
//     }
//     if (type === 'payment') {
//       return (
//         <View style={styles.iconContainer}>
//           <WalletIcon width={28} height={28} color="#EAB308" />
//         </View>
//       );
//     }
//     if (type === 'rejection') {
//       return (
//         <View style={styles.iconContainer}>
//           <View style={styles.iconContainerRed}>
//             <X width={22} height={22} color="#525252" />
//           </View>
//         </View>
//       );
//     }
//     if (type === 'view') {
//       return (
//         <View style={styles.iconContainer}>
//           <Eye width={28} height={28} color="#956BC3" />
//         </View>
//       );
//     }
//     return null;
//   };

//   const sections = ['Today', 'Yesterday', 'Earlier'];

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.7}
//         >
//           <ArrowLeft width={24} height={24} color="#FFFFFF" />
//         </TouchableOpacity>
//         <Text style={styles.title}>Notifications</Text>
//         <TouchableOpacity activeOpacity={0.7}>
//           <Text style={styles.markAllRead}>Mark all read</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.searchContainer}>
//         <Search width={24} height={24} color="white" />
//         <TextInput
//           placeholder="Search Notification"
//           placeholderTextColor="#9CA3AF"
//           style={styles.input}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {sections.map(section => {
//           const sectionItems = filteredNotifications.filter(
//             n => n.section === section,
//           );
//           if (sectionItems.length === 0) return null;

//           return (
//             <View key={section}>
//               <Text style={styles.sectionTitle}>{section}</Text>
//               {sectionItems.map(item => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.notificationCard}
//                   activeOpacity={0.7}
//                 >
//                   {renderIcon(item.type, item.isNew || false)}
//                   <View style={styles.notificationContent}>
//                     <View style={styles.notificationHeader}>
//                       <Text style={styles.notificationTitle}>{item.title}</Text>
//                       <Text style={styles.notificationTime}>{item.time}</Text>
//                     </View>
//                     <Text
//                       style={styles.notificationDescription}
//                       numberOfLines={2}
//                     >
//                       {item.description}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           );
//         })}

//         {filteredNotifications.length === 0 && (
//           <Text style={styles.noResults}>No notifications found</Text>
//         )}
//       </ScrollView>
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
import styles from './style';
import WalletIcon from '../../components/svg/WalletIcon';

import firestore from '@react-native-firebase/firestore';

import {
  fetchMyNotifications,
  NotificationItem,
} from '../../services/notification';

// Helpers
const formatTimeAgo = (timestamp: any): string => {
  if (!timestamp) return '';

  const date =
    typeof timestamp?.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

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

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (inputDate.getTime() === today.getTime()) return 'Today';
  if (inputDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return 'Earlier';
};

const mapNotificationTypeToIcon = (
  type: string,
  isNew: boolean,
): React.ReactNode => {
  if (type === 'JOB_APPLY' || type === 'shift') {
    return (
      <View style={styles.iconContainer}>
        <BriefcaseBusiness width={28} height={28} color="#2BEE79" />
        {isNew && <View style={styles.newDot} />}
      </View>
    );
  }

  if (type === 'MESSAGE' || type === 'message') {
    return (
      <View style={styles.iconContainer}>
        <MessageSquareText width={28} height={28} color="#60A5FA" />
      </View>
    );
  }

  if (type === 'CONFIRMATION' || type === 'confirmation') {
    return (
      <View style={styles.iconContainer}>
        <CircleCheck width={28} height={28} color="#525252" fill="#2BEE79" />
      </View>
    );
  }

  if (type === 'PAYMENT' || type === 'payment') {
    return (
      <View style={styles.iconContainer}>
        <WalletIcon width={28} height={28} color="#EAB308" />
      </View>
    );
  }

  if (type === 'REJECTED' || type === 'rejection') {
    return (
      <View style={styles.iconContainer}>
        <View style={styles.iconContainerRed}>
          <X width={22} height={22} color="#525252" />
        </View>
      </View>
    );
  }

  if (type === 'PROFILE_VIEW' || type === 'view') {
    return (
      <View style={styles.iconContainer}>
        <Eye width={28} height={28} color="#956BC3" />
      </View>
    );
  }

  return (
    <View style={styles.iconContainer}>
      <Eye width={28} height={28} color="#9CA3AF" />
    </View>
  );
};

// main screen
const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');

  // Fetch Notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchMyNotifications,
  });

  //Mark all as read mutation
  const { mutate: markAllRead, isPending: isMarking } = useMutation({
    mutationFn: async () => {
      const batch = firestore().batch();

      notifications.forEach(n => {
        if (!n.isRead) {
          const ref = firestore().collection('notifications').doc(n.id);
          batch.update(ref, { isRead: true });
        }
      });

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Filter and Map UI Data
  const formattedNotifications = useMemo(() => {
    return notifications.map((n: NotificationItem) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.body,
      time: formatTimeAgo(n.createdAt),
      section: getSectionLabel(n.createdAt),
      isNew: !n.isRead,
      raw: n,
      jobTitle: n.jobTitle,
      jobRate: n.jobRate,
      jobUnit: n.jobUnit,
    }));
  }, [notifications]);

  // Search Filter
  const filteredNotifications = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) return formattedNotifications;

    return formattedNotifications.filter(n => {
      return (
        n.title.toLowerCase().includes(query) ||
        n.description.toLowerCase().includes(query)
      );
    });
  }, [formattedNotifications, searchQuery]);

  const sections: Array<'Today' | 'Yesterday' | 'Earlier'> = [
    'Today',
    'Yesterday',
    'Earlier',
  ];

  // read on click
  const handleNotificationPress = async (notif: NotificationItem) => {
    try {
      if (!notif.isRead) {
        await firestore().collection('notifications').doc(notif.id).update({
          isRead: true,
        });

        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    } catch (err) {
      console.log('Notification update failed', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => markAllRead()}
          disabled={isMarking}
        >
          <Text style={styles.markAllRead}>
            {isMarking ? 'Marking...' : 'Mark all read'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search Notification"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Loading */}
      {isLoading ? (
        <View style={{ marginTop: 40 }}>
          <ActivityIndicator size="large" color="#FFD900" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map(section => {
            const sectionItems = filteredNotifications.filter(
              n => n.section === section,
            );

            if (sectionItems.length === 0) return null;

            return (
              <View key={section}>
                <Text style={styles.sectionTitle}>{section}</Text>

                {sectionItems.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.notificationCard}
                    activeOpacity={0.7}
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

                      <Text
                        style={styles.notificationDescription}
                        numberOfLines={2}
                      >
                        {`${item.jobTitle}`}
                      </Text>
                      <Text
                        style={styles.notificationDescription}
                        numberOfLines={2}
                      >
                        {`€${item.jobRate}/${item.jobUnit} . Tap To View Details`}
                      </Text>
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
