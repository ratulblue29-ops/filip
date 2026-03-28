import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SparkleIcon from '../../components/svg/SparkelIcon';
import styles from '../../screen/availabilty/style';
import { useTranslation } from 'react-i18next';

const PremiumBanner = ({ onPress }: any) => {
  const { t } = useTranslation();
  return (
    <View style={styles.premiumBanner}>
      <View style={styles.premiumIconContainer}>
        <SparkleIcon width={24} height={24} />
      </View>

      <Text style={styles.premiumTitle}>{t('premium_banner.title')}</Text>
      <Text style={styles.premiumSub}>{t('premium_banner.subtitle')}</Text>
      <TouchableOpacity style={styles.premiumBtn} onPress={onPress}>
        <Text style={styles.filledBtnText}>{t('premium_banner.send_offers')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PremiumBanner;
