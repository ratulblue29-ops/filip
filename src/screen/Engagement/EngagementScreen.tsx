import React, { useMemo, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock4 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

import TrophyIcon from '../../components/svg/TrophyIcon';
import BadgeIcon from '../../components/svg/BadgeIcon';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import {
  fetchReceivedEngagements,
  fetchSentEngagements,
  updateEngagementStatus,
} from '../../services/engagement';
import { useTranslation } from 'react-i18next';

const EngagementScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('received');

  const handleGoBack = () => navigation.goBack();

  const {
    data: receivedEngagements = [],
    isLoading: receivedLoading,
    refetch: refetchReceived,
  } = useQuery({
    queryKey: ['receivedEngagements'],
    queryFn: fetchReceivedEngagements,
    enabled: activeTab === 'received',
  });

  const {
    data: sentEngagements = [],
    isLoading: sentLoading,
    refetch: refetchSent,
  } = useQuery({
    queryKey: ['sentEngagements'],
    queryFn: fetchSentEngagements,
    enabled: activeTab === 'sent',
  });

  const engagementsToShow = useMemo(() => {
    return activeTab === 'received' ? receivedEngagements : sentEngagements;
  }, [activeTab, receivedEngagements, sentEngagements]);

  const isLoading = activeTab === 'received' ? receivedLoading : sentLoading;

  // Accept — worker accepts incoming engagement
  const { mutate: acceptMutation, isPending: acceptPending } = useMutation({
    mutationFn: ({
      engagementId,
      fromUserId,
      workerId,
    }: {
      engagementId: string;
      fromUserId: string;
      workerId: string;
    }) =>
      updateEngagementStatus(engagementId, 'accepted', fromUserId, workerId),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: t('engagement.toast_accepted') });
      queryClient.invalidateQueries({ queryKey: ['receivedEngagements'] });
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error?.message || t('engagement.toast_accept_failed') });
    },
  });

  // Decline — worker declines incoming engagement, employer credit refunded
  const { mutate: declineMutation, isPending: declinePending } = useMutation({
    mutationFn: ({
      engagementId,
      fromUserId,
    }: {
      engagementId: string;
      fromUserId: string;
    }) => updateEngagementStatus(engagementId, 'declined', fromUserId),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: t('engagement.toast_declined') });
      queryClient.invalidateQueries({ queryKey: ['receivedEngagements'] });
    },
    onError: (error: any) => {
      Toast.show({ type: 'error', text1: error?.message || t('engagement.toast_decline_failed') });
    },
  });

  const isMutating = acceptPending || declinePending;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted':
        return styles.statusAccepted;
      case 'pending':
        return styles.statusPending;
      case 'declined':
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return t('engagement.status_accepted');
      case 'pending': return t('engagement.status_pending');
      case 'declined':
      case 'rejected': return t('engagement.status_rejected');
      default: return t('engagement.status_pending');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('engagement.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => {
            setActiveTab('received');
            refetchReceived();
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'received' && styles.activeTabText,
            ]}
          >
            {t('engagement.received_tab')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => {
            setActiveTab('sent');
            refetchSent();
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'sent' && styles.activeTabText,
            ]}
          >
            {t('engagement.sent_tab')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFD900" />
        ) : engagementsToShow.length === 0 ? (
          <Text style={styles.emptyStateText}>{t('engagement.no_offers')}</Text>
        ) : (
          engagementsToShow.map((offer: any) => {
            const status = offer.status || 'pending';

            return (
              <View
                key={offer.id}
                style={[
                  styles.offerCard,
                  (status === 'rejected' || status === 'declined') &&
                  styles.offerCardRejected,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconCircle}>
                    {offer.type === 'glass' ? (
                      <TrophyIcon width={24} height={24} color="#000000" />
                    ) : (
                      <BadgeIcon
                        width={24}
                        height={24}
                        primaryColor="#F4922E"
                        backgroundColor="transparent"
                      />
                    )}
                  </View>

                  <View style={styles.cardInfo}>
                    <View style={styles.titleRow}>
                      <Text style={styles.offerTitle}>{t('engagement.request_title')}</Text>
                      <Text style={styles.offerRate}>{'—'}</Text>
                      <View style={getStatusStyle(status)}>
                        <Text
                          style={[
                            styles.statusText,
                            status === 'accepted' && styles.statusTextAccepted,
                            status === 'pending' && styles.statusTextPending,
                            (status === 'rejected' || status === 'declined') &&
                            styles.statusTextRejected,
                          ]}
                        >
                          {getStatusText(status)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.venue}>
                      {offer.availabilityPostId || '—'}
                    </Text>

                    <View style={styles.scheduleRow}>
                      <Clock4 width={16} height={16} color="#FFD900" />
                      <Text style={styles.scheduleText}>
                        {offer.schedule || t('engagement.no_schedule')}
                      </Text>
                    </View>

                    {/* Accept / Decline — only for received + pending engagements */}
                    {activeTab === 'received' && status === 'pending' && (
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          onPress={() =>
                            acceptMutation({
                              engagementId: offer.id,
                              fromUserId: offer.fromUserId,
                              workerId: offer.workerId,
                            })
                          }
                          disabled={isMutating}
                          activeOpacity={0.8}
                          style={[
                            styles.acceptBtn,
                            isMutating && { opacity: 0.6 },
                          ]}
                        >
                          <Text style={styles.acceptBtnText}>{t('engagement.accept')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() =>
                            declineMutation({
                              engagementId: offer.id,
                              fromUserId: offer.fromUserId,
                            })
                          }
                          disabled={isMutating}
                          activeOpacity={0.8}
                          style={[
                            styles.declineBtn,
                            isMutating && { opacity: 0.6 },
                          ]}
                        >
                          <Text style={styles.declineBtnText}>{t('engagement.decline')}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EngagementScreen;
