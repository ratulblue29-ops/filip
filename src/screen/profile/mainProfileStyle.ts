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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  headerTitle: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingBottom: 20,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 50,
    backgroundColor: '#1D1D1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#FFD900',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [{ translateY: '0%' }, { translateX: '50%' }],
    backgroundColor: '#BEF3FF',
    borderRadius: 50,
    padding: 6,
  },
  uploadText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 24,
    fontWeight: '500',
    fontFamily: 'InterDisplay-Medium',
  },
  subText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'InterDisplay-Regular',
    fontWeight: '400',
  },
  label: {
    color: '#fff',
    marginTop: 32,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
    fontWeight: 500,
  },
  skillLabel: {
    marginTop: 0,
  },
  openToWorkText: {
    marginBottom: 8,
    fontWeight: 600,
    fontFamily: 'InterDisplay-SemiBold',
    color: '#fff',
  },

  counter: {
    color: '#FFFFFF',
    textAlign: 'right',
    marginTop: 4,
    fontSize: 14,
  },
  textArea: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    maxHeight: '100%',
    height: 117,
    textAlignVertical: 'top',
  },

  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  hourlyRateText: {
    color: '#FFD900',
    fontWeight: 600,
    fontFamily: 'InterDisplay-SemiBold',
  },

  input: {
    height: 52,
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 42,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Thin',
    fontWeight: 300,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  viewAll: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'InterDisplay-Thin',
    fontWeight: 300,
  },

  skillInputWrapper: {
    position: 'relative',
    width: '100%',
    marginTop: 8,
  },

  skillInput: {
    height: 52,
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 48,
    color: '#9CA3AF',
    fontSize: 14,
  },

  plusIcon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -12 }],
  },

  skillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },

  skillText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
    fontWeight: 500,
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,

    backgroundColor: '#1D1D1D',
    borderWidth: 1,
    borderColor: '#1D1D1D',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  bigSwitch: {
    transform: [{ scaleX: 1.35 }, { scaleY: 1.35 }],
  },

  saveBtn: {
    backgroundColor: '#FFD900',
    paddingVertical: 11,
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
  removeBtn: {
    marginLeft: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeText: {
    color: '#fff',
    fontSize: 24,
    lineHeight: 16,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 12,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB', // gray-300
    backgroundColor: '#FFFFFF',
  },
  activeChip: {
    backgroundColor: '#FFD900', // primary yellow
    borderColor: '#FFD900',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151', // gray-700
  },
  activeChipText: {
    color: '#1F2937', // gray-800
  },
  photoSection: {
    alignItems: 'center',
  },
});

export default styles;
