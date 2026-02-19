import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon, MapPin, X } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import styles from './mainProfileStyle';

import SkillInput from '../../components/profile/SkillInput';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateUserProfile } from '../../services/user';
import { uploadProfilePhoto } from '../../services/uploadPhoto';
// import defaultProfile from '../../../assets/images/defaultProfile.png';
const MainProfile: React.FC = () => {
  const queryClient = useQueryClient();
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [openToWork, setOpenToWork] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [fullName, setFullName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [localPhoto, setLocalPhoto] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  useEffect(() => {
    if (!user) return;

    setCity(user.profile?.city || '');
    setAbout(user.profile?.aboutMe || '');
    setSkills(user.profile?.skills || []);
    setFullName(user.profile?.name || '');
    setHourlyRate(
      user.profile?.hourlyRate ? String(user.profile.hourlyRate) : '',
    );

    setPhoto(user.profile?.photo || null);
    setBannerImage(user.profile?.bannerImage || null);
    setOpenToWork(user.profile?.openToWork ?? true);
  }, [user]);

  /* Pick Image */
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.assets?.[0]?.uri) {
        setLocalPhoto(res.assets[0].uri);
        setPhoto(res.assets[0].uri);
      }
    });
  };

  /* Skills */
  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    setSkills(prev => (prev.includes(value) ? prev : [...prev, value]));
    setSkillInput('');
  };

  /* Mutation */
  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Profile saved successfully',
      });
      setLocalPhoto(null);
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: err.message || 'Something went wrong',
      });
    },
  });
  // handle profile save
  const handleSaveProfile = async () => {
    if (!city.trim()) {
      Toast.show({ type: 'error', text1: 'City is required' });
      return;
    }

    if (!about.trim()) {
      Toast.show({ type: 'error', text1: 'About Me is required' });
      return;
    }

    if (skills.length === 0) {
      Toast.show({ type: 'error', text1: 'Please add at least one skill' });
      return;
    }

    let finalPhotoUrl = photo;

    if (localPhoto && localPhoto.startsWith('file://')) {
      try {
        finalPhotoUrl = await uploadProfilePhoto(localPhoto);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: 'Photo upload failed',
        });
        return;
      }
    }

    saveProfile({
      city,
      aboutMe: about,
      name: fullName,
      skills,
      photo: finalPhotoUrl,
      hourlyRate,
      bannerImage,
      openToWork,
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
                  source={{
                    uri:
                      photo ||
                      user?.profile?.photo ||
                      'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
                  }}
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

          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
          />

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

          {/* Hourly */}
          <Text style={styles.label}>Hourly Rate</Text>
          <TextInput
            style={styles.input}
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="numeric"
            placeholder="€25"
            placeholderTextColor="#9CA3AF"
          />

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
                >
                  <X color="#fff" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Open to work */}
          <View style={styles.switchRow}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Open To Work</Text>
              <Text style={styles.subText}>Show users you are available</Text>
            </View>
            <Switch
              value={openToWork}
              onValueChange={setOpenToWork}
              trackColor={{ false: '#515E72', true: '#FFD900' }}
              thumbColor="#FFFFFF"
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
