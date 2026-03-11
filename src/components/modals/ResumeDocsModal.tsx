import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { X, FileText, Upload, CheckCircle } from 'lucide-react-native';
import { pick, types } from '@react-native-documents/picker';
import Toast from 'react-native-toast-message';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchUserCvUrl, uploadCv } from '../../services/cv';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MAX_CV_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ResumeDocsModal = ({ visible, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // Fetch existing CV URL — cached so ApplyModal can reuse the same key
  const { data: cvUrl, isLoading } = useQuery({
    queryKey: ['user-cv-url'],
    queryFn: fetchUserCvUrl,
    enabled: visible, // only fetch when modal is open
  });

  const handlePickAndUpload = async () => {
    try {
      // Open system file picker filtered to PDF only
      const result = await pick({ type: [types.pdf] });
      if (!result.length) return; // user cancelled

      const file = result[0];
      if (file.size && file.size > MAX_CV_SIZE_BYTES) {
        Toast.show({ type: 'error', text1: 'File too large (max 10 MB)' });
        return;
      }

      setUploading(true);
      await uploadCv(file.uri);

      // Invalidate so this modal and ApplyModal both see the new URL
      await queryClient.invalidateQueries({ queryKey: ['user-cv-url'] });

      Toast.show({ type: 'success', text1: 'CV uploaded successfully!' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message ?? 'Upload failed' });
    } finally {
      setUploading(false);
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
            <Text style={styles.title}>Resume & Docs</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Upload your CV (PDF only, max 10 MB). A new upload replaces your
            existing one.
          </Text>

          {/* Current CV status */}
          <View style={styles.statusBox}>
            <FileText size={20} color={cvUrl ? '#FFD900' : '#6B7280'} />
            <Text style={styles.statusText}>
              {isLoading
                ? 'Checking...'
                : cvUrl
                ? 'CV on file — ready to use'
                : 'No CV uploaded yet'}
            </Text>
            {cvUrl && !isLoading && (
              <CheckCircle
                size={18}
                color="#22C55E"
                style={{ marginLeft: 'auto' }}
              />
            )}
          </View>

          {/* Upload button */}
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={handlePickAndUpload}
            disabled={uploading}
            activeOpacity={0.8}
          >
            {uploading ? (
              <ActivityIndicator color="#1F2937" />
            ) : (
              <>
                <Upload size={18} color="#1F2937" />
                <Text style={styles.uploadBtnText}>
                  {cvUrl ? 'Replace CV' : 'Upload CV'}
                </Text>
              </>
            )}
          </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterDisplay-SemiBold',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
    marginBottom: 24,
    lineHeight: 20,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1D1D1D',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
  },
  uploadBtn: {
    backgroundColor: '#FFD900',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  uploadBtnText: {
    color: '#1F2937',
    fontSize: 16,
    fontFamily: 'InterDisplay-SemiBold',
  },
});

export default ResumeDocsModal;
