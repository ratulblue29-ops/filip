import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    marginBottom: 24,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  backBtn: {
    padding: 4,
  },
  filterScroll: {
    alignItems: 'center',
    height: 90,
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 40,
    gap: 12,
  },
  loader: {
    marginTop: 80,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 80,
    fontSize: 15,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.07)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#1E1E1E',
  },
  cardMeta: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'InterDisplayBold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    color: '#9CA3AF',
    fontSize: 12,
    flex: 1,
  },
  unsaveBtn: {
    padding: 4,
  },
  cardTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
  },
  badgeFulltime: {
    backgroundColor: 'rgba(29, 78, 216, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(29, 78, 216, 0.4)',
  },
  badgeSeasonal: {
    backgroundColor: 'rgba(6, 95, 70, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(6, 95, 70, 0.4)',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  rateText: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'InterDisplayMedium',
  },
  ctaBtn: {
    backgroundColor: '#FFD900',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  ctaBtnText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'InterDisplayMedium',
    lineHeight: 24,
  },
  cardBanner: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#1E1E1E',
  },
});