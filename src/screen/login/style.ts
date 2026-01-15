import { StyleSheet } from 'react-native';

const bgColor = '#111';
const buttonColor = '#FFD900';

const styles = StyleSheet.create({
  signupContainer: {
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: bgColor,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
  },
  SignupTittle: {
    fontSize: 24,
    fontWeight: 500,
    fontFamily: 'InterDisplayMedium',
    textAlign: 'center',
    marginBottom: 32,
    color: 'white',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'InterDisplayBold',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
  },
  signDoyouHave: {
    marginTop: 32,
  },
  span: {
    fontStyle: 'italic',
  },

  subtext: {
    color: '#9CA3AF',
    fontFamily: 'InterDisplayRegular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 64,
  },
  signupSubtext: {
    fontSize: 16,
    color: '#fff',
  },

  label: {
    color: '#E5E7EB',
    fontFamily: 'InterDisplayMedium',
    fontSize: 14,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontFamily: 'InterDisplayRegular',
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },

  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: 'InterDisplayRegular',
    fontSize: 14,
    color: '#fff',
  },

  eyeIcon: {
    paddingLeft: 10,
  },
  forgetPassText: {
    color: '#FFD900',
    fontFamily: 'InterDisplayRegular',
    fontSize: 14,
    fontWeight: 400,
    textAlign: 'right',
    marginTop: 16,
    marginBottom: 28,
  },
  loginButton: {
    color: '#1F2937',
    fontFamily: 'InterDisplayBold',
    fontSize: 16,
    fontWeight: 700,
  },
  signupBtn: {
    marginTop: 72,
  },
  button: {
    paddingVertical: 12,
    backgroundColor: buttonColor,
    borderRadius: 12,
    alignItems: 'center',
  },
  orContinue: {
    color: '#fff',
    fontFamily: 'InterDisplayMedium',
    fontSize: 14,
  },
  lineBar: {
    height: 1,
    width: 75,
    backgroundColor: '#fff',
  },
  orContinueWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 28,
    marginBottom: 24,
  },
  authentication_wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  authentication: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    color: '#fff',
    fontFamily: 'InterDisplayMedium',
    fontSize: 16,
    fontWeight: 500,
  },
  dontText: {
    color: '#9CA3AF',
    fontFamily: 'InterDisplayRegular',
    fontSize: 16,
    fontWeight: 400,
  },
  textStyle_text: {
    color: '#FFD900',
    fontFamily: 'InterDisplayMedium',
    fontSize: 16,
    fontWeight: 500,
  },
  doyouHave: {
    display: 'flex',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },

  radioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 15,
  },
  signupWrapper: {
    marginBottom: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: '#D1D5DB',
  },
  radioInner: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  text: {
    color: '#fff',
    flex: 1,
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: 400,
    maxWidth: 280,
    lineHeight: 16,
  },
  link: {
    textDecorationLine: 'underline',
  },
});

export default styles;
