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
import { useTranslation } from 'react-i18next';

// ─── Referral Row ────────────────────────────────────────────────────────────

type ReferralRowProps = {
  item: ReferralItem;
};

const ReferralRow = ({ item }: ReferralRowProps) => {
  const { t } = useTranslation();
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
          {isVerified ? t('referral.account_verified') : t('referral.pending_verification')}
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
          {isVerified ? t('referral.status_verified') : t('referral.status_pending')}
        </Text>
      </View>
    </View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────

const ReferralScreen = () => {
  const { t } = useTranslation();
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
          <Text style={styles.errorText}>{t('referral.error_load')}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>{t('referral.retry')}</Text>
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
        <Text style={styles.headerTitle}>{t('referral.title')}</Text>

        <View style={styles.giftIconContainer}>
          <View style={styles.iconCircle}>
            <Gift color="white" size={32} />
          </View>
        </View>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.title}>{t('referral.invite_title')}</Text>
          <Text style={styles.subtitle}>
            {t('referral.invite_subtitle')}
          </Text>
          <View style={styles.infoBadge}>
            <Info color="#FBBF24" size={16} />
            <Text style={styles.infoText}>
              {t('referral.info_badge')}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{data.totalInvited}</Text>
            <Text style={styles.statLabel}>{t('referral.stat_invited')}</Text>
          </View>
          <View style={[styles.statCard, styles.statCardActive]}>
            <Text style={[styles.statNumber, { color: '#FFD900' }]}>
              {data.totalVerified}
            </Text>
            <Text style={styles.statLabel}>{t('referral.stat_verified')}</Text>
          </View>
        </View>

        {/* Referral Code */}
        <Text style={styles.sectionLabel}>{t('referral.your_code')}</Text>
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
          <Text style={styles.shareButtonText}>{t('referral.share_btn')}</Text>
        </TouchableOpacity>

        {/* Referrals List */}
        {data.referrals.length > 0 && (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.sectionLabel}>{t('referral.your_referrals')}</Text>
              <View style={styles.recentBadge}>
                <Text style={styles.recentBadgeText}>{t('referral.recent')}</Text>
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
              {t('referral.empty')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReferralScreen;
