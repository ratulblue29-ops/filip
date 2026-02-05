import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, CircleDollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './FulltimeStyle';
import { createJob } from '../../services/jobs';
import Toast from 'react-native-toast-message';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../../services/user';

const FullTimeAvailabilityCreation = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  // fetch user for membership display
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  const membershipTier = user?.membership?.tier || 'free';

  // State for all input fields
  const [position, setPosition] = useState('');
  const [city, setCity] = useState('');
  const [salary, setSalary] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const handlePostJob = async () => {
    try {
      if (!position.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Position Required',
          text2: 'Please enter a position title.',
        });
        return;
      }
      if (!city.trim()) {
        Toast.show({
          type: 'error',
          text1: 'City Required',
          text2: 'Please enter job city.',
        });
        return;
      }
      if (!description.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Description Required',
          text2: 'Please enter job description.',
        });
        return;
      }
      if (!email.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Email Required',
          text2: 'Please enter contact email.',
        });
        return;
      }
      await createJob({
        title: position,
        type: 'fulltime',
        description: description || 'No description provided.',
        location: city ? [city] : [],
        rate: {
          amount: Number(salary.replace(/\D/g, '')) || 0,
          unit: 'year',
        },
        daysPerWeek: Number(daysPerWeek) || 0,
        contact: {
          phone: phone || '',
          email: email.trim().toLowerCase(),
        },
      });

      Toast.show({
        type: 'success',
        text1: 'Job Posted',
        text2: 'Your full-time job has been posted successfully.',
      });

      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      navigation.goBack();
    } catch (e: any) {
      console.log(e);

      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e?.message || 'An error occurred while posting your job.',
      });
    }
  };

  const getMembershipText = () => {
    if (membershipTier === 'premium') {
      return 'Premium members can post unlimited full-time job ads.';
    }
    if (membershipTier === 'basic') {
      return 'Basic members can post 1 full-time job ad per month.';
    }
    return 'Free users cannot post full-time job ads. Upgrade membership to post.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.HeaderWrapper}>
          <ArrowLeft color="#fff" onPress={() => navigation.goBack()} />
          <Text style={styles.title}>Create Full-Time Job</Text>
          <View />
        </View>

        {/* Membership Card */}
        <View style={styles.feeCard}>
          <View style={styles.iconTextRow}>
            <CircleDollarSign size={26} color="#F5C400" />
            <View style={styles.textWrapper}>
              <Text style={styles.feeTitle}>Membership Requirement</Text>
              <Text style={styles.feeText}>{getMembershipText()}</Text>
            </View>
          </View>

          <View style={styles.singleBorder} />

          <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
            <Text style={styles.link}>View Membership Benefits</Text>
            <ArrowRight size={18} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        {/* Job Details */}
        <Text style={styles.sectionTitle}>Job Details</Text>

        <Text style={styles.label}>Position</Text>
        <TextInput
          placeholder="Select Position"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={position}
          onChangeText={setPosition}
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          placeholder="E.g. Berlin"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.label}>Salary</Text>
            <TextInput
              placeholder="€65K / Yr"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={salary}
              onChangeText={setSalary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.flex}>
            <Text style={styles.label}>Days / Week</Text>
            <TextInput
              placeholder="5"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={daysPerWeek}
              onChangeText={setDaysPerWeek}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About This Role</Text>
        <Text style={styles.label}>Job Description</Text>
        <TextInput
          placeholder="Describe the responsibilities and day-to-day tasks..."
          placeholderTextColor="#9CA3AF"
          style={styles.textArea}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact Info</Text>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          placeholder="+49 123 456 789"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="example@email.com"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handlePostJob}>
          <Text style={styles.buttonText}>Post Job Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FullTimeAvailabilityCreation;
