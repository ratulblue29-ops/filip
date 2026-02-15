import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#111111',
  cardBg: '#121212',
  primary: '#FFD900',
  white: '#FFFFFF',
  gray: '#9CA3AF',
  border: '#2A2A2A',
  textDark: '#1F2937',
  actionNeededBg: '#262216',
  actionNeededBorder: '#FBBF24',
  actionNeededText: '#FBBF24',
  acceptedBg: '#FFD900',
  acceptedText: '#1F2937',
  pendingBg: '#D1D5DB',
  pendingText: '#000000',
  rejectedBg: '#B45309',
  rejectedText: '#9CA3AF',
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
    fontWeight: 500,
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 30,
    paddingVertical: 10,
    marginBottom: 24,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#1D1D1D',
    justifyContent: 'center',
    borderRadius: 14,
  },
  tab: {
    width: '42%',
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#383119',
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.white,
    fontFamily: 'InterDisplayMedium',
  },
  activeTabText: {
    color: COLORS.white,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  offerCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  offerCardRejected: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgb(255, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 8,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: COLORS.white,
    fontFamily: 'InterDisplaySemiBold',
    flex: 1,
  },
  offerRate: {
    fontSize: 14,
    fontWeight: 500,
    color: COLORS.primary,
    fontFamily: 'InterDisplayMedium',
  },
  venue: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.gray,
    fontFamily: 'InterDisplayRegular',
    marginBottom: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scheduleText: {
    fontSize: 14,
    fontWeight: 400,
    color: COLORS.white,
    fontFamily: 'InterDisplayRegular',
  },
  statusActionNeeded: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 24,
    borderWidth: 0.2,
    borderColor: COLORS.actionNeededBorder,
    backgroundColor: COLORS.actionNeededBg,
  },
  statusAccepted: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: COLORS.acceptedBg,
  },
  statusPending: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: COLORS.pendingBg,
  },
  statusRejected: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 24,
    backgroundColor: COLORS.rejectedBg,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 600,
    fontFamily: 'InterDisplaySemiBold',
    lineHeight: 12,
    textTransform: 'capitalize',
  },
  statusTextActionNeeded: {
    color: COLORS.actionNeededText,
  },
  statusTextAccepted: {
    color: COLORS.acceptedText,
  },
  statusTextPending: {
    color: COLORS.pendingText,
  },
  statusTextRejected: {
    color: COLORS.rejectedText,
  },
  actionButtons: {
    marginTop: 16,
  },
  emptyStateText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.8,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 500,
  },
});

export default styles;
