// src/screen/referral/ReferralScreen.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  ActivityIndicator,
} from 'react-native';
import {
  Gift,
  Info,
  Copy,
  Share2,
  CheckCircle2,
  Clock,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { fetchReferralData } from '../../services/referral';
import { ReferralItem } from '../../@types/Referral.type';
import styles from './style';

// ─── Referral Row ────────────────────────────────────────────────────────────

type ReferralRowProps = {
  item: ReferralItem;
};

const ReferralRow = ({ item }: ReferralRowProps) => {
  const isVerified = item.status === 'verified';

  return (
    <View style={styles.referralItem}>
      {item.referredPhoto ? (
        <Image source={{ uri: item.referredPhoto }} style={styles.avatar} />
      ) : (
        // Fallback avatar with initials
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarInitial}>
            {item.referredName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.referralInfo}>
        <Text style={styles.referralName}>{item.referredName}</Text>
        <Text style={styles.referralSubtext}>
          {isVerified ? 'Account verified' : 'Pending verification'}
        </Text>
      </View>

      <View
        style={[
          styles.statusBadge,
          isVerified ? styles.statusVerified : styles.statusPending,
        ]}
      >
        {isVerified ? (
          <CheckCircle2 color="#FFD700" size={14} />
        ) : (
          <Clock color="#A0A0A0" size={14} />
        )}
        <Text
          style={[
            styles.statusText,
            { color: isVerified ? '#FBBF24' : '#FFFBEB' },
          ]}
        >
          {isVerified ? 'Verified' : 'Pending'}
        </Text>
      </View>
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────

const ReferralScreen = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['referralData'],
    queryFn: fetchReferralData,
    // Refetch on focus to pick up newly verified referred users
    staleTime: 1000 * 60 * 2, // 2 min
  });

  const handleCopyCode = async () => {
    if (!data?.referralCode) return;
    try {
      await Share.share({ message: data.referralCode });
    } catch {
      // User dismissed share sheet — not an error
    }
  };

  const handleShareInviteLink = async () => {
    if (!data?.referralCode) return;
    try {
      await Share.share({
        message: `Join GoldShift and start earning!\nUse my referral code: ${data.referralCode}\nhttps://goldshift.app/signup?ref=${data.referralCode}`,
        title: 'Join GoldShift',
      });
    } catch {
      // User dismissed share sheet — not an error
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centered}>
          <ActivityIndicator color="#FFD900" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ──
  if (isError || !data) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load referral data.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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

        {/* Hero */}
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

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{data.totalInvited}</Text>
            <Text style={styles.statLabel}>Invited</Text>
          </View>
          <View style={[styles.statCard, styles.statCardActive]}>
            <Text style={[styles.statNumber, { color: '#FFD900' }]}>
              {data.totalVerified}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
        </View>

        {/* Referral Code */}
        <Text style={styles.sectionLabel}>Your Referral Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{data.referralCode}</Text>
          <TouchableOpacity onPress={handleCopyCode} activeOpacity={0.7}>
            <Copy color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareInviteLink}
          activeOpacity={0.8}
        >
          <Share2 color="black" size={20} />
          <Text style={styles.shareButtonText}>Share Invite Link</Text>
        </TouchableOpacity>

        {/* Referrals List */}
        {data.referrals.length > 0 && (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.sectionLabel}>Your Referrals</Text>
              <View style={styles.recentBadge}>
                <Text style={styles.recentBadgeText}>Recent</Text>
              </View>
            </View>

            {data.referrals.map(item => (
              <ReferralRow key={item.id} item={item} />
            ))}
          </>
        )}

        {/* Empty state */}
        {data.referrals.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No referrals yet. Share your code and start earning!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralScreen;
