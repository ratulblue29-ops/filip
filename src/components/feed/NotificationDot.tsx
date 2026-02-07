import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationDot = ({ hasUnread }: { hasUnread: boolean }) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('notification')}
    >
      <Bell width={24} height={24} color="white" />
      {hasUnread && <View style={styles.notifDot} />}
    </TouchableOpacity>
  );
};

export default NotificationDot;
const styles = StyleSheet.create({
  notifDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#FF3D00',
    borderWidth: 1,
  },
});
