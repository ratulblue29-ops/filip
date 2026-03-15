import { StyleSheet } from 'react-native';

const bgColor = '#111';
const buttonColor = '#FFD900';
const interDisplayBlack = 'InterDisplay-ExtraBold';
const interDisplayMedium = 'InterDisplay-Medium';
const interDisplayRegular = 'InterDisplay-Regular';
const interDisplayThin = 'InterDisplay-Thin';
const interDisplayBold = 'InterDisplay-Bold';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bgColor,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Inter_24pt-Bold',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
  },
  span: {
    fontStyle: 'italic',
    fontWeight: 900,
    fontFamily: interDisplayBlack,
  },
  subtext: {
    color: '#9CA3AF',
    fontFamily: interDisplayRegular,
    fontWeight: 400,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 64,
  },
  label: {
    color: '#E5E7EB',
    fontFamily: interDisplayMedium,
    fontWeight: 500,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontFamily: interDisplayThin,
    fontWeight: 300,
    fontSize: 14,
    color: '#fff',
    marginBottom: 28,
  },
  button: {
    paddingVertical: 12,
    backgroundColor: buttonColor,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1F2937',
    fontFamily: interDisplayBold,
    fontSize: 16,
    fontWeight: 700,
  },
  backWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    gap: 4,
  },
  backText: {
    color: '#9CA3AF',
    fontFamily: interDisplayRegular,
    fontSize: 16,
    fontWeight: 400,
  },
  backLink: {
    color: '#FFD900',
    fontFamily: interDisplayMedium,
    fontSize: 16,
    fontWeight: 500,
  },
});

export default styles;