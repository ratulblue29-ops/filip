import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import styles from '../../screen/availabilty/style';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import NotificationDot from '../feed/NotificationDot';

const COLORS = {
  secondaryText: '#9E9E9E',
};

const AvailabilityHeader = () => {
  // notification get for dot
  const { hasUnread } = useUnreadNotifications();

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Find Workers</Text>
        <NotificationDot hasUnread={hasUnread} />
      </View>

      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search"
          placeholderTextColor={COLORS.secondaryText}
          style={styles.input}
        />
      </View>
    </View>
  );
};

export default AvailabilityHeader;
