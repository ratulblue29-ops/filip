// import React, { useState } from 'react';
// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
// } from 'react-native';
// import { ArrowRight, BadgeCheck, Infinity, Zap } from 'lucide-react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import styles from './style';
// import PremiumIcon from '../../components/svg/PremiumIcon';
// import PlanListCard from '../../components/purchase/PlanListCard';
// import StarIcon from '../../components/svg/StarIcon';
// import { ToastAndroid, Platform, Alert } from 'react-native';
// import PlanToggle from '../../components/purchase/PlanToggle';
// import PlanHeader from '../../components/purchase/PlanHeader';
// import CommissionIcon from '../../components/svg/CommissionIcon';

// const PurchaseScreen = () => {
//   const navigation = useNavigation<any>();
//   const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
//     'monthly',
//   );

//   const HandleTost = () => {
//     const message = 'Premium plan purchased successfully';

//     if (Platform.OS === 'android') {
//       ToastAndroid.showWithGravity(
//         message,
//         ToastAndroid.SHORT,
//         ToastAndroid.BOTTOM
//       );
//     } else {
//       Alert.alert('Success', message);
//     }

//     navigation.goBack();
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Header */}
//       <PlanHeader />
//       <ScrollView contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.headerIconContainer}>
//           <PremiumIcon />
//         </View>
//         {/* Title Section */}
//         <View style={styles.titleSection}>
//           <Text style={styles.mainTitle}>Unlock Your</Text>
//           <Text style={styles.secondaryTitle}>Full Potential</Text>
//           <Text style={styles.subtitle}>
//             Get hired faster and earn more with GoldShift Premium features.
//           </Text>
//         </View>

//         {/* Plan Toggle */}
//         <PlanToggle selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />

//         {/* plan list card */}
//         <View style={styles.planListCardContainer}>
//           <PlanListCard
//             icon={<Infinity width={24} height={24} color="#F6DF60" />}
//             title="Unlimited Applications"
//             subtitle="Apply to as many jobs as you want."
//           />
//           <PlanListCard
//             icon={<BadgeCheck width={24} height={24} color="#F6DF60" />}
//             title="Profile Highlight"
//             subtitle="Stand out in employer searches."
//           />
//           <PlanListCard
//             icon={<CommissionIcon width={24} height={24} color="#F6DF60" />}
//             title="0% Commission"
//             subtitle="Keep 100% of what you earn."
//           />
//           <PlanListCard
//             icon={<Zap width={20} height={20} color="#F6DF60" />}
//             title="Early Access"
//             subtitle="See gigs 1 hour before free users."
//           />

//           {/* review */}
//           <View style={styles.reviewContainer}>
//             <View style={styles.reviewStarContainer}>
//               <StarIcon width={16} height={16} />
//               <StarIcon width={16} height={16} />
//               <StarIcon width={16} height={16} />
//               <StarIcon width={16} height={16} />
//               <StarIcon width={16} height={16} />
//             </View>
//             <Text style={styles.reviewText}>
//               "I found a job within 2 days of upgrading. The early access
//               feature is a game changer!"
//             </Text>
//             <Text style={styles.reviewTextAuthor}>— Sarah Jenkins</Text>
//           </View>
//           {/* price */}
//           <View style={styles.priceContainer}>
//             <Text style={styles.priceText}>Total today</Text>
//             <Text style={styles.priceTextActive}>
//               €9.99<Text style={styles.priceMonth}>/month</Text>
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.upgradeButton}
//             onPress={HandleTost}
//           >
//             <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
//             <ArrowRight />
//           </TouchableOpacity>

//           {/* terms and restore purchase */}
//           <View style={styles.termsContainer}>
//             <TouchableOpacity>
//               <Text style={styles.termsText}>Terms of Service</Text>
//             </TouchableOpacity>

//             <TouchableOpacity>
//               <Text style={styles.termsText}>Restore Purchase</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default PurchaseScreen;

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
import { getAuth } from "@react-native-firebase/auth";
import {
  getFunctions,
  httpsCallable,
} from "@react-native-firebase/functions";

import { useStripe } from "@stripe/stripe-react-native";

const PurchaseScreen = () => {
  const navigation = useNavigation<any>();
  const { confirmPayment } = useStripe();

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

      const app = getApp();
      const functions = getFunctions(app, "us-central1");

      // ✅ CORRECT FUNCTION NAME
      const createPaymentIntent = httpsCallable(
        functions,
        "createPaymentIntent"
      );

      const response: any = await createPaymentIntent({
        plan: selectedPlan === "monthly" ? "basic" : "premium",
      });

      const clientSecret = response?.data?.clientSecret;

      if (!clientSecret) {
        throw new Error("No client secret received");
      }

      console.log("Client secret received");

      const { error, paymentIntent } = await confirmPayment(
        clientSecret,
        {
          paymentMethodType: "Card",
        }
      );

      if (error) {
        Alert.alert("Payment Failed", error.message);
        return;
      }

      if (paymentIntent) {
        Alert.alert("Success", "Payment successful!");
        navigation.goBack();
      }

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
              {selectedPlan === "monthly" ? "€9.99" : "€24.99"}
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
