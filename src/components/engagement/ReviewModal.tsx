import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { Star, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitReview } from '../../services/review';
import { useTranslation } from 'react-i18next';

type ReviewModalProps = {
  visible: boolean;
  onClose: () => void;
  engagementId: string;
  toUserId: string;
  toUserName: string;
  role: 'employer' | 'worker';
  toUserPhoto?: string | null;
  jobTitle?: string;
};

const ReviewModal = ({
  visible,
  onClose,
  engagementId,
  toUserId,
  toUserName,
  role,
  toUserPhoto,
  jobTitle,
}: ReviewModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => submitReview(engagementId, toUserId, rating, text, role),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Review submitted!' });
      queryClient.invalidateQueries({ queryKey: ['receivedEngagements'] });
      queryClient.invalidateQueries({ queryKey: ['sentEngagements'] });
      onClose();
    },
    onError: (err: any) => {
      Toast.show({ type: 'error', text1: err?.message || 'Failed to submit' });
    },
  });

  const handleSubmit = () => {
    if (rating === 0) {
      Toast.show({ type: 'error', text1: 'Please select a rating' });
      return;
    }
    mutate();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          <TouchableOpacity
            style={s.closeBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={20} color="#fff" />
          </TouchableOpacity>

          {(toUserPhoto || jobTitle) && (
            <View style={s.contextRow}>
              <Image
                source={toUserPhoto ? { uri: toUserPhoto } : require('../../../assets/images/defaultProfile.png')}
                style={s.contextAvatar}
              />
              <View>
                <Text style={s.contextName}>{toUserName}</Text>
                {jobTitle && <Text style={s.contextJob}>{jobTitle}</Text>}
              </View>
            </View>
          )}

          <Text style={s.heading}>{t('review.heading')}</Text>
          <Text style={s.subheading}>{t('review.subheading', { name: toUserName })}</Text>

          {/* Star Rating */}
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Star
                  size={36}
                  color="#FFD900"
                  fill={star <= rating ? '#FFD900' : 'transparent'}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={s.input}
            placeholder={t('review.placeholder')}
            placeholderTextColor="#555"
            multiline
            numberOfLines={4}
            value={text}
            onChangeText={setText}
          />

          <TouchableOpacity
            style={[s.submitBtn, isPending && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isPending}
            activeOpacity={0.8}
          >
            {isPending ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={s.submitText}>{t('review.submit')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Text style={s.skipText}>{t('review.skip')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'InterDisplaySemiBold',
    fontWeight: '600',
    marginBottom: 6,
  },
  subheading: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
    marginBottom: 24,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontFamily: 'InterDisplayRegular',
    fontSize: 14,
    textAlignVertical: 'top',
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#FFD900',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 14,
  },
  submitText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'InterDisplaySemiBold',
    fontWeight: '700',
  },
  skipText: {
    color: '#555',
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  contextAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
  },
  contextName: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'InterDisplaySemiBold',
  },
  contextJob: {
    color: '#FFD900',
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    marginTop: 2,
  },
});

export default ReviewModal;
