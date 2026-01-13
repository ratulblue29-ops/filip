import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
    headerLeft: {
        flexDirection: 'row',
     alignItems: 'center' },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  headerName: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerStatus: { color: '#888', fontSize: 12 },

  // Shift Card
  shiftCard: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    margin: 16,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  shiftIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2519',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shiftDetails: { flex: 1, marginLeft: 12 },
  shiftTitle: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  shiftSubtitle: { color: '#888', fontSize: 12, marginTop: 2 },

  // Messages
  listContent: { padding: 16 },
  centeredInfo: { alignItems: 'center', marginBottom: 20 },
  dateSeparator: { color: '#888', fontSize: 12, marginBottom: 8 },
  matchText: { color: '#888', fontSize: 12, textAlign: 'center', paddingHorizontal: 40 },
  
  otherMessageWrapper: { marginBottom: 20 },
  senderName: { color: '#888', fontSize: 12, marginLeft: 50, marginBottom: 4 },
  otherMessageRow: { flexDirection: 'row', alignItems: 'flex-end' },
  chatAvatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  otherBubble: {
    backgroundColor: '#D1D1D1',
    padding: 12,
    borderRadius: 15,
    borderBottomLeftRadius: 2,
    maxWidth: '80%',
  },

  myMessageContainer: { alignItems: 'flex-end', marginBottom: 20 },
  myBubble: {
    backgroundColor: '#E0E0E0',
    padding: 12,
    borderRadius: 15,
    borderBottomRightRadius: 2,
    maxWidth: '80%',
  },
  messageTextBlack: { color: '#000', fontSize: 14, lineHeight: 20 },
  timeText: { color: '#888', fontSize: 11, marginTop: 4 },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
  },
  plusButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    marginHorizontal: 12,
    paddingHorizontal: 15,
    color: '#fff',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C5A35E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
