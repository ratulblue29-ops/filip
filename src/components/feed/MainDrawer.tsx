import {
  Bookmark,
  MapPin,
  ChevronRight,
  BriefcaseBusiness,
  FileText,
  Settings,
  LogOut,
  X,
  PlusCircleIcon,
} from 'lucide-react-native';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import styles from '../../screen/feed/style';
import { useNavigation } from '@react-navigation/native';
import UsersAddIcon from '../svg/UsersAddIcon';
import UpgradeIcon from '../svg/UpgradeIcon';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../../services/user';

const MainDrawer = () => {
  const navigation = useNavigation<any>();
  const [showBanner, setShowBanner] = useState(true);
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading user data</Text>
      </View>
    );
  }

  return (
    <View style={styles.drawerContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.drawerHeader}>
          <Image
            source={{ uri: user?.profile?.photo || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png' }}
            style={styles.drawerAvatar}
          />
          <Text style={styles.drawerName}>{user?.profile?.name}</Text>
          <Text style={styles.drawerRole}>Senior Bartender & Mixologist</Text>
          <View style={styles.locationRow}>
            <MapPin width={16} height={16} fill="#ffffff" />
            <Text style={styles.locationText_drawer}>{user?.profile?.city}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Gigs Done</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>26</Text>
            <Text style={styles.statLabel}>Repeats</Text>
          </View>
        </View>

        <View style={styles.drawerSection}>
          <Text style={styles.sectionHeader}>Dashboard</Text>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <BriefcaseBusiness width={22} height={20} color="#FFF" />
              </View>
              <Text style={styles.menuText}>My Gigs</Text>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <Bookmark width={20} height={18} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Saved Jobs</Text>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('referral')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <UsersAddIcon width={20} height={18} color="#FFF" />
              </View>
              <Text style={styles.menuText}>Referral Program</Text>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.drawerSection}>
          <Text style={styles.sectionHeader}>Professional</Text>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => navigation.navigate('postAvailabilites')}>
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <PlusCircleIcon width={20} height={18} color="#FFF" />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('postAvailabilites')}
              >
                <Text style={styles.menuText}>My Posted Availability</Text>
                <Text style={styles.menuSubtext}>
                  Post & See Availabilities
                </Text>
              </TouchableOpacity>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <FileText width={20} height={18} color="#FFF" />
              </View>
              <View>
                <Text style={styles.menuText}>Resume & Docs</Text>
                <Text style={styles.menuSubtext}>Last Updated 2 Days Ago</Text>
              </View>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {showBanner && (
          <View style={styles.premiumBanner}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowBanner(false)}
              activeOpacity={0.7}
            >
              <X width={16} height={16} color="white" />
            </TouchableOpacity>
            <View style={styles.medalIconWrapper}>
              <UpgradeIcon width={24} height={24} color="#374151" />
            </View>
            <View>
              <Text style={styles.bannerTitle}>Upgrade To Pro</Text>
              <Text style={styles.bannerSubtitle}>
                Get Priority On High-Paying{'\n'}Gigs At Luxury Hotels
              </Text>
              <TouchableOpacity style={styles.viewPlansBtn} activeOpacity={0.7}
                onPress={() => navigation.navigate('membership')}>
                <Text style={styles.viewPlansText}>View Plans</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7} onPress={() => navigation.navigate('profile')}>
            <Settings width={20} height={20} color="#FFF" />
            <Text style={styles.footerText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Login')}
          >
            <LogOut width={20} height={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MainDrawer;

