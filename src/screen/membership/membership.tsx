import React, {useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styles from './style';
import {RootStackParamList} from '../../navigator/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MembershipScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'monthly',
  );

  const handleChooseStandard = () => {
    console.log('Standard plan selected');
  };

  const handleGoPremium = () => {
    console.log('Premium plan selected');
  };

  const handleRestore = () => {
    console.log('Restore purchases');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership Plans</Text>
        <TouchableOpacity onPress={handleRestore}>
          <Text style={styles.restoreText}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Upgrade Your Experience</Text>
          <Text style={styles.subtitle}>
            Unlock exclusive tools and visibility for{'\n'}hospitality professionals.
          </Text>
        </View>

        {/* Plan Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedPlan === 'monthly' && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedPlan('monthly')}>
            <Text
              style={[
                styles.toggleText,
                selectedPlan === 'monthly' && styles.toggleTextActive,
              ]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              selectedPlan === 'yearly' && styles.toggleButtonActive,
            ]}
            onPress={() => setSelectedPlan('yearly')}>
            <Text
              style={[
                styles.toggleText,
                selectedPlan === 'yearly' && styles.toggleTextActive,
              ]}>
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
            <Text style={styles.priceAmount}>€10</Text>
            <Text style={styles.priceUnit}>/mo</Text>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.checkIconGold}>✓</Text>
              <Text style={styles.featureText}>50 Monthly Credits</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.checkIconGold}>✓</Text>
              <Text style={styles.featureText}>1 Job Ad Post</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.crossIcon}>✕</Text>
              <Text style={styles.featureTextDisabled}>Direct Messaging</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.standardButton}
            onPress={handleChooseStandard}>
            <Text style={styles.standardButtonText}>Choose Standard</Text>
          </TouchableOpacity>
        </View>

        {/* Premium Plan */}
        <View style={styles.premiumCard}>
          <View style={styles.popularBadge}>
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>

          <Text style={styles.premiumName}>Premium</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>€17</Text>
            <Text style={styles.priceUnit}>/mo</Text>
          </View>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.checkIconGold}>✓</Text>
              <Text style={styles.featureText}>Unlimited Credits</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.checkIconGold}>✓</Text>
              <Text style={styles.featureText}>Direct Messaging</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.checkIconGold}>✓</Text>
              <Text style={styles.featureText}>TopVisibility</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.checkIconGold}>✓</Text>
              <Text style={styles.featureText}>Priority Support</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.premiumButton}
            onPress={handleGoPremium}>
            <Text style={styles.premiumButtonText}>Go Premium</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>
          Subscription auto-renews unless turned off at least 24 hours{'\n'}before the end of the current period.{' '}
          <Text style={styles.disclaimerLink}>Terms apply</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MembershipScreen;