import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { X, MessageSquare, Phone, Mail } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import { applyToJob } from '../../services/applyToJob';
import { StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  job: { id: string; userId: string; title: string };
};

const ApplyModal = ({ visible, onClose, job }: Props) => {
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

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
      await applyToJob(job, { message, phone, email });
      // Refresh applied state in FulltimeScreen
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
            <Text style={styles.title}>Apply for {job.title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
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
                <Text style={styles.submitText}>Submit Application</Text>
              )}
            </TouchableOpacity>
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
});

export default ApplyModal;
