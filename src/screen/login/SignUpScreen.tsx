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
import styles from '../login/style';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { getAuth, createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'signup'>;

const SignUpScreen = () => {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !city) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Information',
        text2: 'Please fill in all required fields to continue.',
      });
      return;
    }

    if (!selected) {
      Toast.show({
        type: 'error',
        text1: 'Terms Not Accepted',
        text2: 'You must agree to the Terms & Conditions before signing up.',
      });
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const firestore = getFirestore();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        email,
        role: 'worker',

        profile: {
          name: fullName,
          photo: null,
          city,
          skills: [],
        },

        membership: {
          tier: 'free',
          freePostsUsed: 0,
          postLimit: 10,
        },

        workerProfile: {
          aboutMe: '',
          baseCity: city,
          skills: [],
          openToWork: true,
        },

        employeeProfile: null,

        credits: {
          balance: 0,
          lifetimeEarned: 0,
          used: 0,
        },

        referral: {
          code: null,
          invitedCount: 0,
          verifiedCount: 0,
        },

        rating: {
          avg: 0,
          count: 0,
        },

        terms: {
          accepted: true,
          acceptedAt: serverTimestamp(),
        },

        verified: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Toast.show({ type: 'success', text1: 'Sign Up Successful' });
      navigation.navigate('Login');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Toast.show({ type: 'error', text1: 'Email already in use' });
      } else if (error.code === 'auth/invalid-email') {
        Toast.show({ type: 'error', text1: 'Invalid email address' });
      } else if (error.code === 'auth/weak-password') {
        Toast.show({ type: 'error', text1: 'Weak password', text2: 'Password must be at least 6 characters.' });
      } else {
        Toast.show({ type: 'error', text1: 'Unable to complete request', text2: 'Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, styles.signupContainer]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          Join <Text style={styles.span}>GoldShift</Text>
        </Text>
        <Text style={[styles.subtext, styles.signupSubtext]}>Connect With The Best Staff</Text>

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
            {passwordVisible ? <EyeOff size={24} color="#374151" /> : <Eye size={24} color="#374151" />}
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={styles.radioWrapper}
          onPress={() => setSelected(!selected)}
          activeOpacity={0.8}
        >
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.text}>
            I Agree To The{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/terms')}>
              Terms & Condition
            </Text>{' '}
            And{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/privacy')}>
              Privacy Policy
            </Text>
            .
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity style={[styles.button, styles.signupBtn]} onPress={handleSignUp}>
          <Text style={styles.loginButton}>{loading ? 'Loading...' : 'Sign Up'}</Text>
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
