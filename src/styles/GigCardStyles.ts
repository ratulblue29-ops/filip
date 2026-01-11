import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '94%',
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignSelf: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company: {
    fontSize: 13,
    color: '#ffffff',
  },
  separator: {
    fontSize: 13,
    color: '#ffffff',
  },
  distance: {
    fontSize: 13,
    color: '#ffffff',
  },
  bookmarkButton: {
    padding: 4,
  },
  rateBox: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  dateText: {
    fontSize: 13,
    color: '#ffffff',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 8,
  },
  tag: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  middleRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: 8,
},
dateTimeColumn: {
  alignItems: 'flex-end',
},
durationText: {
  fontSize: 12,
  color: '#999',
  marginTop: 2,
},
bottomRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
spotsLeft: {
  fontSize: 13,
  fontWeight: '600',
  color: '#FFD700',
},
});