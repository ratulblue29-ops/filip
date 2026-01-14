import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

const TermsConditionsScreen = () => {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAccept = () => {
    if (isChecked) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.bodyText}>
            Welcome To Our Hospitality Network. By Using This App, You Agree To
            The Following Terms Regarding Availability, Engagements, And Job
            Postings. These Terms Ensure A Transparent And Efficient Environment
            For All Users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Platform Role</Text>
          <Text style={styles.bodyText}>
            Our Platform Acts Strictly As An Intermediary To Connect Hospitality
            Professionals (Workers) With Potential Employers. We Do Not Employ
            Any Workers Directly, Nor Do We Act As An Employment Agency. The
            Platform Facilitates Connections But Does Not Direct, Control, Or
            Supervise The Work Performed.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Agreements</Text>
          <Text style={styles.bodyText}>
            All Employment Contracts, Shift Agreements, And Engagements Are
            Strictly Between The Worker And The Employer. The Terms Of
            Employment, Including Hours, Duties, Rates, And Compensation, Are To
            Be Negotiated And Agreed Upon Solely By The Involved Parties Without
            Our Interference.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Disclaimers & Liability</Text>
          <Text style={styles.bodyText}>
            We Assume No Responsibility For Agreements Made Between Users.
            Specifically, We Are Not Liable For:
          </Text>
          <Text style={styles.bulletText}>
            • Missed, Late, Or Disputed Payments Between Parties.
          </Text>
          <Text style={styles.bulletText}>
            • The Quality Of Work Performed, Punctuality, Or Services Rendered.
          </Text>
          <Text style={styles.bulletText}>
            • Any Damages, Theft, Or Losses Occurring On-Site Or During Shifts.
          </Text>
          <Text style={styles.bulletText}>
            • Disputes Arising From Cancellations, No-Shows, Or Scheduling
            Conflicts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Termination</Text>
          <Text style={styles.bodyText}>
            We Reserve The Right To Suspend Or Terminate Accounts That Violate
            Our Community Guidelines, Harass Other Users, Or Breach These Terms,
            Effectively Immediately And Without Prior Notice.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <View style={styles.checkboxInner} /> && <Check width={20} />}
          </View>
          <Text style={styles.checkboxText}>
            I acknowledge that I have read, understood, and agree to the{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isChecked && styles.buttonDisabled]}
          onPress={handleAccept}
          activeOpacity={0.7}
          disabled={!isChecked}
        >
          <Text style={[styles.buttonText, !isChecked && styles.buttonTextDisabled]}>
            Accept & Continue
          </Text>
          <ArrowRight
            width={20}
            height={20}
            color='#111827'
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditionsScreen;