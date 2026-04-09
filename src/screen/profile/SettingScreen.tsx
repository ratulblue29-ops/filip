import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert, Linking,
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
  ArrowLeft,
  Trash2,
  Shield,
} from 'lucide-react-native';
import UserProfileIcon from '../../components/svg/UserProfileIcon';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../../services/user';
import { useTranslation } from 'react-i18next';
import { deleteAccount } from '../../services/user';
import Toast from 'react-native-toast-message';

const SettingScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  // Handles account deletion with confirmation Alert before proceeding
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all your data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              // Navigation resets automatically — Firebase auth state listener handles redirect
              // Hard reset to Login — clears entire navigation stack
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (err: any) {
              // Firebase requires recent login for account deletion
              if (err.code === 'auth/requires-recent-login') {
                Toast.show({
                  type: 'error',
                  text1: 'Re-login required',
                  text2: 'Please log out and log back in, then try again.',
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Delete failed',
                  text2: err.message,
                });
              }
            }
          },
        },
      ],
    );
  };

  const menuItems = [
    // {
    //   id: '1',
    //   label: 'Personal Information',
    //   icon: User,
    //   onPress: () => {},
    // },
    {
      id: '2',
      label: t('settings.credit'),
      icon: Gem,
      onPress: () => {
        navigation.navigate('credit');
      },
    },
    {
      id: '3',
      label: t('settings.my_offer'),
      icon: Tag,
      onPress: () => {
        navigation.navigate('offer');
      },
    },
    {
      id: '4',
      label: t('settings.language'),
      icon: Globe,
      onPress: () => {
        navigation.navigate('language');
      },
    },
    {
      id: '5',
      label: t('settings.engagement'),
      icon: Heart,
      onPress: () => {
        navigation.navigate('engagement');
      },
    },
    {
      id: '6',
      label: t('settings.notification'),
      icon: Bell,
      onPress: () => {
        navigation.navigate('notification');
      },
    },
    {
      id: '7',
      label: t('settings.help_support'),
      icon: UserProfileIcon,
      onPress: () => {
        navigation.navigate('HelpSupport');
      },
    },
    {
      id: '8',
      label: t('settings.terms'),
      icon: FileText,
      onPress: () => {
        navigation.navigate('TermsConditions');
      },
    },
    {
      id: '9',
      label: t('settings.privacy_policy'),
      icon: Shield,
      onPress: () => {
        Linking.openURL('https://sites.google.com/view/goldshiftprivacypolicy');
      },
    },
    // Delete Account — destructive action with Alert confirmation
    {
      id: '10',
      label: t('settings.delete_account'),
      icon: Trash2,
      onPress: handleDeleteAccount,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings.title')}</Text>
        <View />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri:
                user?.profile?.photo ||
                'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user?.profile?.name || 'User'}</Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
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
                  <Text style={[
                    styles.menuLabel,
                    item.id === '10' && { color: '#EF4444' },
                  ]}>{item.label}</Text>
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

export default SettingScreen;
