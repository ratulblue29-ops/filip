import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock4 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

import TrophyIcon from '../../components/svg/TrophyIcon';
import BadgeIcon from '../../components/svg/BadgeIcon';

const EngagementScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('received');
  const handleGoBack = () => {
    navigation.goBack();
  };

  const receivedOffers = [
    {
      id: '1',
      title: 'Senior Bartender',
      venue: 'The Golden Tap',
      rate: '€25/Hr',
      status: 'action-needed',
      schedule: 'Today,Oct 25 • 6:00 PM - 12:00 AM',
      icon: 'glass',
    },
    {
      id: '2',
      title: 'Event Server',
      venue: 'Grand Hotel Events',
      rate: '€25/Hr',
      status: 'accepted',
      schedule: 'Fri,Oct 25 • 6:00 PM - 12:00 AM',
      icon: 'event',
    },
    {
      id: '3',
      title: 'Sous Chef',
      venue: 'Grand Hotel Events',
      rate: '€25/Hr',
      status: 'pending',
      schedule: 'Today,Oct 25 • 6:00 PM - 12:00 AM',
      icon: 'glass',
    },
    {
      id: '4',
      title: 'Barback',
      venue: 'Grand Hotel Events',
      rate: '€18/Hr',
      status: 'rejected',
      schedule: 'Today,Oct 25 • 6:00 PM - 12:00 AM',
      icon: 'glass',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'action-needed':
        return styles.statusActionNeeded;
      case 'accepted':
        return styles.statusAccepted;
      case 'pending':
        return styles.statusPending;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'action-needed':
        return 'Action Needed';
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending';
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
          onPress={() => setActiveTab('received')}
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
          onPress={() => setActiveTab('sent')}
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
        {receivedOffers.map(offer => (
          <View
            key={offer.id}
            style={[
              styles.offerCard,
              offer.status === 'rejected' && styles.offerCardRejected,
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                {offer.icon === 'glass' ? (
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
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerRate}>{offer.rate}</Text>
                  <View style={getStatusStyle(offer.status)}>
                    <Text
                      style={[
                        styles.statusText,
                        offer.status === 'action-needed' &&
                          styles.statusTextActionNeeded,
                        offer.status === 'accepted' &&
                          styles.statusTextAccepted,
                        offer.status === 'pending' && styles.statusTextPending,
                        offer.status === 'rejected' &&
                          styles.statusTextRejected,
                      ]}
                    >
                      {getStatusText(offer.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.venue}>{offer.venue}</Text>
                <View style={styles.scheduleRow}>
                  <Clock4 width={16} height={16} color="#FFD900" />
                  <Text style={styles.scheduleText}>{offer.schedule}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EngagementScreen;
