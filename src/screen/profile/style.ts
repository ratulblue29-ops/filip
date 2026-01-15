import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'InterDisplayMedium',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 600,
    color: '#FFFFFF',
    fontFamily: 'InterDisplayBold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: 400,
    color: '#6B7280',
    fontFamily: 'InterDisplayRegular',
  },
  menuSection: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.50);',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: 500,
    color: '#FFFFFF',
    fontFamily: 'InterDisplayMedium',
  },
});

export default styles;
