
import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ArrowRight, Infinity } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import styles from './style';
import PremiumIcon from '../../components/svg/PremiumIcon';
import PlanListCard from '../../components/purchase/PlanListCard';
import StarIcon from '../../components/svg/StarIcon';


const PurchaseScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>(
    'monthly',
  );
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text>
            <ArrowLeft width={22} height={22} color="white" />
          </Text>
        </TouchableOpacity>
              <Text style={styles.headerTitle}>Premium</Text>
              <View></View>
          </View>
       

          <ScrollView contentContainerStyle={styles.scrollContent}>
                 <View style={styles.headerIconContainer}>
              <PremiumIcon/>
          </View>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Unlock Your</Text>
          <Text style={styles.secondaryTitle}>Full Potential</Text>
          <Text style={styles.subtitle}>
           Get hired faster and earn more with GoldShift Premium features.
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
                  {/* plan section */}
              </View>

              {/* plan list card */}
              <View style={styles.planListCardContainer}>
                     <PlanListCard
                icon={<Infinity width={24} height={24} color="#F6DF60" />}
                title="Unlimited Applications"
                subtitle="Apply to as many jobs as you want."
              />
              <PlanListCard
                icon={<Infinity width={24} height={24} color="#F6DF60" />}
                title="Unlimited Applications"
                subtitle="Apply to as many jobs as you want."
              />
                     <PlanListCard
                icon={<Infinity width={24} height={24} color="#F6DF60" />}
                title="Unlimited Applications"
                subtitle="Apply to as many jobs as you want."
              />
              <PlanListCard
                icon={<Infinity width={24} height={24} color="#F6DF60" />}
                title="Unlimited Applications"
                subtitle="Apply to as many jobs as you want."
                  />
                  
                  {/* review */}
                  <View style={styles.reviewContainer}>
                      <View style={styles.reviewStarContainer}>
                          <StarIcon width={16} height={16}/>
                          <StarIcon width={16} height={16}/>
                          <StarIcon width={16} height={16}/>
                          <StarIcon width={16} height={16}/>
                          <StarIcon width={16} height={16}/>
                      </View>
                      <Text style={styles.reviewText}>"I found a job within 2 days of upgrading. The early access feature is a game changer!"</Text>
                      <Text style={styles.reviewTextAuthor}>— Sarah Jenkins</Text>
                  </View>
                  {/* price */}
                  <View style={styles.priceContainer}>
                     <Text style={styles.priceText}>Total today</Text>
                     <Text style={styles.priceTextActive}>€9.99<Text style={styles.priceMonth}>/month</Text></Text>
                  </View>
                  <TouchableOpacity style={styles.upgradeButton}>
                      <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                     <ArrowRight />
                  </TouchableOpacity>
              
           </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PurchaseScreen;
