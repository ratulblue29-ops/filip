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

const SignUpScreen = () => {
  const navigation = useNavigation<any>();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selected, setSelected] = useState(false);

  return (
    <SafeAreaView style={[styles.container, styles.signupContainer]}>
      <ScrollView>
        <Text style={styles.SignupTittle}>Create Account</Text>
        <Text style={styles.title}>
          join <Text style={styles.span}>GoldShift</Text>
        </Text>
        <Text style={[styles.subtext, styles.signupSubtext]}>
          connect with the best stafs
        </Text>

        {/* full name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder="Enter your Full Name"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          autoCapitalize="none"
        />
        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {/* city */}
        <Text style={styles.label}>City</Text>
        <View style={[styles.passwordWrapper, styles.signupWrapper]}>
          <TextInput
            placeholder="City"
            placeholderTextColor="#9CA3AF"
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <MapPin size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Create a Password"
            placeholderTextColor="#9CA3AF"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
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

        <TouchableOpacity
          style={styles.radioWrapper}
          onPress={() => setSelected(true)}
          activeOpacity={0.8}
        >
          <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected && <View style={styles.radioInner} />}
          </View>

          <Text style={styles.text}>
            I Agree To The{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://example.com/terms')}
            >
              Terms & Condition
            </Text>{' '}
            And{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://example.com/privacy')}
            >
              Privacy Policy
            </Text>
            .
          </Text>
        </TouchableOpacity>

        {/* login button */}
        <TouchableOpacity
          style={[styles.button, styles.signupBtn]}
          onPress={() => navigation.navigate('BottomTabs')}
        >
          <Text style={styles.loginButton}>Create Account</Text>
        </TouchableOpacity>
        {/* another acount */}
        <View style={[styles.doyouHave, styles.signDoyouHave]}>
          <Text style={styles.dontText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.textStyle_text}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
