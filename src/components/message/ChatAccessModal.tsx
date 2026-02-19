import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

type ChatAccessModalProps = {
  visible: boolean;
  onClose: () => void;
};

const ChatAccessModal = ({ visible, onClose }: ChatAccessModalProps) => {
  const navigation = useNavigation<any>();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Lock size={32} color="#FFD900" style={styles.icon} />

          <Text style={styles.modalTitle}>Chat Restricted</Text>

          <Text style={styles.modalBody}>
            Only Premium members can message directly.{'\n'}
            Send an engagement first — chat unlocks when the worker accepts.
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => {
              onClose();
              navigation.navigate('membership');
            }}
          >
            <Text style={styles.primaryBtnText}>Upgrade to Premium</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChatAccessModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  modalBody: {
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  primaryBtn: {
    backgroundColor: '#FFD900',
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryBtnText: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  cancelBtnText: {
    color: '#ff6b6b',
    fontSize: 15,
  },
});
