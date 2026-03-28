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

import { getApp } from "@react-native-firebase/app";
import { getAuth, getIdToken } from "@react-native-firebase/auth";
import {
  getFunctions,
  httpsCallable,
} from "@react-native-firebase/functions";

import { useStripe } from "@stripe/stripe-react-native";

const PurchaseScreen = () => {
  const navigation = useNavigation<any>();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [selectedPlan, setSelectedPlan] =
    useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      console.log("User UID:", user.uid);

      // 🔥 Force refresh token
      await user.getIdToken(true);

      // const app = getApp();
      // const functions = getFunctions(app, "us-central1");

      // // ✅ CORRECT FUNCTION NAME
      // const createPaymentIntent = httpsCallable(
      //   functions,
      //   "createPaymentIntent"
      // );

      // const response: any = await createPaymentIntent({
      //   plan: selectedPlan === "monthly" ? "basic" : "premium",
      // });

      // const clientSecret = response?.data?.clientSecret;

      // if (!clientSecret) {
      //   throw new Error("No client secret received");
      // }

      // console.log("Client secret received");

      // const { error, paymentIntent } = await confirmPayment(
      //   clientSecret,
      //   {
      //     paymentMethodType: "Card",
      //   }
      // );

      // if (error) {
      //   Alert.alert("Payment Failed", error.message);
      //   return;
      // }

      // if (paymentIntent) {
      //   Alert.alert("Success", "Payment successful!");
      //   navigation.goBack();
      // }
      const app = getApp();
      const functions = getFunctions(app, "us-central1");
      const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");
      const response: any = await createPaymentIntent({
        plan: selectedPlan === "monthly" ? "basic" : "premium",
      });
      const clientSecret = response?.data?.clientSecret;
      if (!clientSecret) { throw new Error("No client secret received"); }
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "GoldShift",
      });
      if (initError) { Alert.alert("Payment Failed", initError.message); return; }
      const { error } = await presentPaymentSheet();
      if (error) { Alert.alert("Payment Failed", error.message); return; }
      Alert.alert("Success", "Payment successful!");
      navigation.goBack();

    } catch (error: any) {
      console.log("FULL ERROR:", error);
      Alert.alert("Error", error?.message || "Something went wrong");
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
          <Text style={styles.mainTitle}>Unlock Your</Text>
          <Text style={styles.secondaryTitle}>Full Potential</Text>
          <Text style={styles.subtitle}>
            Get hired faster and earn more with GoldShift Premium features.
          </Text>
        </View>

        <PlanToggle
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
        />

        <View style={styles.planListCardContainer}>
          <PlanListCard
            icon={<Infinity width={24} height={24} color="#F6DF60" />}
            title="Unlimited Applications"
            subtitle="Apply to as many jobs as you want."
          />
          <PlanListCard
            icon={<BadgeCheck width={24} height={24} color="#F6DF60" />}
            title="Profile Highlight"
            subtitle="Stand out in employer searches."
          />
          <PlanListCard
            icon={<CommissionIcon width={24} height={24} color="#F6DF60" />}
            title="0% Commission"
            subtitle="Keep 100% of what you earn."
          />
          <PlanListCard
            icon={<Zap width={20} height={20} color="#F6DF60" />}
            title="Early Access"
            subtitle="See gigs 1 hour before free users."
          />

          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>Total today</Text>
            <Text style={styles.priceTextActive}>
              {selectedPlan === "monthly" ? "€7.99" : "€24.99"}
              <Text style={styles.priceMonth}>/month</Text>
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
                  Upgrade Now
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
