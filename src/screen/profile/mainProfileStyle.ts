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
    paddingTop: 30,
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
    width: 72,
    height: 72,
    borderRadius: 50,
    backgroundColor: '#1D1D1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 45,
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
    fontWeight: 600,
    fontFamily: 'InterDisplay-SemiBold',
    color: '#fff',
  },
  switchContainer: {
    paddingBottom: 8,
    marginTop: -24,
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
    // alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#1D1D1D',
    borderWidth: 1,
    borderColor: '#1D1D1D',
    borderRadius: 14,
    paddingHorizontal: 16,
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
    marginBottom: 40,
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
  viewModeContainer: {
    paddingBottom: 40,
  },
  profileBanner: {
    width: '100%',
    height: '15%',
    backgroundColor: '#1D1D1D',
    borderRadius: 16,
    overflow: 'hidden',
  },
  viewAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#111',
    marginTop: '-10%',
    marginLeft: 10,
  },
  viewName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'InterDisplay-SemiBold',
    marginTop: 10,
    marginLeft: 16,
  },
  viewCity: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
    marginLeft: 16,
    marginTop: 4,
  },
  viewSection: {
    backgroundColor: '#1D1D1D',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  viewSectionLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'InterDisplay-Regular',
    marginBottom: 6,
  },
  viewSectionValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
  },
  openToWorkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    gap: 10,
  },
  openToWorkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  editBtn: {
    backgroundColor: '#FFD900',
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 150,
  },
  editBtnText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InterDisplay-SemiBold',
  },
  reviewCard: {
    backgroundColor: '#1D1D1D',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333' },
  reviewTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Bold',
    fontWeight: '700',
  },
  reviewSubtext: {
    color: '#9DB9A8',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'InterDisplay-Medium',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B5563',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
    fontFamily: 'InterDisplay-Bold',
    fontWeight: '700',
  },
  reviewBody: {
    color: '#D4D4D4',
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
    fontFamily: 'InterDisplay-Regular',
  },
});

export default styles;
