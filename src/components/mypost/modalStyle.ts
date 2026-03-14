import { StyleSheet } from 'react-native';

// Mirrors the palette used across PostedAvailabilitiesScreen and creation screens
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },

  // ─── Loading state ────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Scroll body ─────────────────────────────────────────────────────────────
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },

  // ─── Status + type badge row ──────────────────────────────────────────────────
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.gray,
    fontFamily: 'InterDisplaySemiBold',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'InterDisplaySemiBold',
    color: COLORS.white,
  },

  // ─── Read view rows ───────────────────────────────────────────────────────────
  readRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  readLabel: {
    fontSize: 11,
    fontWeight: '400',
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  readValue: {
    fontSize: 15,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },

  // ─── Edit form ────────────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.gray,
    fontFamily: 'InterDisplayMedium',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  // ─── Rate toggle group ────────────────────────────────────────────────────────
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
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

  // ─── EUR currency input ───────────────────────────────────────────────────────
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

  // ─── Cancel edit button ───────────────────────────────────────────────────────
  cancelEditBtn: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  cancelEditText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.gray,
    fontFamily: 'InterDisplayMedium',
  },
});

export default styles;