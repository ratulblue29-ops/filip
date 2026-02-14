import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { ArrowLeft, Check } from 'lucide-react-native';

import { getApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';

import { useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';

const MemberShipScreen = () => {
  const navigation = useNavigation<any>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'monthly',
  );

  const [loading, setLoading] = useState(false);

  const handlePurchase = async (planType: 'standard' | 'premium') => {
    try {
      setLoading(true);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Toast.show({
          type: 'error',
          text1: 'Please log in to purchase a membership plan.',
        });
        return;
      }

      await user.getIdToken(true);

      const app = getApp();
      const functions = getFunctions(app, 'us-central1');

      const createPaymentIntent = httpsCallable(
        functions,
        'createPaymentIntent',
      );

      //ONLY SEND backend supported plans
      const finalPlan = planType === 'standard' ? 'basic' : 'premium';

      const response: any = await createPaymentIntent({
        plan: finalPlan,
      });

      const clientSecret = response?.data?.clientSecret;

      if (!clientSecret) {
        throw new Error('No client secret received');
      }

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

      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert('Payment failed', error.message);
        return;
      }
      Toast.show({
        type: 'success',
        text1: 'Membership plan purchased successfully!',
      });
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: err?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChooseStandard = () => {
    handlePurchase('standard');
  };

  const handleGoPremium = () => {
    handlePurchase('premium');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <View>
            <ArrowLeft width={22} height={22} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership Plans</Text>
        <View />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Upgrade Your Experience</Text>
          <Text style={styles.subtitle}>
            Unlock exclusive tools and visibility for{'\n'}
            hospitality professionals.
          </Text>
        </View>

        {/* Plan Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedPlan === 'monthly' && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <Text
              style={[
                styles.toggleText,
                selectedPlan === 'monthly' && styles.toggleTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedPlan === 'yearly' && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <Text
              style={[
                styles.toggleText,
                selectedPlan === 'yearly' && styles.toggleTextActive,
              ]}
            >
              Yearly
            </Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>Save 20%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Standard Plan */}
        <View style={styles.planCard}>
          <Text style={styles.planName}>Standard</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>€7.99</Text>
            <Text style={styles.priceUnit}>/mo</Text>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Check width={22} height={22} color="#FFD900" />
              <Text style={styles.featureText}>10 Monthly Credits</Text>
            </View>
            <View style={styles.featureItem}>
              <Check width={22} height={22} color="#FFD900" />{' '}
              <Text style={styles.featureText}>1 Job Ad Post</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.crossIcon}>✕</Text>
              <Text style={styles.featureTextDisabled}>Direct Messaging</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.standardButton}
            onPress={handleChooseStandard}
            disabled={loading}
          >
            <Text style={styles.standardButtonText}>
              {loading ? 'Processing...' : 'Choose Standard'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Premium Plan */}
        <View style={styles.premiumCard}>
          <Text style={styles.premiumName}>Premium</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>€24.99</Text>
            <Text style={styles.priceUnit}>/mo</Text>
          </View>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Check width={22} height={22} color="#FFD900" />
              <Text style={styles.featureText}>Unlimited Credits</Text>
            </View>
            <View style={styles.featureItem}>
              <Check width={22} height={22} color="#FFD900" />
              <Text style={styles.featureText}>Direct Messaging</Text>
            </View>
            <View style={styles.featureItem}>
              <Check width={22} height={22} color="#FFD900" />
              <Text style={styles.featureText}>TopVisibility</Text>
            </View>
            <View style={styles.featureItem}>
              <Check width={22} height={22} color="#FFD900" />
              <Text style={styles.featureText}>Priority Support</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={handleGoPremium}
            disabled={loading}
          >
            <Text style={styles.premiumButtonText}>
              {loading ? 'Processing...' : 'Go Premium'}
            </Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator style={styles.loading} />}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MemberShipScreen;
