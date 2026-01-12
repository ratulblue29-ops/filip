import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#423A07',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#F59E0B',
    width: 72,
    height: 72,
    marginHorizontal: 'auto',
    marginTop: 40,
  },
  restoreText: {
    fontSize: 16,
    color: '#FFD900',
    fontFamily: 'InterDisplayMedium',
    fontWeight: 500,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  titleSection: {
    marginTop: 28,
    marginBottom: 30,
  },
  mainTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 26,
    fontFamily: 'InterDisplayBold',
    fontWeight: 700,
  },
  secondaryTitle: {
    textAlign: 'center',
    color: '#F6DF60',
    fontSize: 26,
    fontFamily: 'InterDisplayBold',
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E5E5',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'InterDisplayMedium',
    fontWeight: 500,
    marginTop: 8,
    maxWidth: 260,
    marginHorizontal: 'auto',
  },

  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#383119',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 40,
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
    backgroundColor: '#181711',
  },
  toggleText: {
    fontSize: 14,
    color: '#BAB59C',
    fontFamily: 'InterDisplayBold',
    fontWeight: 700,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  saveBadge: {
    backgroundColor: '#FFD900',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  saveBadgeText: {
    fontSize: 12,
    color: '#000000',
    fontFamily: 'InterDisplayBold',
    fontWeight: 700,
    },
    planListCardContainer: {
        gap:12
    },
    reviewContainer: {
        marginTop: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewStarContainer: {
        flexDirection: 'row',
        gap:4
    },
    reviewText:{
       textAlign:'center',
       fontSize:14,
       color:'#E5E5E5',
       fontFamily:'InterDisplayMedium',
        fontWeight: 500,
        marginVertical: 8,
       maxWidth:300,
       marginHorizontal:'auto'
    },
    reviewTextAuthor:{
        textAlign:'center',
        fontSize:12,
        color:'#6B7280',
        fontFamily:'InterDisplayBold',
         fontWeight: 700,
         marginTop: 8,
        maxWidth:270,
        marginHorizontal:'auto'
    },
    priceContainer: {
        flexDirection:'row',
        justifyContent: 'space-between',
        marginTop: 60,
        alignItems: 'center',
    },
    priceText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontFamily: 'InterDisplayMedium',
        fontWeight: 500,
    },
    priceTextActive: {
        color: '#FFF',
        textAlign: 'right',
        fontSize: 24,
        fontFamily: 'InterDisplayBold',
        fontWeight: 700,
    },
    priceMonth: {
        color: '#FFF',
        textAlign: 'right',
        fontSize: 12,
        fontFamily: 'InterDisplayRegular',
        fontWeight: 400,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFD900',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 12,
        gap: 8,
    },
    upgradeButtonText: {
        fontSize: 18,
        color: '#1F2937',
        fontFamily: 'InterDisplayBold',
        fontWeight: 700,
    },
   

});

export default styles;
