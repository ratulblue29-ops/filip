import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
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
  // listContent: {
  //   height: '100%',
  // },
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
  input: {
    flex: 1,
    color: '#9CA3AF',
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  searchContainer: {
    width: width * 0.78 - 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },
  filterBtnIcon: {
    backgroundColor: '#1D1D1D',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },

  filterScroll: {
    alignItems: 'center',
    height: 90,
    marginBottom: 24,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 24,
  },
  countText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'InterDisplayMedium',
    fontWeight: 500,
    lineHeight: 20,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: '#FFD900',
    fontSize: 14,
    marginRight: 4,
    fontFamily: 'InterDisplayMedium',
    fontWeight: 500,
    lineHeight: 20,
  },
});
