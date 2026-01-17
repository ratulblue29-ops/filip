import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import styles from './style';
import {
  BadgeCheck,
  Bell,
  Bookmark,
  Clock,
  Heart,
  Search,
  MapPin,
  ChevronRight,
  BriefcaseBusiness,
  FileText,
  Settings,
  LogOut,
  X,
  MedalIcon,
  PlusCircleIcon,
} from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import UsersAddIcon from '../../components/svg/UsersAddIcon';
import UpgradeIcon from '../../components/svg/UpgradeIcon';

const COLORS = {
  secondaryText: '#9E9E9E',
  yellow: '#fcd303',
};
const Drawer = createDrawerNavigator();

const FeedContent = ({ navigation }: any) => {
  const RECOMMENDED_DATA = [
    {
      id: '1',
      name: 'Micheal J.',
      role: 'Event Server',
      rate: '€25',
      location: 'SoHo, New York • 0.5 Mil',
      badge: 'Starts In 2 Hours',
      availability: 'Today, 6:00 PM - 2:00 AM',
      tags: ['Weddings', 'Vip Service'],
      image:
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    },
    {
      id: '2',
      name: 'Sarah J.',
      role: 'Bartender Assistance',
      rate: '€35',
      location: 'Zinc Lounge • 5 Mil',
      badge: 'Seasonal',
      availability: 'Nov 15 - Jan 05',
      subAvailability: 'Flexible Weekends',
      tags: ['Inventory', 'Mixology Basic'],
      image:
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800',
    },
  ];

  const GIGS_DATA = [
    {
      id: '1',
      title: 'Cataring Staff',
      company: 'Creative Event • 3.1 Mil',
      price: '$20/Hr',
      time: 'Sat, Oct 25 • 4pm Start',
      spots: '5 Spots Left',
      avatar: 'https://i.pravatar.cc/150?u=a',
    },
    {
      id: '2',
      title: 'House Staff',
      company: 'Burger Joint • 0.2 Mil',
      price: '$18/Hr',
      time: 'Today • 5 PM - 11 PM',
      tags: ['Dishwashing'],
      avatar: 'https://i.pravatar.cc/150?u=b',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.topRow}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <View>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=a' }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={styles.greetingText}>good morning</Text>
            <Text style={styles.nameText}>Alex</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Bell width={24} height={24} color="white" />
          <View style={styles.notifDot} />
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search"
          placeholderTextColor={COLORS.secondaryText}
          style={styles.input}
        />
      </View>
      <ScrollView>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {RECOMMENDED_DATA.map(item => (
          <View key={item.id} style={styles.recCard}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.cardImage}
            >
              <View style={styles.MainbadgeContainer}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>• {item.badge}</Text>
                </View>
                <Heart height={24} width={24} color="white" />
              </View>
              <View style={styles.profileRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.profileName}>{item.name}</Text>
                  <View style={styles.verifiedContainer}>
                    <BadgeCheck width={16} height={16} color="#FFD900" />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.cardInfo}>
              <View style={styles.rowBetween}>
                <Text style={styles.roleTitle}>{item.role}</Text>
                <Text style={styles.rateText}>
                  {item.rate}
                  <Text style={styles.perHr}>/Hr</Text>
                </Text>
              </View>
              <Text style={styles.locationText}>{item.location}</Text>

              <View style={styles.availabilityBox}>
                <Clock width={24} height={24} color="#FFD900" />
                <View>
                  <Text style={styles.availLabel}>
                    {item.subAvailability ? 'Availability' : 'Next Available'}
                  </Text>
                  <Text style={styles.availValue}>{item.availability}</Text>
                  {item.subAvailability && (
                    <Text style={styles.availSub}>{item.subAvailability}</Text>
                  )}
                </View>
              </View>

              <View style={styles.tagRow}>
                {item.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.viewProfileBtn}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Newest Gigs</Text>

        {GIGS_DATA.map(gig => (
          <View key={gig.id} style={styles.gigCard}>
            <View style={styles.row}>
              <Image source={{ uri: gig.avatar }} style={styles.gigAvatar} />
              <View style={styles.gigInfo}>
                <View style={styles.rowBetween}>
                  <Text style={styles.gigTitle}>{gig.title}</Text>
                  <Bookmark width={24} height={24} color="#fff" />
                </View>
                <Text style={styles.locationText_gig}>{gig.company}</Text>

                <View style={styles.rowBetween}>
                  <View style={styles.priceChip}>
                    <Text style={styles.priceChipText}>{gig.price}</Text>
                  </View>
                  <Text style={styles.gigTime}>{gig.time}</Text>
                </View>

                {gig.tags && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{gig.tags[0]}</Text>
                  </View>
                )}

                {gig.spots && <Text style={styles.spotsText}>{gig.spots}</Text>}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const CustomDrawerContent = () => {
  const navigation = useNavigation<any>();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <View style={styles.drawerContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.drawerHeader}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=a' }}
            style={styles.drawerAvatar}
          />
          <Text style={styles.drawerName}>Alex</Text>
          <Text style={styles.drawerRole}>Senior Bartender & Mixologist</Text>
          <View style={styles.locationRow}>
            <MapPin width={16} height={16} fill="#ffffff" />
            <Text style={styles.locationText_drawer}>London, UK</Text>
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

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}
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

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <View style={styles.iconCircle}>
                <PlusCircleIcon width={20} height={18} color="#FFF" />
              </View>
              <View>
                <Text style={styles.menuText}>My Posted Availability</Text>
                <Text style={styles.menuSubtext}>Post & See Availabilities</Text>
              </View>
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
              <TouchableOpacity style={styles.viewPlansBtn} activeOpacity={0.7}>
                <Text style={styles.viewPlansText}>View Plans</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.footerItem} activeOpacity={0.7}>
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

const FeedScreen = () => {
  return (
    <Drawer.Navigator
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'front',
        overlayColor: 'rgba(255, 255, 255, 0.3)',
        swipeEnabled: true,
        drawerStyle: styles.drawerStyle,
      }}
    >
      <Drawer.Screen name="FeedContent" component={FeedContent} />
    </Drawer.Navigator>
  );
};

export default FeedScreen;