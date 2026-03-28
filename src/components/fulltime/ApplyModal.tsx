import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {
  X,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  Upload,
  CheckCircle,
} from 'lucide-react-native';
import { pick, types } from '@react-native-documents/picker';
import Toast from 'react-native-toast-message';
import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { useNavigation } from '@react-navigation/native';
import { applyToFullTimeJob } from '../../services/applyToJob';
import { fetchUserCvUrl, uploadCv } from '../../services/cv';
// import { fetchCurrentUser } from '../../services/user';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

type Props = {
  visible: boolean;
  onClose: () => void;
  job: { id: string; userId: string; title: string };
};

const ApplyModal = ({ visible, onClose, job }: Props) => {
  const { t } = useTranslation();
  // const navigation = useNavigation<any>();
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // CV state — null means no CV selected yet for this session
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  // Fetch user's stored CV from Firestore — same cache key as ResumeDocsModal
  const { data: savedCvUrl } = useQuery({
    queryKey: ['user-cv-url'],
    queryFn: fetchUserCvUrl,
    enabled: visible,
  });
  // const { data: currentUser, isLoading: userLoading } = useQuery({
  //   queryKey: ['currentUser'],
  //   queryFn: fetchCurrentUser,
  //   enabled: visible,
  // });
  // const membershipTier = currentUser?.membership?.tier ?? 'free';
  // const isPremium = membershipTier === 'premium';
  const queryClient = useQueryClient();

  // const navigation = useNavigation<any>();

  // Pick a new PDF from device and upload it, replacing existing CV
  const handlePickNewCv = async () => {
    try {
      const result = await pick({ type: [types.pdf] });
      if (!result.length) return; // user cancelled

      const file = result[0];
      if (file.size && file.size > 10 * 1024 * 1024) {
        Toast.show({ type: 'error', text1: t('apply_modal.toast_too_large') });
        return;
      }

      setCvUploading(true);
      const url = await uploadCv(file.uri);
      await queryClient.invalidateQueries({ queryKey: ['user-cv-url'] });
      setCvUrl(url);
      setCvFileName(file.name ?? 'cv.pdf');
      Toast.show({ type: 'success', text1: t('apply_modal.toast_cv_uploaded') });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message ?? 'Upload failed' });
    } finally {
      setCvUploading(false);
    }
  };

  // Use the CV already saved in user profile
  const handleUseExisting = () => {
    if (!savedCvUrl) return;
    setCvUrl(savedCvUrl);
    setCvFileName('Saved CV');
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      Toast.show({ type: 'error', text1: 'Message is required' });
      return;
    }
    if (!phone.trim()) {
      Toast.show({ type: 'error', text1: 'Phone number is required' });
      return;
    }
    if (!email.trim()) {
      Toast.show({ type: 'error', text1: 'Email is required' });
      return;
    }

    setLoading(true);
    try {
      // cvUrl may be null — CV is optional, employer can still contact via phone/email
      await applyToFullTimeJob(job, {
        message,
        phone,
        email,
        cvUrl: cvUrl ?? null,
      });
      await queryClient.invalidateQueries({ queryKey: ['my-offers'] });
      Toast.show({ type: 'success', text1: 'Application submitted!' });
      onClose();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('apply_modal.title', { title: job.title })}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Premium gate — non-premium users see upgrade prompt, not the form */}
            {/* {userLoading ? (
              <ActivityIndicator
                color="#FFD900"
                style={{ marginVertical: 40 }}
              />
            ) : !isPremium ? (
              <View style={styles.upgradeBox}>
                <Text style={styles.upgradeTitle}>Premium Required</Text>
                <Text style={styles.upgradeText}>
                  Only Premium members can apply for full-time jobs. Upgrade
                  your plan to unlock applications.
                </Text>
                <TouchableOpacity
                  style={styles.upgradePremiumBtn}
                  onPress={() => {
                    onClose();
                    navigation.navigate('membership');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.upgradePremiumBtnText}>
                    Upgrade to Premium
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <> */}
            {/* Message */}
            <Text style={styles.label}>Short Message / Introduction</Text>
            <View style={styles.inputWithIcon}>
              <MessageSquare
                size={18}
                color="#9CA3AF"
                style={{ marginTop: 10, marginLeft: 5 }}
              />
              <TextInput
                style={styles.textArea}
                value={message}
                onChangeText={setMessage}
                placeholder="Tell the employer about yourself..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={300}
              />
            </View>

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <Phone
                size={18}
                color="#9CA3AF"
                style={{ marginTop: 10, marginLeft: 5 }}
              />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 234 567 890"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWithIcon}>
              <Mail
                size={18}
                color="#9CA3AF"
                style={{ marginTop: 10, marginLeft: 5 }}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* CV / Resume */}
            <Text style={styles.label}>CV / Resume (optional)</Text>

            {/* Show selected CV filename if one is attached this session */}
            {cvUrl && (
              <View style={styles.cvAttached}>
                <CheckCircle size={16} color="#22C55E" />
                <Text style={styles.cvAttachedText} numberOfLines={1}>
                  {cvFileName ?? 'CV attached'}
                </Text>
              </View>
            )}

            <View style={styles.cvRow}>
              {cvUrl && (
                <TouchableOpacity
                  style={[
                    styles.cvBtn,
                    cvUrl === savedCvUrl && styles.cvBtnActive,
                  ]}
                  onPress={() => Linking.openURL(cvUrl)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.cvBtnText,
                      cvUrl === savedCvUrl && { color: '#FFD900' },
                    ]}
                  >
                    Preview CV</Text>
                </TouchableOpacity>
              )}

              {/* Use existing — only shown if a saved CV exists in profile */}
              {savedCvUrl && (
                <TouchableOpacity
                  style={[
                    styles.cvBtn,
                    cvUrl === savedCvUrl && styles.cvBtnActive,
                  ]}
                  onPress={handleUseExisting}
                  activeOpacity={0.8}
                >
                  <FileText
                    size={16}
                    color={cvUrl === savedCvUrl ? '#FFD900' : '#fff'}
                  />
                  <Text
                    style={[
                      styles.cvBtnText,
                      cvUrl === savedCvUrl && { color: '#FFD900' },
                    ]}
                  >
                    Use Existing
                  </Text>
                </TouchableOpacity>
              )}

              {/* Upload new — always visible */}
              <TouchableOpacity
                style={styles.cvBtn}
                onPress={handlePickNewCv}
                disabled={cvUploading}
                activeOpacity={0.8}
              >
                {cvUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Upload size={16} color="#fff" />
                    <Text style={styles.cvBtnText}>{t('apply_modal.upload_new')}</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#1F2937" />
              ) : (
                <Text style={styles.submitText}>{t('apply_modal.submit')}</Text>
              )}
            </TouchableOpacity>
            {/* </>
            )} */}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#111',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterDisplay-SemiBold',
    flex: 1,
    marginRight: 12,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
    marginBottom: 8,
    marginTop: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#1D1D1D',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
  },
  textArea: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#FFD900',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  submitText: {
    color: '#1F2937',
    fontSize: 16,
    fontFamily: 'InterDisplay-SemiBold',
  },
  cvAttached: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  cvAttachedText: {
    color: '#22C55E',
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
    flex: 1,
  },
  cvRow: {
    flexDirection: 'row',
    gap: 5,
  },
  cvBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    backgroundColor: '#1D1D1D',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
  },
  cvBtnActive: {
    borderColor: '#FFD900',
    borderWidth: 1,
  },
  cvBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
  },
  upgradeBox: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  upgradeTitle: {
    color: '#FFD900',
    fontSize: 18,
    fontFamily: 'InterDisplay-SemiBold',
  },
  upgradeText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  upgradeBtn: {
    marginTop: 8,
    backgroundColor: '#1D1D1D',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderWidth: 0.5,
    borderColor: 'rgba(249,250,251,0.1)',
  },
  upgradeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Medium',
  },
  upgradePremiumBtn: {
    backgroundColor: '#FFD900',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  upgradePremiumBtnText: {
    color: '#1F2937',
    fontSize: 15,
    fontFamily: 'InterDisplay-SemiBold',
    textAlign: 'center',
  },
  viewCvLink: {
    color: '#FFD900',
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
    textDecorationLine: 'underline',
  },
});

export default ApplyModal;
