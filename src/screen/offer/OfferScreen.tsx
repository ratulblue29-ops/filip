import React, { useState, useMemo, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  CreditCard,
  Calendar,
  MapPin,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import styles from './style';
import CupIcon from '../../components/svg/CupIcon';
import { fetchMyOffers, updateOfferStatus } from '../../services/applyToJob';

const OfferScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<
    'pending' | 'upcoming' | 'history'
  >('pending');

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const { data: offers = [] } = useQuery({
    queryKey: ['my-offers'],
    queryFn: fetchMyOffers,
  });
  console.log(offers);
  //Filtered Offers
  const filteredOffers = useMemo(() => {
    return offers.filter(o => {
      const status = o.status?.toLowerCase().trim();
      if (activeTab === 'pending') return status === 'pending';
      if (activeTab === 'upcoming') return status === 'accepted';
      if (activeTab === 'history') return status === 'rejected';
      return false;
    });
  }, [offers, activeTab]);
  // Toggle description
  const toggleDescription = useCallback((id: string) => {
    setExpandedCards(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }, []);

  // Accept
  const handleAccept = useCallback(
    async (id: string) => {
      await updateOfferStatus(id, 'accepted');
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
    },
    [queryClient],
  );

  // Decline
  const handleDecline = useCallback(
    async (id: string) => {
      await updateOfferStatus(id, 'rejected');
      queryClient.invalidateQueries({ queryKey: ['my-offers'] });
    },
    [queryClient],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft width={24} height={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My offer</Text>
        <View style={styles.notificationWrapper}>
          <Bell width={24} height={24} color="#fff" />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {['pending', 'upcoming', 'history'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === 'pending'
                ? 'Pending'
                : tab === 'upcoming'
                ? 'Upcoming'
                : 'History'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Empty State */}
        {filteredOffers.length === 0 && (
          <Text style={styles.emptyStateText}>
            No offers found for this section
          </Text>
        )}

        {filteredOffers.map(offer => {
          const job = offer.job;

          return (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <View style={styles.iconCircle}>
                    <CupIcon width={27} height={26} color="#FFD900" />
                  </View>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                </View>
              </View>

              <View style={styles.infoPills}>
                <View style={styles.infoPill}>
                  <CreditCard width={14} height={14} color="#FFD900" />
                  <Text style={styles.infoPillTextYellow}>
                    €{job?.rate?.amount}/{job?.rate?.unit}
                  </Text>
                </View>
                <View style={styles.infoPill}>
                  <Calendar width={14} height={14} color="#9CA3AF" />
                  <Text style={styles.infoPillText}>
                    {job?.schedule?.start ?? '—'}
                  </Text>
                </View>
                <View style={styles.infoPill}>
                  <MapPin width={14} height={14} color="#9CA3AF" />
                  <Text style={styles.infoPillText}>
                    {job?.location?.[0] ?? '—'}
                  </Text>
                </View>
              </View>

              <Text
                style={styles.description}
                numberOfLines={expandedCards.has(offer.id) ? undefined : 2}
              >
                {job.description}
              </Text>

              <TouchableOpacity onPress={() => toggleDescription(offer.id)}>
                <Text style={styles.showMore}>
                  {expandedCards.has(offer.id) ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>

              {activeTab === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => handleDecline(offer.id)}
                  >
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => handleAccept(offer.id)}
                  >
                    <Text style={styles.acceptButtonText}>Accept Offer</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OfferScreen;
