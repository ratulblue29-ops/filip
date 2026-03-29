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
  MessageCircle,
  ClipboardList,
} from 'lucide-react-native';

import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';

import React, { useEffect, useState } from 'react';
import styles from '../../screen/feed/style';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import UsersAddIcon from '../svg/UsersAddIcon';
import UpgradeIcon from '../svg/UpgradeIcon';

import { getApp } from '@react-native-firebase/app';
import { getAuth, signOut } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import ResumeDocsModal from '../modals/ResumeDocsModal';
import { useTranslation } from 'react-i18next';
import { usePaymentFlag } from '../../hooks/usePaymentFlag';

const MainDrawer = () => {
  const paymentEnabled = usePaymentFlag();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [showBanner, setShowBanner] = useState(true);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const queryClient = useQueryClient();

  const app = getApp();
  const authInstance = getAuth(app);
  const db = getFirestore(app);

  const firebaseUser = authInstance.currentUser;

  useEffect(() => {
    const loadUserData = async () => {
      if (!firebaseUser) return;

      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid));

        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.log('Failed to load user firestore data:', err);
      }
    };

    loadUserData();
  }, [firebaseUser, db]);

  // fallback data
  const profilePhoto =
    userData?.profile?.photo ||
    firebaseUser?.photoURL ||
    'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg';

  const profileName =
    userData?.profile?.name ||
    firebaseUser?.displayName ||
    firebaseUser?.email?.split('@')[0] ||
    'Unknown User';

  const profileSkills =
    userData?.profile?.skills?.length > 0
      ? userData.profile.skills.join(', ')
      : t('common.no_skills');
  const profileCity = userData?.profile?.city || t('common.not_set');

  return (
    <View style={styles.drawerContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.drawerHeader}>
          <Image source={{ uri: profilePhoto }} style={styles.drawerAvatar} />

          <Text style={styles.drawerName}>{profileName}</Text>

          <Text style={styles.drawerRole}>{profileSkills}</Text>

          <View style={styles.locationRow}>
            <MapPin width={16} height={16} fill="#ffffff" />
            <Text style={styles.locationText_drawer}>{profileCity}</Text>
          </View>
        </View>

        {/* <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statValue}>26</Text>
            <Text style={styles.statLabel}>Repeats</Text>
          </View>
        </View> */}

        <View style={styles.drawerSection}>
          <Text style={styles.sectionHeader}>{t('drawer.dashboard')}</Text>

          {/* <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <BriefcaseBusiness width={22} height={20} color="#FFF" />
              </View>
              <Text style={styles.menuText}>My Gigs</Text>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('savedJobs')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <Bookmark width={20} height={18} color="#FFF" />
              </View>
              <Text style={styles.menuText}>{t('drawer.saved_posts')}</Text>
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
              <Text style={styles.menuText}>{t('drawer.referral')}</Text>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('chat')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <MessageCircle width={20} height={18} color="#FFF" />
              </View>
              <Text style={styles.menuText}>{t('drawer.chats')}</Text>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate('JobApplications', { jobId: '' })
            }
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <ClipboardList width={20} height={18} color="#FFF" />
              </View>
              <Text style={styles.menuText}>{t('drawer.job_applications')}</Text>
            </View>
            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={styles.drawerSection}>
          <Text style={styles.sectionHeader}>{t('drawer.professional')}</Text>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('postAvailabilites')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <PlusCircleIcon width={20} height={18} color="#FFF" />
              </View>

              <View>
                <Text style={styles.menuText}>{t('drawer.my_availability')}</Text>
                <Text style={styles.menuSubtext}>{t('drawer.availability_sub')}</Text>
              </View>
            </View>

            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => setShowResumeModal(true)}
          >
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <FileText width={20} height={18} color="#FFF" />
              </View>

              <View>
                <Text style={styles.menuText}>{t('drawer.resume_docs')}</Text>
                {/* <Text style={styles.menuSubtext}>Last Updated 2 Days Ago</Text> */}
              </View>
            </View>

            <ChevronRight width={20} height={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {showBanner && paymentEnabled && (
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
              <Text style={styles.bannerTitle}>{t('drawer.upgrade_title')}</Text>
              <Text style={styles.bannerSubtitle}>{t('drawer.upgrade_subtitle')}</Text>

              <TouchableOpacity
                style={styles.viewPlansBtn}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('membership')}
              >
                <Text style={styles.viewPlansText}>{t('drawer.view_plans')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.drawerFooter}>
          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('profile')}
          >
            <Settings width={20} height={20} color="#FFF" />
            <Text style={styles.footerText}>{t('drawer.settings')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerItem}
            activeOpacity={0.7}
            onPress={async () => {
              try {
                await GoogleSignin.revokeAccess(); // force account picker on next login
                await GoogleSignin.signOut(); // clear Google SDK session
              } catch (_) {
                // email login user — no Google session to clear, safe to ignore
              }
              await signOut(authInstance); // Firebase sign out
              queryClient.clear();
              navigation.replace('Login');
            }}
          >
            <LogOut width={20} height={20} color="#EF4444" />
            <Text style={styles.logoutText}>{t('drawer.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ResumeDocsModal
        visible={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </View>
  );
};

export default MainDrawer;
