import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useMutation } from '@tanstack/react-query';
import styles from '../login/style';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';
import { signUpUser } from '../../services/auth';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'signup'
>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Sign Up Successful',
      });
      // Hard reset — clears Splash/Login/Signup from stack, no back button
      navigation.reset({ index: 0, routes: [{ name: 'BottomTabs' }] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error.message,
      });
    },
  });

  const handleSignUp = () => {
    mutation.mutate({
      fullName,
      email,
      password,
      city,
      acceptedTerms,
    });
  };

  return (
    <SafeAreaView style={[styles.container, styles.signupContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          Join <Text style={styles.span}>GoldShift</Text>
        </Text>
        <Text style={[styles.subtext, styles.signupSubtext]}>
          Connect With The Best Staff
        </Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your Full Name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* City */}
        <Text style={styles.label}>City</Text>
        <View style={[styles.passwordWrapper, styles.signupWrapper]}>
          <TextInput
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            style={styles.passwordInput}
            value={city}
            onChangeText={setCity}
          />
          <View style={styles.eyeIcon}>
            <MapPin size={24} color="#374151" />
          </View>
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Create a Password"
            placeholderTextColor="#9CA3AF"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            {passwordVisible ? (
              <EyeOff size={24} color="#374151" />
            ) : (
              <Eye size={24} color="#374151" />
            )}
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={styles.radioWrapper}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          activeOpacity={0.8}
        >
          <View style={[styles.radio, acceptedTerms && styles.radioSelected]}>
            {acceptedTerms && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.text}>
            I agree to the{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://example.com/terms')}
            >
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://example.com/privacy')}
            >
              Privacy Policy.
            </Text>
            .
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, styles.signupBtn]}
          onPress={handleSignUp}
          disabled={mutation.isPending}
        >
          <Text style={styles.loginButton}>
            {mutation.isPending ? 'Loading...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Already have account */}
        <View style={[styles.doyouHave, styles.signDoyouHave]}>
          <Text style={styles.dontText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.textStyle_text}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
