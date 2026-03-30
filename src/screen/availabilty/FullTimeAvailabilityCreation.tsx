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
import { useTranslation } from 'react-i18next';

const FullTimeAvailabilityCreation = () => {
  const { t } = useTranslation();
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
          text1: t('fulltime_creation.error_position'),
          text2: t('fulltime_creation.error_position_sub'),
        });
        return;
      }
      if (!city.trim()) {
        Toast.show({
          type: 'error',
          text1: t('fulltime_creation.error_city'),
          text2: t('fulltime_creation.error_city_sub'),
        });
        return;
      }
      if (!description.trim()) {
        Toast.show({
          type: 'error',
          text1: t('fulltime_creation.error_description'),
          text2: t('fulltime_creation.error_description_sub'),
        });
        return;
      }
      if (!email.trim()) {
        Toast.show({
          type: 'error',
          text1: t('fulltime_creation.error_email'),
          text2: t('fulltime_creation.error_email_sub'),
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
          unit: 'month',
        },
        daysPerWeek: Number(daysPerWeek) || 0,
        contact: {
          phone: phone || '',
          email: email.trim().toLowerCase(),
        },
      });

      Toast.show({
        type: 'success',
        text1: t('fulltime_creation.toast_posted'),
        text2: t('fulltime_creation.toast_posted_sub')
      });

      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });

      navigation.goBack();
    } catch (e: any) {
      console.log(e);

      Toast.show({
        type: 'error',
        text1: t('fulltime_creation.toast_error'),
        text2: e?.message || t('fulltime_creation.toast_error_sub'),
      });
    }
  };

  const getMembershipText = () => {
    if (membershipTier === 'premium') return t('fulltime_creation.membership_premium');
    if (membershipTier === 'basic') return t('fulltime_creation.membership_basic');
    return t('fulltime_creation.membership_free');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.HeaderWrapper}>
          <ArrowLeft color="#fff" onPress={() => navigation.goBack()} />
          <Text style={styles.title}>{t('fulltime_creation.title')}</Text>
          <View />
        </View>

        {/* Membership Card */}
        <View style={styles.feeCard}>
          <View style={styles.iconTextRow}>
            <CircleDollarSign size={26} color="#F5C400" />
            <View style={styles.textWrapper}>
              <Text style={styles.feeTitle}>{t('fulltime_creation.membership_title')}</Text>
              <Text style={styles.feeText}>{getMembershipText()}</Text>
            </View>
          </View>

          <View style={styles.singleBorder} />

          <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
            <Text style={styles.link}>{t('fulltime_creation.membership_link')}</Text>
            <ArrowRight size={18} color="#D4AF37" />
          </TouchableOpacity>
        </View>

        {/* Job Details */}
        <Text style={styles.sectionTitle}>{t('fulltime_creation.section_job_details')}</Text>

        <Text style={styles.label}>{t('fulltime_creation.label_position')}</Text>
        <TextInput
          placeholder={t('fulltime_creation.placeholder_position')}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={position}
          onChangeText={setPosition}
        />

        <Text style={styles.label}>{t('fulltime_creation.label_city')}</Text>
        <TextInput
          placeholder="E.g. Berlin"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <View style={styles.row}>
          <View style={styles.flex}>
            <Text style={styles.label}>{t('fulltime_creation.label_salary')}</Text>
            <TextInput
              placeholder="€3,500 / Mo"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={salary}
              onChangeText={setSalary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.flex}>
            <Text style={styles.label}>{t('fulltime_creation.label_days')}</Text>
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
        <Text style={styles.sectionTitle}>{t('fulltime_creation.section_about')}</Text>
        <Text style={styles.label}>{t('fulltime_creation.label_description')}</Text>
        <TextInput
          placeholder={t('fulltime_creation.placeholder_description')}
          placeholderTextColor="#9CA3AF"
          style={styles.textArea}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Contact */}
        <Text style={styles.sectionTitle}>{t('fulltime_creation.section_contact')}</Text>

        <Text style={styles.label}>{t('fulltime_creation.label_phone')}</Text>
        <TextInput
          placeholder="+49 123 456 789"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>{t('fulltime_creation.label_email')}</Text>
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
          <Text style={styles.buttonText}>{t('fulltime_creation.btn_post')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FullTimeAvailabilityCreation;
