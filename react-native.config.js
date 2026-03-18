module.exports = {
  assets: ['./assets/fonts'],
  dependencies: {
    '@react-native-vector-icons/ionicons': {
      platforms: {
        android: null, // disable Android autolinking — codegen not supported in New Arch
      },
    },
  },
};