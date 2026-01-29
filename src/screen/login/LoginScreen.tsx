import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import styles from '../login/style';
import GoogleIcon from '../../components/svg/GoogleIcon';
import AppleIcon from '../../components/svg/AppleIcon';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import {
  getAuth,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';
import { signInWithGoogle } from '../../services/auth';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // email login
  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both email and password.',
      });
      return;
    }
    try {
      setEmailLoading(true);

      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
      });

      navigation.replace('BottomTabs');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Toast.show({
          type: 'error',
          text1: 'User not found',
          text2: 'No account found with this email.',
        });
      } else if (error.code === 'auth/wrong-password') {
        Toast.show({
          type: 'error',
          text1: 'Wrong password',
          text2: 'Please check your password.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2: 'Please try again later.',
        });
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // google login
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      await signInWithGoogle();

      Toast.show({
        type: 'success',
        text1: 'Signed in with Google',
      });

      navigation.replace('BottomTabs');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Google Sign-In failed',
        text2: error.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          Welcome to <Text style={styles.span}>GoldShift</Text>
        </Text>
        <Text style={styles.subtext}>
          Find your next shift or hire great staff.
        </Text>

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

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Enter your password"
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

        <TouchableOpacity>
          <Text style={styles.forgetPassText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Email Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={emailLoading || googleLoading}
        >
          <Text style={styles.loginButton}>
            {emailLoading ? 'Loading...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        {/* Or continue */}
        <View style={styles.orContinueWrapper}>
          <View style={styles.lineBar} />
          <Text style={styles.orContinue}>Or continue with</Text>
          <View style={styles.lineBar} />
        </View>

        {/* Social Login */}
        <View style={styles.authentication_wrapper}>
          <TouchableOpacity
            style={styles.authentication}
            onPress={handleGoogleLogin}
            disabled={googleLoading || emailLoading}
          >
            <GoogleIcon size={24} />
            <Text style={styles.googleText}>
              {googleLoading ? 'Please wait...' : 'Google'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.authentication}>
            <AppleIcon size={24} />
            <Text style={styles.googleText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Signup redirect */}
        <View style={styles.doyouHave}>
          <Text style={styles.dontText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <Text style={styles.textStyle_text}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
