import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#111111',
  cardBg: '#000000',
  cardBorder: '#374151',
  primary: '#FFD900',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  darkCard: '#181711',
  deductionBg: 'rgba(239, 68, 68, 0.12)',
  refundBg: 'rgba(34, 197, 94, 0.12)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerSpacer: {
    width: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loader: {
    marginTop: 60,
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    fontFamily: 'InterDisplaySemiBold',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
  },

  // Transaction card
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 14,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperDeduction: {
    backgroundColor: COLORS.deductionBg,
  },
  iconWrapperRefund: {
    backgroundColor: COLORS.refundBg,
  },
  txInfo: {
    flex: 1,
  },
  txReason: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    fontFamily: 'InterDisplaySemiBold',
    marginBottom: 4,
  },
  txDate: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
  },
  txAmount: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'InterDisplayBold',
  },
  amountDeduction: {
    color: '#EF4444',
  },
  amountRefund: {
    color: '#22C55E',
  },
});

export default styles;