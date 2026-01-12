import { StyleSheet } from 'react-native';
const COLORS = {
  background: '#111111',
  white: '#FFFFFF',
  cardBg: '#1E1E1E',
  yellow: '#FFD900',
  textMain: '#ffffff',
  textSecondary: '#F5F5F5',
  tagBg: '#121212',
  inputBg: '#262626',
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 100,
    paddingHorizontal: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom:20
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 100,
    objectFit: 'cover',
  },
  nameText: {
    color: COLORS.textMain,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'InterDisplaySemiBold',
    textTransform: 'capitalize',
    lineHeight: 20,
  },
  greetingText: {
    color: COLORS.textMain,
    fontSize: 12,
    fontWeight: 400,
    fontFamily: 'InterDisplayRegular',
    textTransform: 'capitalize',
    lineHeight: 16,
  },
  notifDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#FF3D00',
    borderWidth: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D1D1D',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },
  input: {
    flex: 1,
    color: '#9CA3AF',
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.yellow,
    fontSize: 16,
    fontFamily: 'InterDisplayMedium',
    fontWeight:500
  },
  seeAllText: {
    color: COLORS.yellow,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight:400
  },

  // Recommended Card Styling
  recCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardImage: {
    height: 147,
    padding: 8,
    justifyContent: 'space-between',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  MainbadgeContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    backgroundColor: '#121212',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.yellow,
  },
  badgeText: {
    color: COLORS.yellow,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight:400
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.yellow,
    marginRight: 12,
  },
  avatarInitial: {
    color: '#fff',
    fontWeight: 400,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
  },
  profileName: {
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    fontFamily: 'InterDisplaySemiBold',
    marginBottom:4
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  verifiedText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400
  },

  cardInfo: {
    paddingHorizontal:10,
    paddingVertical: 15,   
    backgroundColor: COLORS.cardBg
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:10
  },
  roleTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
  },
  rateText: {
    color: COLORS.yellow,
    fontSize: 20,
    fontWeight: 600,
    fontFamily: 'InterDisplaySemiBold',
  },
  perHr: { fontSize: 12 },
  locationText: {
    color: COLORS.yellow,
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400
  },

  availabilityBox: {
    backgroundColor: COLORS.inputBg,
    paddingHorizontal:17,
    paddingVertical:15,
    borderRadius: 12,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap:8
  },
  availLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
    marginBottom: 4,
    opacity:0.84
  },
  availValue: {
    color: '#F5F5F5',
    lineHeight:16,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
  },
  availSub: { color: COLORS.textSecondary, fontSize: 12 },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: COLORS.tagBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignSelf: 'flex-start',
    marginTop:8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400
  },

  viewProfileBtn: {
    backgroundColor: COLORS.yellow,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewProfileText: {
    color: '#1E1E1E',
    fontWeight: 400,
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
  },

  // Gig Item Styling
  gigCard: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  gigInfo:{
    flex: 1,
    marginLeft: 12
  },
  locationText_gig: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  gigAvatar: {
    width: 36,
    height: 36,
    borderRadius: 100,
    objectFit: 'cover'
  },
  gigTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
  },
  priceChip: {
    backgroundColor: '#121212',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6D6D6D',
  },
  priceChipText: {
    color: '#FFD900',
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400
  },
  gigTime: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400
  },
  spotsText: {
    color: COLORS.yellow,
    fontSize: 12,
    textAlign: 'right',
    fontWeight: 400,
    marginTop: 5,
    fontFamily: 'InterDisplayRegular',
  },
});

export default styles;
