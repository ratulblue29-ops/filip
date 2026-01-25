import { Image, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';
import styles from './style';
import auth from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;
const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const user = auth().currentUser;
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }]
        });
      }
      else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }]
        })
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../../assets/images/logofinal.png')}
      />
      <View style={styles.text_wrapper}>
        <Text style={styles.title}>Find the Best Talent</Text>
        <Text style={styles.description}>
          Browse through a wide range of talented workers ready to fill
          short-term gigs or full-time positions.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
