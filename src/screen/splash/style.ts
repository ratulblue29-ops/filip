import { StyleSheet } from 'react-native';

const bgColor = '#111';
const styles = StyleSheet.create({
  container: {
    backgroundColor: bgColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 110,
    objectFit: 'contain',
    marginBottom: 24,
  },
  text_wrapper: {},
  title: {
    color: '#fff',
    fontSize: 32,
    // fontWeight: 500,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'InterDisplayMedium',
  },
  description: {
    color: '#fff',
    // maxWidth: 290,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'InterDisplayRegular',
    // fontWeight: 400,
    marginHorizontal: 50,
  },
});
export default styles;
