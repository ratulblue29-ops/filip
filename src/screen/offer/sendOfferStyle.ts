import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 15,
  },

  scrollContent: {
    paddingBottom: 60,
  },

  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 20,
  },

  // Three-part header: back | title | spacer
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InterDisplay-Medium',
  },

  label: {
    color: '#fff',
    marginTop: 32,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
    fontWeight: '500',
  },

  // Read-only / tappable row (same as mainProfile inputWithIcon)
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1D1D1D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },

  flexInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
  },

  // Side-by-side row for start/end time
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  arrowText: {
    color: '#9CA3AF',
    fontSize: 18,
    marginHorizontal: 8,
  },

  textArea: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    height: 117,
    textAlignVertical: 'top',
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },

  counter: {
    color: '#FFFFFF',
    textAlign: 'right',
    marginTop: 4,
    fontSize: 12,
    opacity: 0.6,
  },

  // Yellow CTA — matches mainProfile saveBtn
  saveBtn: {
    backgroundColor: '#FFD900',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 30,
  },

  saveText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InterDisplay-SemiBold',
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
  },
  toggleBtnActive: {
    borderColor: '#FFD900',
    backgroundColor: '#1E1E1E',
  },
  toggleBtnText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
  },
  toggleBtnTextActive: {
    color: '#FFD900',
    fontFamily: 'InterDisplayMedium',
    fontWeight: '500',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  currencyBadge: {
    fontSize: 14,
    color: '#FFD900',
    fontFamily: 'InterDisplayMedium',
    fontWeight: '500',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#2A2A2A',
    paddingVertical: 14,
  },
  currencyInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
    paddingLeft: 12,
    paddingVertical: 14,
  },
  subLabel: {
    color: '#fff',
    marginTop: 32,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
  },
});

export default styles;