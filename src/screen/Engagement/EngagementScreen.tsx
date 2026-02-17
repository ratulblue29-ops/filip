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
import {
  acceptOffer,
  declineOffer,
  fetchReceivedOffers,
  fetchSentOffers,
} from '../../services/offer';
import AcceptDeclineBtn from '../../components/AcceptDeclineBtn';
import Toast from 'react-native-toast-message';
import {
  fetchReceivedEngagements,
  fetchSentEngagements,
} from '../../services/engagement';

const EngagementScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('received');

  const handleGoBack = () => {
    navigation.goBack();
  };

  // query
  const {
    data: receivedOffers = [],
    isLoading: receivedLoading,
    refetch: refetchReceived,
  } = useQuery({
    queryKey: ['receivedEngagements'],
    queryFn: fetchReceivedEngagements,
    enabled: activeTab === 'received',
  });

  const {
    data: sentOffers = [],
    isLoading: sentLoading,
    refetch: refetchSent,
  } = useQuery({
    queryKey: ['sentEngagements'],
    queryFn: fetchSentEngagements,
    enabled: activeTab === 'sent',
  });

  const offersToShow = useMemo(() => {
    return activeTab === 'received' ? receivedOffers : sentOffers;
  }, [activeTab, receivedOffers, sentOffers]);

  const isLoading = activeTab === 'received' ? receivedLoading : sentLoading;

  // const { mutate: acceptMutation } = useMutation({
  //   mutationFn: acceptOffer,
  //   onSuccess: () => {
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Offer accepted',
  //     });

  //     queryClient.invalidateQueries({ queryKey: ['receivedOffers'] });
  //   },
  //   onError: (error: any) => {
  //     Toast.show({
  //       type: 'error',
  //       text1: error?.message || 'Accept failed',
  //     });
  //   },
  // });

  // const { mutate: declineMutation } = useMutation({
  //   mutationFn: declineOffer,
  //   onSuccess: () => {
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Offer declined',
  //     });
  //     queryClient.invalidateQueries({ queryKey: ['receivedOffers'] });
  //   },
  //   onError: (error: any) => {
  //     Toast.show({
  //       type: 'error',
  //       text1: error?.message || 'Decline failed',
  //     });
  //   },
  // });

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
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending';
      case 'declined':
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My Engagement</Text>
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
            Received Offers
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
            Sent Offers
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#FFD900" />
        ) : offersToShow.length === 0 ? (
          <Text style={styles.emptyStateText}>No offers found</Text>
        ) : (
          offersToShow.map((offer: any) => {
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
                      <Text style={styles.offerTitle}>
                        {'Engagement Request'}
                      </Text>

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
                        {offer.schedule || 'No schedule'}
                      </Text>
                    </View>

                    {/* ✅ Accept / Decline only for Received Offers + Pending */}
                    {activeTab === 'received' && status === 'pending' && (
                      // <View
                      //   style={{
                      //     flexDirection: 'row',
                      //     gap: 10,
                      //     marginTop: 12,
                      //   }}
                      // >
                      //   <TouchableOpacity
                      //     onPress={() => acceptMutation(offer.id)}
                      //     disabled={acceptLoading || declineLoading}
                      //     style={{
                      //       flex: 1,
                      //       backgroundColor: '#00C853',
                      //       paddingVertical: 10,
                      //       borderRadius: 10,
                      //       alignItems: 'center',
                      //       opacity: acceptLoading ? 0.7 : 1,
                      //     }}
                      //   >
                      //     <Text style={{ color: '#000', fontWeight: '700' }}>
                      //       Accept
                      //     </Text>
                      //   </TouchableOpacity>

                      //   <TouchableOpacity
                      //     onPress={() => declineMutation(offer.id)}
                      //     disabled={acceptLoading || declineLoading}
                      //     style={{
                      //       flex: 1,
                      //       backgroundColor: '#FF3D00',
                      //       paddingVertical: 10,
                      //       borderRadius: 10,
                      //       alignItems: 'center',
                      //       opacity: declineLoading ? 0.7 : 1,
                      //     }}
                      //   >
                      //     <Text style={{ color: '#fff', fontWeight: '700' }}>
                      //       Decline
                      //     </Text>
                      //   </TouchableOpacity>
                      // </View>
                      <View style={styles.actionButtons}>
                        {/* <AcceptDeclineBtn
                          handleAccept={() => acceptMutation(offer.id)}
                          handleDecline={() => declineMutation(offer.id)}
                        /> */}
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
