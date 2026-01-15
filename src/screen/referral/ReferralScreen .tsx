import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
} from 'react-native';
import {
  Gift,
  Info,
  Copy,
  Share,
  Mail,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import styles from './style';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock Data for the list
const REFERRALS = [
  {
    id: '1',
    name: 'Boutique Bistro',
    subtext: 'Are You Available For Bartendin....',
    status: 'Verified',
    image: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: '2',
    name: 'Boutique Bistro',
    subtext: 'Are You Available For Bartendin....',
    status: 'Pending',
    image: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: '3',
    name: 'Boutique Bistro',
    subtext: 'Are You Available For Bartendin....',
    status: 'Pending',
    image: 'https://i.pravatar.cc/150?u=3',
  },
];

const ReferralScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Text style={styles.headerTitle}>Referral Program</Text>

        <View style={styles.giftIconContainer}>
          <View style={styles.iconCircle}>
            <Gift color="white" size={32} />
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>Invite & Earn</Text>
          <Text style={styles.subtitle}>
            Get +1 Availability Credit For Every Friend Who Joins And Verifies
            Their Account.
          </Text>

          <View style={styles.infoBadge}>
            <Info color="#FBBF24" size={16} />
            <Text style={styles.infoText}>
              1 Credit = 1 Premium Shift Apply
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Invited</Text>
          </View>
          <View style={[styles.statCard, styles.statCardActive]}>
            <Text style={[styles.statNumber, { color: '#FFD900' }]}>4</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
        </View>

        {/* Referral Code */}
        <Text style={styles.sectionLabel}>Your Referral Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>GoldShifts-2025</Text>
          <TouchableOpacity>
            <Copy color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.shareButton}>
          <Share color="black" size={20} width={24} height={24} />
          <Text style={styles.shareButtonText}>Share Invite Link</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or Invite By Email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email Input */}
        <View style={styles.emailInputWrapper}>
          <View style={styles.emailInputContainer}>
            <Mail color="white" size={20} style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Friend@Example.Com"
              placeholderTextColor="white"
              style={styles.textInput}
            />
            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Referrals List */}
        <View style={styles.listHeader}>
          <Text style={styles.sectionLabel}>Referral Program</Text>
          <TouchableOpacity style={styles.recentBadge}>
            <Text style={styles.recentBadgeText}>Recent</Text>
          </TouchableOpacity>
        </View>

        {REFERRALS.map(item => (
          <View key={item.id} style={styles.referralItem}>
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={styles.referralInfo}>
              <Text style={styles.referralName}>{item.name}</Text>
              <Text style={styles.referralSubtext} numberOfLines={1}>
                {item.subtext}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                item.status === 'Verified'
                  ? styles.statusVerified
                  : styles.statusPending,
              ]}
            >
              {item.status === 'Verified' ? (
                <CheckCircle2 color="#FFD700" size={14} />
              ) : (
                <Clock color="#A0A0A0" size={14} />
              )}
              <Text
                style={[
                  styles.statusText,
                  { color: item.status === 'Verified' ? '#FBBF24' : '#FFFBEB' },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralScreen;
