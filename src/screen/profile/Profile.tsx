import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  Gem,
  Tag,
  Globe,
  Heart,
  Bell,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import UserProfileIcon from '../../components/svg/UserProfileIcon';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

const Profile = () => {
  const navigation = useNavigation<any>();
  const menuItems = [
    {
      id: '1',
      label: 'Personal Information',
      icon: User,
      onPress: () => {
        // Personal Information
      },
    },
    {
      id: '2',
      label: 'Credit',
      icon: Gem,
      onPress: () => {
        navigation.navigate('credit');
      },
    },
    {
      id: '3',
      label: 'My Offer',
      icon: Tag,
      onPress: () => {
        navigation.navigate('offer');
      },
    },
    {
      id: '4',
      label: 'Language',
      icon: Globe,
      onPress: () => {
        navigation.navigate('language');
      },
    },
    {
      id: '5',
      label: 'Engagement',
      icon: Heart,
      onPress: () => {
        navigation.navigate('engagement');
      },
    },
    {
      id: '6',
      label: 'Notification',
      icon: Bell,
      onPress: () => {
        navigation.navigate('notification');
      },
    },
    {
      id: '7',
      label: 'Help And Support',
      icon: UserProfileIcon,
      onPress: () => {
        navigation.navigate('HelpSupport');
      },
    },
    {
      id: '8',
      label: 'Term And Condition',
      icon: FileText,
      onPress: () => {
        navigation.navigate('TermsConditions');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Daniel Martinez</Text>
          <Text style={styles.userEmail}>Daniel.M@Example.Com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map(item => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.iconContainer}>
                    <IconComponent size={22} color="#FFFFFF" />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </View>
                <ChevronRight size={24} color="#ffffff" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
