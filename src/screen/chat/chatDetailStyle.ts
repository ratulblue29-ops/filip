import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(247, 254, 231, 0.20)',
  },
    headerLeft: {
    flexDirection: 'row',
    alignItems: 'center' },
    headerAvatar: { width: 36, height: 36, borderRadius: 20, marginHorizontal: 8, objectFit: 'cover' },
  headerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
  },
  headerStatus: {
    color: '#FDE68A',
    fontSize: 12,
    fontFamily: 'InterDisplayMedium',
    fontWeight: 500,
  },

  // Shift Card
  shiftCard: {
    flexDirection: 'row',
    backgroundColor: '#1D1D1D',
    marginHorizontal: 20,
    marginTop:12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  shiftIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: '#262216',
    borderWidth: 1,
    borderColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shiftDetails: { flex: 1, marginLeft: 12 },
  shiftTitle: {
    color: '#fff',
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
    fontSize: 16
  },
  shiftSubtitle: {
    color: '#F5F5F5',
    fontSize: 12,
    marginTop: 2,
    fontWeight:400,
    fontFamily: 'InterDisplayMedium',
    opacity:0.7
  },

  // Messages
  listContent: { padding: 16 },
  centeredInfo: { alignItems: 'center', marginBottom: 20 },
  dateSeparator: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'InterDisplayRegular',
    fontWeight:400,
  },
  matchText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
    maxWidth: 210,
  },
  
  otherMessageWrapper: { marginBottom: 20 },
  senderName: {
    color: '#F5F5F5',
    fontSize: 12,
    marginLeft: 50,
    marginBottom: 8,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
    opacity:0.8
  },
  otherMessageRow: { flexDirection: 'row', alignItems: 'flex-end' },
  chatAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  otherBubble: {
    backgroundColor: '#D9D9D9',
    padding: 12,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    maxWidth: '80%',
  },

  myMessageContainer: { alignItems: 'flex-end', marginBottom: 20 },
  myBubble: {
    backgroundColor: '#D9D9D9',
    padding: 12,
    borderRadius: 12,
    borderBottomRightRadius: 0,
    maxWidth: '80%',
  },
  messageTextBlack: {
    color: '#000',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
  },
  timeText: {
    color: '#F5F5F5',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
    opacity:0.82
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  plusButton: {
    width: 30,
    height: 30,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    marginHorizontal: 12,
    paddingHorizontal: 15,
    color: '#fff',
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FDE68A',
    borderWidth: 1,
  },
});
