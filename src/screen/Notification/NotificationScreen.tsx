import React, { useEffect, useMemo, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import useRefresh from '../../hooks/useRefresh';
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
// Modular API — replaces deprecated namespaced firestore()
import {
  getFirestore,
  writeBatch,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from '@react-native-firebase/firestore';
import styles from './style';
import WalletIcon from '../../components/svg/WalletIcon';
import { fetchMyNotifications } from '../../services/notification';
import { NotificationItem } from '../../@types/notificationIte.type';
// import { createOrGetChat } from '../../services/chat';
import { updateEngagementStatus } from '../../services/engagement';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

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

/* ─── Icon map ────────────────────────────────────────────────────────────── */

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

  // Engagement notification icon
  engagement_sent: isNew => (
    <View style={styles.iconContainer}>
      <BriefcaseBusiness width={28} height={28} color="#FFD900" />
      {isNew && <View style={styles.newDot} />}
    </View>
  ),

  engagement_accepted: isNew => (
    <View style={styles.iconContainer}>
      <CircleCheck width={28} height={28} color="#16A34A" />
      {isNew && <View style={styles.newDot} />}
    </View>
  ),

  engagement_declined: isNew => (
    <View style={styles.iconContainer}>
      <View style={styles.iconContainerRed}>
        <X width={22} height={22} color="#DC2626" />
      </View>
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

/* ─── Screen ──────────────────────────────────────────────────────────────── */

const NotificationScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');

  const [engagementLoading, setEngagementLoading] = useState<string | null>(
    null,
  );

  const [engagementDecisions, setEngagementDecisions] = useState<
    Record<string, 'accepted' | 'declined'>
  >({});

  const [decisionsLoaded, setDecisionsLoaded] = useState(false);

  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchMyNotifications,
  });
  const { refreshing, onRefresh: onRefreshBase } = useRefresh(refetch);
  const onRefresh = () => {
    setDecisionsLoaded(false);
    onRefreshBase();
  };

  useEffect(() => {
    if (!notifications.length || decisionsLoaded) return;

    const loadEngagementStatuses = async () => {
      const db = getFirestore();
      const engagementNotifs = notifications.filter(
        n => n.type === 'ENGAGEMENT_SENT' && n.data?.engagementId,
      );

      if (engagementNotifs.length === 0) {
        setDecisionsLoaded(true);
        return;
      }

      const updates: Record<string, 'accepted' | 'declined'> = {};

      await Promise.all(
        engagementNotifs.map(async n => {
          try {
            const engSnap = await getDoc(
              doc(db, 'engagements', n.data!.engagementId),
            );
            if (!engSnap.exists()) return;
            const status = engSnap.data()?.status;
            if (status === 'accepted' || status === 'declined') {
              updates[n.data!.engagementId] = status;
            }
          } catch {
            // skip failed reads
          }
        }),
      );

      setEngagementDecisions(prev => ({ ...prev, ...updates }));
      setDecisionsLoaded(true);
    };

    loadEngagementStatuses();
  }, [notifications, decisionsLoaded]);

  /* Mark all as read — uses modular writeBatch (replaces deprecated .batch()) */
  const { mutate: markAllRead, isPending } = useMutation({
    mutationFn: async () => {
      const db = getFirestore();
      const batch = writeBatch(db);

      notifications.forEach(n => {
        if (!n.isRead) {
          batch.update(doc(db, 'notifications', n.id), { isRead: true });
        }
      });

      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  /* Format notifications for UI */
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

  /* Mark single notification as read — uses modular updateDoc */
  const handleNotificationPress = async (notif: NotificationItem) => {
    try {
      console.log('notif.type:', notif.type, '| fromUserId:', notif.fromUserId);
      if (!notif.isRead) {
        const db = getFirestore();
        await updateDoc(doc(db, 'notifications', notif.id), { isRead: true });
      }

      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // if (notif.type === 'ENGAGEMENT_SENT' && notif.fromUserId) {
      //   // Worker receives this — navigate to chat with employer
      //   const chatId = await createOrGetChat(notif.fromUserId);
      //   navigation.navigate('ChatDetailScreen', {
      //     chatId,
      //     otherUserId: notif.fromUserId,
      //   });
      // }

      // if (notif.type === 'ENGAGEMENT_ACCEPTED' && notif.fromUserId) {
      //   // Employer receives this — fromUserId is the worker
      //   const chatId = await createOrGetChat(notif.fromUserId);
      //   navigation.navigate('ChatDetailScreen', {
      //     chatId,
      //     otherUserId: notif.fromUserId,
      //   });
      // }
      if (notif.type === 'ENGAGEMENT_SENT' && notif.fromUserId) {
        // chatId IS the engagementId — no need to create a new chat
        const chatId = notif.data?.engagementId;
        if (!chatId) return;
        navigation.navigate('ChatDetailScreen', {
          chatId,
          otherUserId: notif.fromUserId,
        });
      }

      if (notif.type === 'ENGAGEMENT_ACCEPTED' && notif.fromUserId) {
        const chatId = notif.data?.engagementId;
        if (!chatId) return;
        navigation.navigate('ChatDetailScreen', {
          chatId,
          otherUserId: notif.fromUserId,
        });
      }

      // JOB_APPLY — employer taps notification → sees applicant contact details
      if (notif.type === 'JOB_APPLY' && notif.data?.jobId) {
        navigation.navigate('JobApplications', {
          jobId: notif.data.jobId,
        });
      }

      // if (notif.type === 'ENGAGEMENT_DECLINED') {
      //   // No chat navigation needed
      //   console.log(
      //     'notif.type:',
      //     notif.type,
      //     '| fromUserId:',
      //     notif.fromUserId,
      //   );
      // }
    } catch (err) {
      console.log('Notification update failed', err);
    }
  };

  const handleEngagementAction = async (
    notif: NotificationItem,
    action: 'accepted' | 'declined',
  ) => {
    const engagementId = notif.data?.engagementId;
    if (!engagementId) return;

    setEngagementLoading(engagementId + action);
    // try {
    //   await updateEngagementStatus(
    //     engagementId,
    //     action,
    //     notif.fromUserId,
    //     notif.data?.workerId,
    //   );
    //   setEngagementDecisions(prev => ({ ...prev, [engagementId]: action }));
    //   queryClient.invalidateQueries({ queryKey: ['notifications'] });
    // } catch (err: any) {
    //   console.log('Engagement action failed:', err);
    // } finally {
    //   setEngagementLoading(null);
    // }
    try {
      await updateEngagementStatus(
        engagementId,
        action,
        notif.fromUserId,
        notif.data?.workerId,
      );

      // Sync offerCard status in the chat message so ChatDetailScreen reflects the change
      // The chat message stores engagementId inside metadata.offerCard.engagementId
      // We query all messages across both possible chat participants to find the matching one
      try {
        const db = getFirestore();
        // const currentUid = notif.data?.workerId; // current user is the worker for ENGAGEMENT_SENT
        // const employerUid = notif.fromUserId;

        // Chat ID is deterministic: sorted uids joined by _
        const chatId = engagementId;
        const messagesRef = collection(db, 'chats', chatId, 'messages');

        const msgQuery = query(
          messagesRef,
          where('metadata.offerCard.engagementId', '==', engagementId),
        );
        const msgSnap = await getDocs(msgQuery);

        if (!msgSnap.empty) {
          const msgRef = doc(
            db,
            'chats',
            chatId,
            'messages',
            msgSnap.docs[0].id,
          );
          await updateDoc(msgRef, {
            'metadata.offerCard.status': action, // 'accepted' | 'declined'
          });
        }
      } catch (syncErr) {
        // Non-critical — chat will still show correct state on next open via engagement listener
        console.warn('Chat message sync failed:', syncErr);
      }

      setEngagementDecisions(prev => ({ ...prev, [engagementId]: action }));
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err: any) {
      console.log('Engagement action failed:', err);
    } finally {
      setEngagementLoading(null);
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFD900"
            />
          }
        >
          {sections.map(section => {
            const items = filteredNotifications.filter(
              n => n.section === section,
            );
            if (items.length === 0) return null;

            return (
              <View key={section}>
                <Text style={styles.sectionTitle}>{section}</Text>

                {items.map(item => (
                  // <TouchableOpacity
                  //   key={item.id}
                  //   style={styles.notificationCard}
                  //   onPress={() => handleNotificationPress(item.raw)}
                  // >
                  //   {mapNotificationTypeToIcon(item.type, item.isNew)}

                  //   <View style={styles.notificationContent}>
                  //     <View style={styles.notificationHeader}>
                  //       <Text style={styles.notificationTitle}>
                  //         {item.title}
                  //       </Text>
                  //       <Text style={styles.notificationTime}>{item.time}</Text>
                  //     </View>

                  //     {!!item.jobTitle && (
                  //       <Text
                  //         style={styles.notificationDescription}
                  //         numberOfLines={1}
                  //       >
                  //         {item.jobTitle}
                  //       </Text>
                  //     )}

                  //     {!item.jobTitle && !!item.description && (
                  //       <Text
                  //         style={styles.notificationDescription}
                  //         numberOfLines={2}
                  //       >
                  //         {item.description}
                  //       </Text>
                  //     )}

                  //     {item.jobRate && item.jobUnit && (
                  //       <Text
                  //         style={styles.notificationDescription}
                  //         numberOfLines={1}
                  //       >
                  //         €{item.jobRate}/{item.jobUnit} · Tap to view
                  //       </Text>
                  //     )}
                  //   </View>
                  //   {/* Accept/Decline for ENGAGEMENT_SENT only */}
                  //   {item.type === 'ENGAGEMENT_SENT' && (
                  //     <View
                  //       style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}
                  //     >
                  //       <TouchableOpacity
                  //         style={{
                  //           flex: 1,
                  //           backgroundColor: '#2BEE79',
                  //           borderRadius: 8,
                  //           paddingVertical: 8,
                  //           alignItems: 'center',
                  //         }}
                  //         disabled={!!engagementLoading}
                  //         onPress={() =>
                  //           handleEngagementAction(item.raw, 'accepted')
                  //         }
                  //       >
                  //         {engagementLoading ===
                  //         item.raw.data?.engagementId + 'accepted' ? (
                  //           <ActivityIndicator size="small" color="#000" />
                  //         ) : (
                  //           <Text style={{ color: '#000', fontWeight: '600' }}>
                  //             Accept
                  //           </Text>
                  //         )}
                  //       </TouchableOpacity>

                  //       <TouchableOpacity
                  //         style={{
                  //           flex: 1,
                  //           backgroundColor: '#1a1a1a',
                  //           borderRadius: 8,
                  //           paddingVertical: 8,
                  //           alignItems: 'center',
                  //           borderWidth: 1,
                  //           borderColor: '#DC2626',
                  //         }}
                  //         disabled={!!engagementLoading}
                  //         onPress={() =>
                  //           handleEngagementAction(item.raw, 'declined')
                  //         }
                  //       >
                  //         {engagementLoading ===
                  //         item.raw.data?.engagementId + 'declined' ? (
                  //           <ActivityIndicator size="small" color="#DC2626" />
                  //         ) : (
                  //           <Text
                  //             style={{ color: '#DC2626', fontWeight: '600' }}
                  //           >
                  //             Decline
                  //           </Text>
                  //         )}
                  //       </TouchableOpacity>
                  //     </View>
                  //   )}
                  // </TouchableOpacity>

                  <TouchableOpacity
                    key={item.id}
                    style={styles.notificationCard}
                    onPress={() => handleNotificationPress(item.raw)}
                  >
                    {/* Top row: icon + text */}
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      {mapNotificationTypeToIcon(item.type, item.isNew)}
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationHeader}>
                          <Text style={styles.notificationTitle}>
                            {item.title}
                          </Text>
                          <Text style={styles.notificationTime}>
                            {item.time}
                          </Text>
                        </View>
                        {!!item.jobTitle && (
                          <Text
                            style={styles.notificationDescription}
                            numberOfLines={1}
                          >
                            {item.jobTitle}
                          </Text>
                        )}
                        {!item.jobTitle && !!item.description && (
                          <Text
                            style={styles.notificationDescription}
                            numberOfLines={2}
                          >
                            {item.description}
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
                    </View>

                    {/* Accept/Decline buttons — full width below */}
                    {/* {item.type === 'ENGAGEMENT_SENT' && (
                      <View
                        style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}
                      >
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            backgroundColor: '#FFD900',
                            borderRadius: 8,
                            paddingVertical: 8,
                            alignItems: 'center',
                          }}
                          disabled={!!engagementLoading}
                          onPress={() =>
                            handleEngagementAction(item.raw, 'accepted')
                          }
                        >
                          {engagementLoading ===
                          item.raw.data?.engagementId + 'accepted' ? (
                            <ActivityIndicator size="small" color="#000" />
                          ) : (
                            <Text style={{ color: '#000', fontWeight: '600' }}>
                              Accept
                            </Text>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            flex: 1,
                            backgroundColor: '#1a1a1a',
                            borderRadius: 8,
                            paddingVertical: 8,
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: '#FFD900',
                          }}
                          disabled={!!engagementLoading}
                          onPress={() =>
                            handleEngagementAction(item.raw, 'declined')
                          }
                        >
                          {engagementLoading ===
                          item.raw.data?.engagementId + 'declined' ? (
                            <ActivityIndicator size="small" color="#FFD900" />
                          ) : (
                            <Text
                              style={{ color: '#FFD900', fontWeight: '600' }}
                            >
                              Decline
                            </Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    )} */}
                    {item.type === 'ENGAGEMENT_SENT' &&
                      (() => {
                        const engId = item.raw.data?.engagementId;
                        const decision = engagementDecisions[engId];

                        if (decision) {
                          return (
                            <View style={{ marginTop: 12 }}>
                              <Text
                                style={{
                                  color:
                                    decision === 'accepted'
                                      ? '#2BEE79'
                                      : '#DC2626',
                                  fontWeight: '600',
                                  fontSize: 13,
                                }}
                              >
                                {decision === 'accepted'
                                  ? '✓ Accepted'
                                  : '✕ Declined'}
                              </Text>
                            </View>
                          );
                        }

                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              gap: 8,
                              marginTop: 12,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                flex: 1,
                                backgroundColor: '#FFD900',
                                borderRadius: 8,
                                paddingVertical: 8,
                                alignItems: 'center',
                              }}
                              disabled={!!engagementLoading}
                              onPress={() =>
                                handleEngagementAction(item.raw, 'accepted')
                              }
                            >
                              {engagementLoading === engId + 'accepted' ? (
                                <ActivityIndicator size="small" color="#000" />
                              ) : (
                                <Text
                                  style={{ color: '#000', fontWeight: '600' }}
                                >
                                  Accept
                                </Text>
                              )}
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                flex: 1,
                                backgroundColor: '#1a1a1a',
                                borderRadius: 8,
                                paddingVertical: 8,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: '#FFD900',
                              }}
                              disabled={!!engagementLoading}
                              onPress={() =>
                                handleEngagementAction(item.raw, 'declined')
                              }
                            >
                              {engagementLoading === engId + 'declined' ? (
                                <ActivityIndicator
                                  size="small"
                                  color="#FFD900"
                                />
                              ) : (
                                <Text
                                  style={{
                                    color: '#FFD900',
                                    fontWeight: '600',
                                  }}
                                >
                                  Decline
                                </Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        );
                      })()}
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
