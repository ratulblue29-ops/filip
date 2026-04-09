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
import LanguagePicker from '../../components/LanguagePicker';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { signInWithApple } from '../../services/auth';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // email login
  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: t('login.toast_missing'), text2: t('login.toast_missing_sub')
      });
      return;
    }
    try {
      setEmailLoading(true);

      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      Toast.show({
        type: 'success',
        text1: t('login.toast_success'),
      });

      navigation.replace('BottomTabs');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Toast.show({
          type: 'error',
          text1: t('login.toast_not_found'), text2: t('login.toast_not_found_sub')
        });
      } else if (error.code === 'auth/wrong-password') {
        Toast.show({
          type: 'error',
          text1: t('login.toast_wrong_password'), text2: t('login.toast_wrong_password_sub')
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('login.toast_failed'), text2: t('login.toast_failed_sub')
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

      const { isNewUser } = await signInWithGoogle();

      Toast.show({
        type: 'success',
        text1: isNewUser ? t('login.toast_google_new') : t('login.toast_google_existing'),
      });

      navigation.replace('BottomTabs');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('login.toast_google_failed'),
        text2: error.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  // apple login — iOS only
  const handleAppleLogin = async () => {
    try {
      setAppleLoading(true);
      const { isNewUser } = await signInWithApple();
      Toast.show({
        type: 'success',
        text1: isNewUser ? t('login.toast_google_new') : t('login.toast_google_existing'),
      });
      navigation.replace('BottomTabs');
    } catch (error: any) {
      // User cancelled returns error code 1001 — silently ignore
      if (error.code !== '1001') {
        Toast.show({
          type: 'error',
          text1: t('login.toast_failed'),
          text2: error.message,
        });
      }
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LanguagePicker />
        <Text style={styles.title}>
          {t('login.title')}<Text style={styles.span}>{t('login.title_span')}</Text>
        </Text>
        <Text style={styles.subtext}>{t('login.subtitle')}</Text>

        {/* Email */}
        <Text style={styles.label}>{t('login.label_email')}</Text>
        <TextInput
          placeholder={t('login.placeholder_email')}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text style={styles.label}>{t('login.label_password')}</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder={t('login.placeholder_password')}
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

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgetPassText}>{t('login.forgot_password')}</Text>
        </TouchableOpacity>

        {/* Email Login Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={emailLoading || googleLoading}
        >
          <Text style={styles.loginButton}>
            {emailLoading ? t('login.loading') : t('login.log_in')}
          </Text>
        </TouchableOpacity>

        {/* Or continue */}
        <View style={styles.orContinueWrapper}>
          <View style={styles.lineBar} />
          <Text style={styles.orContinue}>{t('login.or_continue')}</Text>
          <View style={styles.lineBar} />
        </View>

        {/* Social Login */}
        <View style={styles.authentication_wrapper}>
          <TouchableOpacity
            style={[styles.authentication, Platform.OS === 'android' && { width: '100%' }]}
            onPress={handleGoogleLogin}
            disabled={googleLoading || emailLoading}
          >
            <GoogleIcon size={24} />
            <Text style={styles.googleText}>
              {googleLoading ? t('login.google_wait') : t('login.google')}
            </Text>
          </TouchableOpacity>

          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={styles.authentication}
              onPress={handleAppleLogin}
              disabled={appleLoading || emailLoading || googleLoading}
            >
              <AppleIcon size={24} />
              <Text style={styles.googleText}>
                {appleLoading ? t('login.google_wait') : t('login.apple')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Signup redirect */}
        <View style={styles.doyouHave}>
          <Text style={styles.dontText}>{t('login.no_account')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('signup')}>
            <Text style={styles.textStyle_text}>{t('login.sign_up')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
