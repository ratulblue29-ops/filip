// src/screen/referral/style.ts

import { StyleSheet } from 'react-native';

const GOLD = '#FFD900';
const GOLD_LIGHT = '#FBBF24';
const BG = '#0F0F0F';
const CARD_BG = '#1A1A1A';
const CARD_ACTIVE_BG = '#2A2200';
const WHITE = '#FFFFFF';
const MUTED = '#A0A0A0';
const WARM_WHITE = '#FFFBEB';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: '10%',
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '5%',
  },

  // ── Header ──────────────────────────────────────────────────
  headerTitle: {
    color: WHITE,
    fontSize: 20,
    fontFamily: 'InterDisplay-SemiBold',
    textAlign: 'center',
    marginTop: '6%',
    marginBottom: '4%',
  },

  giftIconContainer: {
    alignItems: 'center',
    marginBottom: '4%',
  },

  iconCircle: {
    backgroundColor: GOLD,
    borderRadius: 50,
    padding: '4%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero ─────────────────────────────────────────────────────
  heroSection: {
    alignItems: 'center',
    marginBottom: '6%',
  },

  title: {
    color: WHITE,
    fontSize: 26,
    fontFamily: 'InterDisplay-Bold',
    marginBottom: '2%',
  },

  subtitle: {
    color: MUTED,
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: '4%',
  },

  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2000',
    borderRadius: 20,
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    gap: 6,
  },

  infoText: {
    color: GOLD_LIGHT,
    fontSize: 12,
    fontFamily: 'InterDisplay-Medium',
  },

  // ── Stats ────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: '6%',
  },

  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingVertical: '5%',
    alignItems: 'center',
  },

  statCardActive: {
    backgroundColor: CARD_ACTIVE_BG,
    borderWidth: 1,
    borderColor: '#3A3000',
  },

  statNumber: {
    color: WHITE,
    fontSize: 28,
    fontFamily: 'InterDisplay-Bold',
  },

  statLabel: {
    color: MUTED,
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
    marginTop: 4,
  },

  // ── Code ─────────────────────────────────────────────────────
  sectionLabel: {
    color: WHITE,
    fontSize: 15,
    fontFamily: 'InterDisplay-SemiBold',
    marginBottom: '3%',
  },

  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingVertical: '4%',
    paddingHorizontal: '5%',
    marginBottom: '4%',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },

  codeText: {
    color: GOLD,
    fontSize: 18,
    fontFamily: 'InterDisplay-Bold',
    letterSpacing: 1.5,
  },

  // ── Share Button ─────────────────────────────────────────────
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: '4%',
    gap: 8,
    marginBottom: '8%',
  },

  shareButtonText: {
    color: '#000000',
    fontSize: 15,
    fontFamily: 'InterDisplay-SemiBold',
  },

  // ── List ─────────────────────────────────────────────────────
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '3%',
  },

  recentBadge: {
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    paddingVertical: '1.5%',
    paddingHorizontal: '4%',
  },

  recentBadgeText: {
    color: MUTED,
    fontSize: 12,
    fontFamily: 'InterDisplay-Medium',
  },

  referralItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    marginBottom: '3%',
  },

  avatar: {
    width: '12%',
    aspectRatio: 1,
    borderRadius: 50,
    marginRight: '3%',
  },

  avatarFallback: {
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    color: GOLD,
    fontSize: 16,
    fontFamily: 'InterDisplay-Bold',
  },

  referralInfo: {
    flex: 1,
    marginRight: '2%',
  },

  referralName: {
    color: WHITE,
    fontSize: 14,
    fontFamily: 'InterDisplay-SemiBold',
  },

  referralSubtext: {
    color: MUTED,
    fontSize: 12,
    fontFamily: 'InterDisplay-Regular',
    marginTop: 2,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: '1.5%',
    paddingHorizontal: '3%',
    gap: 4,
  },

  statusVerified: {
    backgroundColor: '#2A2000',
  },

  statusPending: {
    backgroundColor: '#222222',
  },

  statusText: {
    fontSize: 12,
    fontFamily: 'InterDisplay-Medium',
  },

  // ── Empty / Error ────────────────────────────────────────────
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: '10%',
  },

  emptyText: {
    color: MUTED,
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },

  errorText: {
    color: MUTED,
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
    marginBottom: '4%',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: GOLD,
    borderRadius: 12,
    paddingVertical: '3%',
    paddingHorizontal: '8%',
  },

  retryText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'InterDisplay-SemiBold',
  },
});

export default styles;