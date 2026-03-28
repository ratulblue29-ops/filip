import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface AcceptDeclineBtnProps {
  handleAccept: () => void;
  handleDecline: () => void;
}
const AcceptDeclineBtn = ({
  handleAccept,
  handleDecline,
}: AcceptDeclineBtnProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
        <Text style={styles.declineButtonText}>{t('accept_decline.decline')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
        <Text style={styles.acceptButtonText}>{t('accept_decline.accept')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AcceptDeclineBtn;

const COLORS = {
  cardBg: '#121212',
  yellow: '#D4AF37',
  primary: '#FFD900',
  textDark: '#1F2937',
};
const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.yellow,
    backgroundColor: COLORS.cardBg,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.primary,
    fontFamily: 'InterDisplaySemiBold',
    lineHeight: 16,
    textTransform: 'capitalize',
  },
  acceptButton: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.textDark,
    fontFamily: 'InterDisplaySemiBold',
    lineHeight: 16,
    textTransform: 'capitalize',
  },
});
