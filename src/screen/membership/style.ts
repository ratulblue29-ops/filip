import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 1,
  },
  restoreText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  titleSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  toggleButtonActive: {
    backgroundColor: '#2A2A2A',
  },
  toggleText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  saveBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  saveBadgeText: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold',
  },
  planCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  premiumCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 20,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularBadgeText: {
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 12,
  },
  premiumName: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  priceAmount: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 18,
    color: '#999999',
    marginBottom: 8,
    marginLeft: 4,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIconGold: {
    fontSize: 16,
    color: '#FFD700',
    marginRight: 12,
    fontWeight: 'bold',
  },
  crossIcon: {
    fontSize: 16,
    color: '#666666',
    marginRight: 12,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  featureTextDisabled: {
    fontSize: 15,
    color: '#666666',
  },
  standardButton: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  standardButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  disclaimer: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 10,
  },
  disclaimerLink: {
    color: '#999999',
    textDecorationLine: 'underline',
  },
});

export default styles;