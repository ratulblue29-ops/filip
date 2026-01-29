import React, { useState } from 'react';
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
import { CameraIcon, MapPin } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './mainProfileStyle';
import SkillInput from '../../components/profile/SkillInput';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../../services/user';

const MainProfile: React.FC = () => {
  const [about, setAbout] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [openToWork, setOpenToWork] = useState(true);
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
      if (res.assets && res.assets[0]?.uri) {
        setPhoto(res.assets[0].uri);
      }
    });
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills(prev => [...prev, skillInput.trim()]);
    setSkillInput('');
  };

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });
  const [city, setCity] = useState(user?.profile?.city || '');
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.headerTitle}>Edit Profile</Text>

          {/* Photo */}
          <View style={styles.photoSection}>
            <TouchableOpacity onPress={pickImage}>
              <View style={styles.avatar}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.avatarImage} />
                ) : (
                  <Image
                    source={{
                      uri:
                        user?.profile?.photo ||
                        'https://static.vecteezy.com/system/resources/thumbnails/022/014/184/small/user-icon-member-login-isolated-vector.jpg',
                    }}
                    style={styles.avatarImage}
                  />
                )}
                <View style={styles.cameraIcon}>
                  <CameraIcon size={24} color="#1F2937" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.uploadText}>Upload Photo</Text>
            <Text style={styles.subText}>Make A Great First Impression</Text>
          </View>

          {/* About */}
          <Text style={styles.label}>About Me</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell employer about your experience..."
            placeholderTextColor="#fff"
            value={about}
            onChangeText={setAbout}
            multiline
            maxLength={300}
          />
          <Text style={styles.counter}>{about.length}/300</Text>

          {/* City */}
          <Text style={styles.label}>Base City</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.flexInput}
              value={city}
              onChangeText={setCity}
            />
            <MapPin size={24} color="#374151" />
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
              </View>
            ))}
          </View>

          {/* Open To Work */}
          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.label, styles.openToWorkText]}>
                Open To Work
              </Text>
              <Text style={styles.subText}>
                Show Employer You Are Available
              </Text>
            </View>

            <Switch
              value={openToWork}
              onValueChange={setOpenToWork}
              trackColor={{ false: '#515E72', true: '#515E72' }}
              thumbColor="#FFFFFF"
              style={styles.bigSwitch}
            />
          </View>

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainProfile;
