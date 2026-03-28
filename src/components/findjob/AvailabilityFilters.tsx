import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screen/availabilty/style';
import { useTranslation } from 'react-i18next';

const AvailabilityFilters = ({ onSeasonal, onDaily }: any) => {
  const { t } = useTranslation();
  return (
    <View>
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.chip, styles.activeChip]}>
          <Text style={styles.activeChipText}>{t('availability_filters.anytime')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip} onPress={onSeasonal}>
          <Text style={styles.chipText}>{t('availability_filters.seasonal')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip} onPress={onDaily}>
          <Text style={styles.chipText}>{t('availability_filters.daily')}</Text>
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.resultsText}>32 Workers Found Nearby</Text> */}
    </View>
  );
};

export default AvailabilityFilters;
