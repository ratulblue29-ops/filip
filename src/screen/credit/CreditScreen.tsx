import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  History,
  Gift,
  Clock4,
  Gem,
  ChevronRight,
  MedalIcon,
  PlayCircleIcon,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import UsersAddIcon from '../../components/svg/UsersAddIcon';

import Toast from 'react-native-toast-message';

import { getApp } from '@react-native-firebase/app';
import { getAuth, getIdToken } from '@react-native-firebase/auth';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';

import { useStripe } from '@stripe/stripe-react-native';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser } from '../../services/user';

const CreditsScreen = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  /**
   * =====================================
   * BUY CREDIT PACK (Stripe PaymentSheet)
   * =====================================
   */
  const handleBuyCredits = async (
    pack: 'credit_1' | 'credit_5' | 'credit_12' | 'credit_30',
  ) => {
    try {
      setLoadingPack(pack);

      const auth = getAuth();
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        Toast.show({
          type: 'error',
          text1: 'Please login first to buy credits.',
        });
        return;
      }

      await getIdToken(firebaseUser, true);

      const app = getApp();
      const functions = getFunctions(app, 'us-central1');

      const createCreditPackPaymentIntent = httpsCallable(
        functions,
        'createCreditPackPaymentIntent',
      );

      const response: any = await createCreditPackPaymentIntent({ pack });

      const clientSecret = response?.data?.clientSecret;

      if (!clientSecret) {
        throw new Error('No client secret received from server');
      }

      // Init Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'GoldShift',
      });

      if (initError) {
        Toast.show({
          type: 'error',
          text1: initError.message,
        });
        return;
      }

      // Present Payment Sheet
      const { error } = await presentPaymentSheet();

      if (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Credits purchased successfully!',
      });

      // Refresh Firestore user credits instantly
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err?.message || 'Something went wrong',
      });
    } finally {
      setLoadingPack(null);
    }
  };

  const isPremium = user?.membership?.tier === 'premium';
  const displayBalance = isPremium ? 'Unlimited' : user?.credits?.balance ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Credit Score</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>

          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 10 }} />
          ) : (
            <View style={styles.balanceAmountRow}>
              <Text style={styles.balanceNumber}>{displayBalance}</Text>
              <Text style={styles.balanceText}>Credits</Text>
            </View>
          )}

          <View style={styles.actionButtonsRow}>
            {/* History button — navigates to CreditHistoryScreen */}
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('CreditHistory')}
            >
              <History width={20} height={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <Gift width={22} height={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Purchase Pack Section */}
        <Text style={styles.sectionTitle}>Purchase Pack</Text>

        <View style={styles.packGrid}>
          {/* 1 Credit Pack */}
          <View style={styles.smallPackCard}>
            <View style={styles.clockIconWrapper}>
              <Clock4 width={24} height={24} color="#FFD900" />
            </View>
            <Text style={styles.smallPackTitle}>Starter</Text>
            <Text style={styles.smallPackTitle}>1 Credit</Text>

            <TouchableOpacity
              style={styles.starterPackButton}
              activeOpacity={0.7}
              onPress={() => handleBuyCredits('credit_1')}
              disabled={loadingPack !== null}
            >
              <Text style={styles.starterPackButtonText}>
                {loadingPack === 'credit_1' ? '...' : '€1.99'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 5 Credits Pack */}
          <View style={styles.smallPackCard}>
            <View style={styles.offersBadge}>
              <Text style={styles.offersBadgeText}>Offers</Text>
            </View>
            <View style={styles.clockIconWrapper}>
              <Clock4 width={24} height={24} color="#FFD900" />
            </View>
            <Text style={styles.smallPackTitle}>Bundle</Text>
            <Text style={styles.smallPackTitle}>5 Credits</Text>

            <TouchableOpacity
              style={styles.seasonalPackButton}
              activeOpacity={0.7}
              onPress={() => handleBuyCredits('credit_5')}
              disabled={loadingPack !== null}
            >
              <Text style={styles.seasonalPackButtonText}>
                {loadingPack === 'credit_5' ? '...' : '€7.99'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 12 Credits Pack */}
        <View style={styles.premiumPackCard}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>

          <View style={styles.premiumPackContent}>
            <View style={styles.premiumPackLeft}>
              <View style={styles.wrapGem}>
                <Gem width={32} height={32} color="#ffffff" />
              </View>

              <View style={styles.premiumPackInfo}>
                <Text style={styles.premiumPackTitle}>Pro Pack</Text>
                <Text style={styles.premiumPackCredits}>12 Credits</Text>
              </View>

              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>Save 20%</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.premiumPackButton}
              activeOpacity={0.7}
              onPress={() => handleBuyCredits('credit_12')}
              disabled={loadingPack !== null}
            >
              <Text style={styles.premiumPackButtonText}>
                {loadingPack === 'credit_12' ? '...' : '€14.99'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 30 Credits Pack */}
        <View style={styles.elitePackCard}>
          <View style={styles.bestValueBadge}>
            <Text style={styles.bestValueBadgeText}>Best Value</Text>
          </View>

          <View style={styles.elitePackContent}>
            <View style={styles.elitePackLeft}>
              <View style={styles.wrapMedalIcon}>
                <MedalIcon width={32} height={32} color="#000000" />
              </View>

              <View style={styles.elitePackInfo}>
                <Text style={styles.elitePackTitle}>ELITE</Text>
                <Text style={styles.elitePackCredits}>30 Credits</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.elitePackButton}
              activeOpacity={0.7}
              onPress={() => handleBuyCredits('credit_30')}
              disabled={loadingPack !== null}
            >
              <Text style={styles.elitePackButtonText}>
                {loadingPack === 'credit_30' ? '...' : '€34.99'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Earn Free Credits Section */}
        <View style={styles.dividerRow}>
          <Text style={styles.dividerText}>Or Earn Free</Text>
        </View>

        {/* Watch Videos Card */}
        <TouchableOpacity style={styles.earnCard} activeOpacity={0.7}>
          <View style={styles.earnCardLeft}>
            <View style={styles.playIconWrapper}>
              <PlayCircleIcon width={24} height={24} color="#76C6FF" />
            </View>
            <View style={styles.earnCardInfo}>
              <View style={styles.earnCardTitleRow}>
                <Text style={styles.earnCardTitle}>Watch 5 Videos</Text>
                <View style={styles.creditBadge}>
                  <Text style={styles.creditBadgeText}>+1 Credit</Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar}>
                  <View style={styles.progressBarFill} />
                </View>
              </View>

              <Text style={styles.progressText}>
                0/5 Watched (Resets Weekly)
              </Text>
            </View>
          </View>

          <ChevronRight width={20} height={20} color="#ffffff" />
        </TouchableOpacity>

        {/* Refer Colleague Card */}
        <TouchableOpacity style={styles.earnCard} activeOpacity={0.7}>
          <View style={styles.earnCardLeft}>
            <View style={styles.usersIconWrapper}>
              <UsersAddIcon width={24} height={24} color="#34D399" />
            </View>
            <View style={styles.earnCardInfo}>
              <View style={styles.earnCardTitleRow}>
                <Text style={styles.earnCardTitle}>Refer A Colleague</Text>
                <View style={styles.creditBadge}>
                  <Text style={styles.creditBadgeText}>+1 Credit</Text>
                </View>
              </View>
              <Text style={styles.referSubtext}>
                Invite Friends To Join Goldshift
              </Text>
            </View>
          </View>

          <ChevronRight width={20} height={20} color="#ffffff" />
        </TouchableOpacity>

        {loadingPack && (
          <ActivityIndicator style={{ marginTop: 15, marginBottom: 30 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditsScreen;
