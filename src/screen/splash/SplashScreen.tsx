import { Text } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;
const SplashScreen = ({ navigation }: Props) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView>
      <Text>SpalashScreen</Text>
    </SafeAreaView>
  );
};

export default SplashScreen;
