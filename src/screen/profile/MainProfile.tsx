import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon, MapPin, X, ExternalLink, FileText, CheckCircle, Upload } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import styles from './mainProfileStyle';

import SkillInput from '../../components/profile/SkillInput';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateUserProfile } from '../../services/user';
import { fetchUserReviews } from '../../services/review';
import ReviewCard from '../../components/profile/ReviewCard';
import { timeAgo } from '../../helper/timeAgo';
import { getAuth } from '@react-native-firebase/auth';
import { uploadProfilePhoto } from '../../services/uploadPhoto';
// import defaultProfile from '../../../assets/images/defaultProfile.png';
// import { useNavigation } from '@react-navigation/native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import {
  getPendingSkills,
  clearPendingSkills,
} from '../../store/pendingSkillsStore';
import { fetchUserCvUrl } from '../../services/cv';
import ResumeDocsModal from '../../components/modals/ResumeDocsModal';
import { useTranslation } from 'react-i18next';

const MainProfile: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const hasInitialized = useRef(false);
  const route = useRoute<any>();
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
  const [isEditing, setIsEditing] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  const currentUid = getAuth().currentUser?.uid ?? '';

  const { data: reviews = [] } = useQuery({
    queryKey: ['userReviews', currentUid],
    queryFn: () => fetchUserReviews(currentUid),
    enabled: !!currentUid,
  });

  const { data: cvUrl } = useQuery({
    queryKey: ['user-cv-url'],
    queryFn: fetchUserCvUrl,
    enabled: !!currentUid,
  });

  const [showResumeModal, setShowResumeModal] = useState(false);

  // useEffect(() => {
  //   if (!user) return;

  //   setCity(user.profile?.city || '');
  //   setAbout(user.profile?.aboutMe || '');
  //   setSkills(user.profile?.skills || []);
  //   setFullName(user.profile?.name || '');
  //   setHourlyRate(
  //     user.profile?.hourlyRate ? String(user.profile.hourlyRate) : '',
  //   );

  //   setPhoto(user.profile?.photo || null);
  //   setBannerImage(user.profile?.bannerImage || null);
  //   setOpenToWork(user.profile?.openToWork ?? user.profile?.opentowork ?? true);
  // }, [user]);

  useEffect(() => {
    if (!user || hasInitialized.current) return;
    hasInitialized.current = true;

    setCity(user.profile?.city || '');
    setAbout(user.profile?.aboutMe || '');
    setSkills(user.profile?.skills || []);
    setFullName(user.profile?.name || '');
    setHourlyRate(
      user.profile?.hourlyRate ? String(user.profile.hourlyRate) : '',
    );
    setPhoto(user.profile?.photo || null);
    setBannerImage(user.profile?.bannerImage || null);
    setOpenToWork(user.profile?.openToWork ?? user.profile?.opentowork ?? true);
  }, [user]);

  // useEffect(() => {
  //   if (route.params?.updatedSkills) {
  //     setSkills(route.params.updatedSkills);
  //   }
  // }, [route.params?.updatedSkills]);

  useFocusEffect(
    React.useCallback(() => {
      const skills = getPendingSkills();
      if (skills) {
        setSkills(skills);
        setIsEditing(true);
        clearPendingSkills(); // consume and clear so it doesn't re-apply
      }
    }, []), // empty deps — safe because store is external
  );

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
      hasInitialized.current = false; // ADD this line — allow re-init with fresh data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      Toast.show({
        type: 'success',
        text1: t('profile.profile_updated'),
        text2: t('profile.profile_saved'),
      });
      setLocalPhoto(null);
      setIsEditing(false);
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: t('profile.update_failed'),
        text2: err.message || 'Something went wrong',
      });
    },
  });
  // handle profile save
  const handleSaveProfile = async () => {
    if (!city.trim()) {
      Toast.show({ type: 'error', text1: t('profile.city_required') });
      return;
    }

    if (!about.trim()) {
      Toast.show({ type: 'error', text1: t('profile.about_required') });
      return;
    }

    if (skills.length === 0) {
      Toast.show({ type: 'error', text1: t('profile.skill_required') });
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
          text1: t('profile.photo_upload_failed'),
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

  if (!isEditing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headerTitle}>{t('profile.title')}</Text>

          <View style={styles.container}>
            {/* Banner */}
            {/* <View style={styles.profileBanner}>
              {bannerImage ? (
                <Image
                  source={{ uri: bannerImage }}
                  style={{ width: '100%', height: '100%' }}
                />
              ) : null}
            </View> */}

            {/* Avatar */}
            <Image
              source={{
                uri:
                  photo ||
                  'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
              }}
              style={styles.viewAvatar}
            />

            <Text style={styles.viewName}>{fullName || '—'}</Text>
            <Text style={styles.viewCity}>{city || '—'}</Text>

            {/* About */}
            <View style={styles.viewSection}>
              <Text style={styles.viewSectionLabel}>{t('profile.about_me')}</Text>
              <Text style={styles.viewSectionValue}>{about || '—'}</Text>
            </View>

            {/* Hourly Rate */}
            <View style={styles.viewSection}>
              <Text style={styles.viewSectionLabel}>{t('profile.hourly_rate')}</Text>
              <Text style={styles.viewSectionValue}>
                {hourlyRate ? `€${hourlyRate}` : '—'}
              </Text>
            </View>

            {/* Skills */}
            <View style={styles.viewSection}>
              <Text style={styles.viewSectionLabel}>{t('profile.skills')}</Text>
              <View style={styles.skillWrap}>
                {skills.length > 0 ? (
                  skills.map((skill, i) => (
                    <View key={i} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.viewSectionValue}>—</Text>
                )}
              </View>
            </View>

            {/* Open To Work */}
            <View style={styles.openToWorkBadge}>
              <View
                style={[
                  styles.openToWorkDot,
                  { backgroundColor: openToWork ? '#22C55E' : '#6B7280' },
                ]}
              />
              <Text style={styles.viewSectionValue}>
                {openToWork ? t('profile.open_to_work') : t('profile.not_available')}
              </Text>
            </View>

            {/* CV Section */}
            <View style={styles.viewSection}>
              <Text style={styles.viewSectionLabel}>{t('profile.cv_resume')}</Text>

              {/* Status box — mirrors ResumeDocsModal statusBox */}
              <View style={styles.cvStatusBox}>
                <FileText size={20} color={cvUrl ? '#FFD900' : '#6B7280'} />
                <Text style={styles.viewSectionValue}>
                  {cvUrl ? t('profile.cv_on_file') : t('profile.no_cv')}
                </Text>
                {cvUrl && (
                  <CheckCircle size={18} color="#22C55E" style={{ marginLeft: 'auto' }} />
                )}
              </View>

              <View style={styles.CVactionBtn}>
                {/* View CV — only when CV exists */}
                {cvUrl && (
                  <TouchableOpacity
                    style={styles.cvViewBtn}
                    onPress={() => Linking.openURL(cvUrl)}
                    activeOpacity={0.8}
                  >
                    <ExternalLink size={18} color="#fff" />
                    <Text style={styles.cvViewBtnText}>{t('profile.view_cv')}</Text>
                  </TouchableOpacity>
                )}

                {/* Upload / Replace */}
                <TouchableOpacity
                  style={styles.cvUploadBtn}
                  onPress={() => setShowResumeModal(true)}
                  activeOpacity={0.8}
                >
                  <Upload size={18} color="#1F2937" />
                  <Text style={styles.cvUploadBtnText}>
                    {cvUrl ? t('profile.replace_cv') : t('profile.upload_cv')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Reviews */}
            <Text style={styles.label}>{t('profile.my_reviews')}</Text>
            {reviews.length === 0 ? (
              <Text style={{ color: '#555', marginTop: 12, fontFamily: 'InterDisplay-Regular' }}>
                {t('profile.no_reviews')}
              </Text>
            ) : (
              reviews.map((review: any) => (
                <ReviewCard
                  key={review.id}
                  name={review.fromUserName ?? 'Anonymous'}
                  role={review.fromUserRole ?? ''}
                  time={timeAgo(review.createdAt)}
                  rating={String(review.rating)}
                  text={review.text}
                  photo={review.fromUserPhoto}
                />
              ))
            )}

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editBtnText}>{t('profile.edit_btn')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ResumeDocsModal visible={showResumeModal} onClose={() => setShowResumeModal(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setIsEditing(false)}
            style={{ marginBottom: 8 }}
          >
            <Text
              style={{
                color: '#9CA3AF',
                fontSize: 14,
                fontFamily: 'InterDisplay-Regular',
              }}
            >
              {t('profile.back')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile.edit_title')}</Text>

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
            <Text style={styles.uploadText}>{t('profile.upload_photo')}</Text>
            <Text style={styles.subText}>{t('profile.photo_format')}</Text>
          </View>

          {/* Full Name */}
          <Text style={styles.label}>{t('profile.full_name')}</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder={t('profile.full_name_placeholder')}
            placeholderTextColor="#9CA3AF"
          />

          {/* About */}
          <Text style={styles.label}>{t('profile.about_me')}</Text>
          <TextInput
            style={styles.textArea}
            value={about}
            onChangeText={setAbout}
            multiline
            maxLength={300}
            placeholder={t('profile.about_placeholder')}
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.counter}>{about.length}/300</Text>

          {/* City */}
          <Text style={styles.label}>{t('profile.base_city')}</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.flexInput}
              value={city}
              onChangeText={setCity}
              placeholder={t('profile.city_placeholder')}
              placeholderTextColor="#9CA3AF"
            />
            <MapPin size={24} color="#374151" />
          </View>

          {/* Hourly */}
          <Text style={styles.label}>{t('profile.hourly_rate')}</Text>
          <TextInput
            style={styles.input}
            value={hourlyRate}
            onChangeText={setHourlyRate}
            keyboardType="numeric"
            placeholder={t('profile.hourly_placeholder')}
            placeholderTextColor="#9CA3AF"
          />

          {/* Skills */}
          <SkillInput
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            addSkill={addSkill}
            currentSkills={skills}
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
              <Text style={styles.label}>{t('profile.open_to_work')}</Text>
              <Text style={styles.subText}>{t('profile.open_to_work_sub')}</Text>
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
              {isPending ? t('profile.saving') : t('profile.save_profile')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainProfile;
