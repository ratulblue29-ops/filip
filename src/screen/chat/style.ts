import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingBottom: 60
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontFamily: 'InterDisplayMedium',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 22,
    letterSpacing: -0.18,
    textTransform: 'capitalize',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    padding: 6,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFD900',
  },
  tabText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  listPadding: {
    paddingBottom: 30,
  },
});
export default styles;