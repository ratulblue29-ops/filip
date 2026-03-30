import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';
import styles from './style';
import { useTranslation } from 'react-i18next';

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: t('forgot_password.toast_missing'),
        text2: t('forgot_password.toast_missing_sub'),
      });
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      Toast.show({
        type: 'success',
        text1: t('forgot_password.toast_sent'),
        text2: t('forgot_password.toast_sent_sub'),
      });

      navigation.goBack();
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Toast.show({
          type: 'error',
          text1: t('forgot_password.toast_not_found'),
          text2: t('forgot_password.toast_not_found_sub'),
        });
      } else if (error.code === 'auth/invalid-email') {
        Toast.show({
          type: 'error',
          text1: t('forgot_password.toast_invalid_email'),
          text2: t('forgot_password.toast_invalid_email_sub'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('forgot_password.toast_generic'),
          text2: t('forgot_password.toast_generic_sub'),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {t('forgot_password.title')}<Text style={styles.span}>{t('forgot_password.title_span')}</Text>
        </Text>
        <Text style={styles.subtext}>
          {t('forgot_password.subtitle')}
        </Text>

        {/* Email */}
        <Text style={styles.label}>{t('forgot_password.label_email')}</Text>
        <TextInput
          placeholder={t('forgot_password.placeholder_email')}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? t('forgot_password.sending') : t('forgot_password.send_link')}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <View style={styles.backWrapper}>
          <Text style={styles.backText}>{t('forgot_password.remember_password')}</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>{t('forgot_password.log_in')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
