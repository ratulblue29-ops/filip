import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
type PostTypeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectFullTime: () => void;
  onSelectSeasonal: () => void;
  onSelectDaily: () => void;
};

const PostTypeModal: React.FC<PostTypeModalProps> = ({
  visible,
  onClose,
  onSelectFullTime,
  onSelectSeasonal,
  onSelectDaily,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t('post_type.title')}</Text>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={onSelectFullTime}
          >
            <Text style={styles.modalOptionText}>{t('post_type.full_time')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalOption}
            onPress={onSelectSeasonal}
          >
            <Text style={styles.modalOptionText}>{t('post_type.seasonal')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalOption} onPress={onSelectDaily}>
            <Text style={styles.modalOptionText}>{t('post_type.daily')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
            <Text style={styles.modalCancelText}>{t('post_type.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PostTypeModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },

  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },

  modalOptionText: {
    fontSize: 16,
    color: '#fff',
  },

  modalCancel: {
    paddingVertical: 14,
    alignItems: 'center',
  },

  modalCancelText: {
    color: '#ff6b6b',
    fontSize: 16,
  },
});
