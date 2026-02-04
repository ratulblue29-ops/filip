import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon, MapPin, X } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import styles from './mainProfileStyle';

import SkillInput from '../../components/profile/SkillInput';
import UploadBanner from '../../components/availiability/UploadBanner';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateUserProfile } from '../../services/user';

const MainProfile: React.FC = () => {
  const queryClient = useQueryClient();

  /* ================= Profile ================= */
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [openToWork, setOpenToWork] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  /* ================= Availability (TIME ONLY) ================= */
  const [availabilityType, setAvailabilityType] = useState<
    'seasonal' | 'fulltime'
  >('seasonal');

  const [seasonLabel, setSeasonLabel] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  /* ================= Fetch User ================= */
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  /* ================= Populate State ================= */
  useEffect(() => {
    if (!user) return;

    setCity(user.profile?.city || '');
    setAbout(user.workerProfile?.aboutMe || '');
    setSkills(user.workerProfile?.skills || []);
    setOpenToWork(user.workerProfile?.status ?? true);
    setHourlyRate(
      user.workerProfile?.hourlyRate
        ? String(user.workerProfile.hourlyRate)
        : '',
    );

    const availability = user.workerProfile?.availability;
    if (!availability) return;

    setAvailabilityType(availability.type || 'seasonal');
    setSeasonLabel(availability.seasonLabel || '');

    if (availability.dateRange?.start) {
      setStartDate(availability.dateRange.start.toDate());
    }
    if (availability.dateRange?.end) {
      setEndDate(availability.dateRange.end.toDate());
    }
  }, [user]);

  /* ================= Image Picker ================= */
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.assets?.[0]?.uri) {
        setPhoto(res.assets[0].uri);
      }
    });
  };

  /* ================= Skills ================= */
  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    setSkills(prev => (prev.includes(value) ? prev : [...prev, value]));
    setSkillInput('');
  };

  /* ================= Date Pickers ================= */
  const onChangeStartDate = (_: any, date?: Date) => {
    setShowStartPicker(false);
    if (date) setStartDate(date);
  };

  const onChangeEndDate = (_: any, date?: Date) => {
    setShowEndPicker(false);
    if (date) setEndDate(date);
  };

  /* ================= Save Mutation ================= */
  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Profile & availability saved successfully',
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err.message || 'Something went wrong',
      });
    },
  });

  /* ================= Save Handler ================= */
  const handleSaveProfile = () => {
    if (!city.trim()) {
      Toast.show({ type: 'error', text1: 'City is required' });
      return;
    }

    if (!about.trim()) {
      Toast.show({ type: 'error', text1: 'About Me is required' });
      return;
    }

    if (
      availabilityType === 'seasonal' &&
      startDate.getTime() > endDate.getTime()
    ) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date Range',
        text2: 'End date must be after start date',
      });
      return;
    }

    saveProfile({
      city,
      aboutMe: about,
      skills,
      openToWork,
      photo,
      hourlyRate,
      availabilityType,
      seasonLabel,
      startDate,
      endDate,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Edit Profile</Text>

          {/* Photo */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.avatar}>
                <Image
                  source={{ uri: photo || user?.profile?.photo }}
                  style={styles.avatarImage}
                />
                <View style={styles.cameraIcon}>
                  <CameraIcon size={24} color="#1F2937" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.uploadText}>Upload Photo</Text>
            <Text style={styles.subText}>Make a great first impression</Text>
          </View>

          {/* About */}
          <Text style={styles.label}>About Me</Text>
          <TextInput
            style={styles.textArea}
            value={about}
            onChangeText={setAbout}
            multiline
            maxLength={300}
            placeholder="Tell something about yourself"
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.counter}>{about.length}/300</Text>

          <UploadBanner
            bannerImage={bannerImage}
            setBannerImage={setBannerImage}
          />

          {/* Availability */}
          <Text style={styles.label}>Availability Type</Text>
          <View style={styles.row}>
            {(['seasonal', 'fulltime'] as const).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  availabilityType === type && styles.activeChip,
                ]}
                onPress={() => setAvailabilityType(type)}
              >
                <Text>{type.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {availabilityType === 'seasonal' && (
            <>
              <Text style={styles.label}>Season Label</Text>
              <TextInput
                style={styles.input}
                value={seasonLabel}
                onChangeText={setSeasonLabel}
              />

              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                // style={styles.dateInput}
                onPress={() => setShowStartPicker(true)}
              >
                <Text>{startDate.toDateString()}</Text>
              </TouchableOpacity>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeStartDate}
                />
              )}

              <Text style={styles.label}>End Date</Text>
              <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                <Text>{endDate.toDateString()}</Text>
              </TouchableOpacity>

              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChangeEndDate}
                  minimumDate={startDate}
                />
              )}
            </>
          )}

          {/* City */}
          <Text style={styles.label}>Base City</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.flexInput}
              value={city}
              onChangeText={setCity}
              placeholder="Your city"
              placeholderTextColor="#9CA3AF"
            />
            <MapPin size={24} color="#374151" />
          </View>

          {/* Hourly Rate */}
          <Text style={styles.label}>Hourly Rate</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.flexInput}
              value={hourlyRate}
              onChangeText={setHourlyRate}
              keyboardType="numeric"
              placeholder="e.g. 15"
            />
            <Text style={styles.hourlyRateText}>/hr</Text>
          </View>

          {/* Skills */}
          <SkillInput
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkill={addSkill}
          />

          <View style={styles.skillWrap}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setSkills(prev => prev.filter((_, i) => i !== index))
                  }
                  style={styles.removeBtn}
                >
                  <X color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Open to work */}
          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.label, styles.openToWorkText]}>
                Open To Work
              </Text>
              <Text style={styles.subText}>
                Show employers you are available
              </Text>
            </View>
            <Switch
              value={openToWork}
              onValueChange={setOpenToWork}
              trackColor={{ false: '#515E72', true: '#FFD900' }}
              thumbColor="#FFFFFF"
              style={styles.bigSwitch}
            />
          </View>

          {/* Save */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSaveProfile}
            disabled={isPending}
          >
            <Text style={styles.saveText}>
              {isPending ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainProfile;
