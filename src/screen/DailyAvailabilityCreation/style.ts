import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#111111',
  cardBg: '#1E1E1E',
  primary: '#FFD900',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  border: '#2A2A2A',
  error: '#EF4444',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ─── Header ──────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  postText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    fontFamily: 'InterDisplayMedium',
  },
  postTextDisabled: {
    color: COLORS.gray,
  },

  // ─── Scroll ──────────────────────────────────────────────────────────────────
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  // ─── Section ─────────────────────────────────────────────────────────────────
  section: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
    marginBottom: 12,
    marginTop: 24,
  },

  // ─── Credit badge ─────────────────────────────────────────────────────────────
  // Shown below header to inform worker of the 1-credit cost before posting
  creditBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    gap: 10,
  },
  creditBannerText: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    flex: 1,
  },
  creditBannerHighlight: {
    color: COLORS.primary,
    fontFamily: 'InterDisplayMedium',
    fontWeight: '500',
  },

  // ─── Picker row (Date / Time) ─────────────────────────────────────────────────
  // Three cards side by side: [Date] [Start] [End]
  pickerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pickerCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
  },
  pickerCardActive: {
    // Yellow border signals the picker is open for this card
    borderColor: COLORS.primary,
  },
  pickerLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerValue: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
    textAlign: 'center',
  },
  pickerPlaceholder: {
    color: COLORS.gray,
  },

  // ─── Toggle group (rate type) ──────────────────────────────────────────────
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
  },
  toggleBtnActive: {
    borderColor: COLORS.primary,
  },
  toggleBtnText: {
    fontSize: 13,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
  },
  toggleBtnTextActive: {
    color: COLORS.primary,
    fontFamily: 'InterDisplayMedium',
    fontWeight: '500',
  },

  // ─── Currency input ────────────────────────────────────────────────────────
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
  },
  currencyBadge: {
    fontSize: 14,
    color: COLORS.primary,
    fontFamily: 'InterDisplayMedium',
    fontWeight: '500',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingVertical: 14,
  },
  currencyInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
    paddingLeft: 12,
    paddingVertical: 14,
  },

  // ─── City input ────────────────────────────────────────────────────────────
  inputCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },

  // ─── Description textarea ─────────────────────────────────────────────────
  textArea: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
    minHeight: 100,
  },

  // ─── Field error ──────────────────────────────────────────────────────────
  fieldError: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
    marginTop: 4,
    marginBottom: 4,
  },
});

export default styles;
export { COLORS };