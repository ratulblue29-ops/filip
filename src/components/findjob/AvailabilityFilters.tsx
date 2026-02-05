import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../screen/availabilty/style';

const AvailabilityFilters = ({ onSeasonal }: any) => {
  return (
    <View>
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.chip, styles.activeChip]}>
          <Text style={styles.activeChipText}>Anytime</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chip} onPress={onSeasonal}>
          <Text style={styles.chipText}>Seasonal</Text>
        </TouchableOpacity>
      </View>

      {/* <Text style={styles.resultsText}>32 Workers Found Nearby</Text> */}
    </View>
  );
};

export default AvailabilityFilters;
