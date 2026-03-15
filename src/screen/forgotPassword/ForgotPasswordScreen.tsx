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

type ForgotPasswordNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ForgotPassword'
>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<ForgotPasswordNavigationProp>();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter your email address.',
      });
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      Toast.show({
        type: 'success',
        text1: 'Email Sent',
        text2: 'Check your inbox for the reset link.',
      });

      navigation.goBack();
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        Toast.show({
          type: 'error',
          text1: 'User not found',
          text2: 'No account found with this email.',
        });
      } else if (error.code === 'auth/invalid-email') {
        Toast.show({
          type: 'error',
          text1: 'Invalid Email',
          text2: 'Please enter a valid email address.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: 'Please try again later.',
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
          Forgot <Text style={styles.span}>Password?</Text>
        </Text>
        <Text style={styles.subtext}>
          Enter your email and we'll send you a reset link.
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

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <View style={styles.backWrapper}>
          <Text style={styles.backText}>Remember your password?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
