import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#111111',
  white: '#FFFFFF',
  primary: '#FFD900',
  bodyText: '#D1D5DB',
  disabled: '#F3F4F6',
  disabledText: '#111827',
  gray: '#6B7280',
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
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: COLORS.white,
    fontFamily: 'InterDisplaySemiBold',
    textTransform: 'capitalize',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: COLORS.white,
    fontFamily: 'InterDisplaySemiBold',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  bodyText: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.bodyText,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 20,
    textTransform: 'capitalize',
  },
  bulletText: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.bodyText,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 20,
    textTransform: 'capitalize',
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.bodyText,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.bodyText,
    fontFamily: 'InterDisplayRegular',
    lineHeight: 20,
  },
  linkText: {
    color: COLORS.white,
    textDecorationLine: 'underline',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.background,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#6B7280',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 700,
    color: COLORS.disabledText,
    fontFamily: 'InterDisplayBold',
  },
  buttonTextDisabled: {
    color: COLORS.disabledText,
  },
});

export default styles;