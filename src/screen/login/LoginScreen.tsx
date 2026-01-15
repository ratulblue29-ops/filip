import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import styles from '../login/style';
import GoogleIcon from '../../components/svg/GoogleIcon';
import AppleIcon from '../../components/svg/AppleIcon';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
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
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          placeholder="Enter your password"
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
      <TouchableOpacity>
        <Text style={styles.forgetPassText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* login button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BottomTabs')}
      >
        <Text style={styles.loginButton}>Log In</Text>
      </TouchableOpacity>
      <View style={styles.orContinueWrapper}>
        <View style={styles.lineBar}></View>
        <Text style={styles.orContinue}>Or continue with</Text>
        <View style={styles.lineBar}></View>
      </View>
      {/* google authentication */}
      <View style={styles.authentication_wrapper}>
        <TouchableOpacity style={styles.authentication}>
          <GoogleIcon size={24} />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.authentication}>
          <AppleIcon size={24} />
          <Text style={styles.googleText}>Google</Text>
        </TouchableOpacity>
      </View>
      {/* another acount */}
      <View style={styles.doyouHave}>
        <Text style={styles.dontText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('signup')}>
          <Text style={styles.textStyle_text}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
