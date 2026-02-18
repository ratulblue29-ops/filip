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
});

export default styles;