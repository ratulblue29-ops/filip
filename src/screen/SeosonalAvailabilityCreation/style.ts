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
  title: {
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
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
    marginBottom: 16,
    marginTop: 24,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
    marginBottom: 16,
  },
  addLocationButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addLocationRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    color: COLORS.white,
  },
  jobText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },
  labeldateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 120,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    paddingLeft: 45,
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  calendarContainer: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarMonth: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  calendarDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeader: {
    width: 40,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
    fontFamily: 'InterDisplayMedium',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSelected: {
    backgroundColor: COLORS.primary,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },
  dateInactive: {
    color: COLORS.white,
  },
  dateTextSelected: {
    color: COLORS.background,
    fontWeight: '600',
  },
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  calendarCancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  calendarCancelText: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.gray,
    fontFamily: 'InterDisplayMedium',
  },
  calendarDoneBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 35,
    paddingVertical: 10,
    borderRadius: 8,
  },
  calendarDoneText: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.background,
    fontFamily: 'InterDisplayMedium',
  },
  locationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },
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
    minHeight: 120,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    fontFamily: 'InterDisplay-SemiBold',
    marginBottom: 8,
  },
  fileIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#000',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileSubtext: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  toggleSubtext: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
  },
  dateSelectedStart: {
    borderTopStartRadius: 25,
    borderBottomStartRadius: 25,
  },
  dateSelectedEnd: {
    borderTopEndRadius: 25,
    borderBottomEndRadius: 25,
  },

  // ─── Toggle group (workplace type / rate type) ────────────────────────────

  // Row of equally-spaced toggle buttons
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  // Base state — inactive
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
    alignItems: 'center',
  },
  // Active state — yellow border signals selection
  toggleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.cardBg,
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

  // ─── EUR currency input row ───────────────────────────────────────────────

  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  // EUR label — hardcoded badge; no dropdown needed per spec
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

  // ─── Inline field error ───────────────────────────────────────────────────

  // Shown directly below the offending field — replaces generic toasts
  fieldError: {
    color: COLORS.error,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
    marginTop: 4,
    marginBottom: 4,
  },

  // ─── About character counter ──────────────────────────────────────────────

  // Subtle hint showing progress toward the 30-char minimum
  charCount: {
    color: COLORS.gray,
    fontSize: 11,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
    textAlign: 'right',
    marginTop: 6,
  },
});

export default styles;