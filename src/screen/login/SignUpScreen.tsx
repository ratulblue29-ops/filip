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
import { useTranslation } from 'react-i18next';

type SignUpScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'signup'
>;

const SignUpScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [referralCode, setReferralCode] = useState('');

  const mutation = useMutation({
    mutationFn: signUpUser,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: t('signup.toast_success'),
      });
      // Hard reset — clears Splash/Login/Signup from stack, no back button
      navigation.reset({ index: 0, routes: [{ name: 'BottomTabs' }] });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: t('signup.toast_failed'),
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
      referralCode: referralCode.trim() || undefined,
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
        <Text style={styles.label}>{t('signup.label_name')}</Text>
        <TextInput
          placeholder={t('signup.placeholder_name')}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email */}
        <Text style={styles.label}>{t('signup.label_email')}</Text>
        <TextInput
          placeholder={t('signup.placeholder_email')}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* City */}
        <Text style={styles.label}>{t('signup.label_city')}</Text>
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

        {/* Referral Code (optional) */}
        <Text style={styles.label}>{t('signup.label_referral')}</Text>
        <TextInput
          placeholder={t('signup.placeholder_referral')}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoCapitalize="characters"
          value={referralCode}
          onChangeText={setReferralCode}
        />

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
            {t('signup.terms_prefix')}
            <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/terms')}>
              {t('signup.terms_link')}
            </Text>
            {t('signup.terms_and')}
            <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/privacy')}>
              {t('signup.privacy_link')}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, styles.signupBtn]}
          onPress={handleSignUp}
          disabled={mutation.isPending}
        >
          <Text style={styles.loginButton}>
            {mutation.isPending ? t('signup.loading') : t('signup.sign_up')}
          </Text>
        </TouchableOpacity>

        {/* Already have account */}
        <View style={[styles.doyouHave, styles.signDoyouHave]}>
          <Text style={styles.dontText}>{t('signup.has_account')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.textStyle_text}>{t('signup.log_in')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
