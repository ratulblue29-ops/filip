import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ArrowRight, BadgeCheck, Infinity, Zap } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import styles from "./style";

import PremiumIcon from "../../components/svg/PremiumIcon";
import PlanListCard from "../../components/purchase/PlanListCard";
import PlanToggle from "../../components/purchase/PlanToggle";
import PlanHeader from "../../components/purchase/PlanHeader";
import CommissionIcon from "../../components/svg/CommissionIcon";

// import { getApp } from "@react-native-firebase/app";
// import { getAuth, getIdToken } from "@react-native-firebase/auth";
// import { getFunctions, httpsCallable, } from "@react-native-firebase/functions";

// import { useStripe } from "@stripe/stripe-react-native";
import Purchases from 'react-native-purchases';
import { RC_PRODUCT_IDS } from '../../services/revenueCat';
import { useQueryClient } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

const PurchaseScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  // const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const queryClient = useQueryClient();

  const [selectedPlan, setSelectedPlan] =
    useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  // const handleUpgrade = async () => {
  //   try {
  //     setLoading(true);

  //     const auth = getAuth();
  //     const user = auth.currentUser;

  //     if (!user) {
  //       Alert.alert(t('purchase.alert_error'), t('purchase.alert_not_logged'));
  //       return;
  //     }

  //     console.log("User UID:", user.uid);

  //     // 🔥 Force refresh token
  //     await user.getIdToken(true);

  //     const app = getApp();
  //     const functions = getFunctions(app, "us-central1");
  //     const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");
  //     const response: any = await createPaymentIntent({
  //       plan: selectedPlan === "monthly" ? "basic" : "premium",
  //     });
  //     const clientSecret = response?.data?.clientSecret;
  //     if (!clientSecret) { throw new Error("No client secret received"); }
  //     const { error: initError } = await initPaymentSheet({
  //       paymentIntentClientSecret: clientSecret,
  //       merchantDisplayName: "GoldShift",
  //     });
  //     if (initError) { Alert.alert(t('purchase.alert_payment_failed'), initError.message); return; }
  //     const { error } = await presentPaymentSheet();
  //     if (error) { Alert.alert(t('purchase.alert_payment_failed'), error.message); return; }
  //     Alert.alert(t('purchase.alert_success'), t('purchase.alert_success_sub'));
  //     navigation.goBack();

  //   } catch (error: any) {
  //     console.log("FULL ERROR:", error);
  //     Alert.alert(t('purchase.alert_error'), error?.message || t('purchase.alert_generic'));
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleUpgrade = async () => {
    try {
      setLoading(true);

      const productId = selectedPlan === 'monthly'
        ? RC_PRODUCT_IDS.basic
        : RC_PRODUCT_IDS.premium;

      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages.find(
        p => p.product.identifier === productId,
      );

      if (!pkg) {
        throw new Error('Product not found. Please try again later.');
      }

      await Purchases.purchasePackage(pkg);

      queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      Alert.alert(t('purchase.alert_success'), t('purchase.alert_success_sub'));
      navigation.goBack();
    } catch (err: any) {
      if (err?.userCancelled) return;
      Alert.alert(t('purchase.alert_error'), err?.message || t('purchase.alert_generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <PlanHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerIconContainer}>
          <PremiumIcon />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>{t('purchase.unlock')}</Text>
          <Text style={styles.secondaryTitle}>{t('purchase.potential')}</Text>
          <Text style={styles.subtitle}>
            {t('purchase.subtitle')}
          </Text>
        </View>

        <PlanToggle
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />

        <View style={styles.planListCardContainer}>
          <PlanListCard
            icon={<Infinity width={24} height={24} color="#F6DF60" />}
            title={t('purchase.feature_unlimited')}
            subtitle={t('purchase.feature_unlimited_sub')}
          />
          <PlanListCard
            icon={<BadgeCheck width={24} height={24} color="#F6DF60" />}
            title={t('purchase.feature_highlight')}
            subtitle={t('purchase.feature_highlight_sub')}
          />
          <PlanListCard
            icon={<CommissionIcon width={24} height={24} color="#F6DF60" />}
            title={t('purchase.feature_commission')}
            subtitle={t('purchase.feature_commission_sub')}
          />
          <PlanListCard
            icon={<Zap width={20} height={20} color="#F6DF60" />}
            title={t('purchase.feature_early')}
            subtitle={t('purchase.feature_early_sub')}
          />

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{t('purchase.total_today')}</Text>
            <Text style={styles.priceTextActive}>
              {selectedPlan === "monthly" ? "€7.99" : "€24.99"}
              <Text style={styles.priceMonth}>{t('purchase.per_month')}</Text>
            </Text>
          </View>

          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={handleUpgrade}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Text style={styles.upgradeButtonText}>
                  {t('purchase.upgrade_btn')}
                </Text>
                <ArrowRight />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PurchaseScreen;
