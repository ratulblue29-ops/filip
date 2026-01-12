import React from 'react';
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
import styles from './style';
import { Bell, Search } from 'lucide-react-native';

const COLORS = {
  secondaryText: '#9E9E9E',
  yellow: '#fcd303',
};
const FeedScreen = () => {
  // --- MOCK DATA ---
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Workers</Text>
        <View>
          <Bell width={24} height={24} color="white" />
          <View style={styles.notifDot} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search width={24} height={24} color="white" />
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.secondaryText}
            style={styles.input}
          />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {RECOMMENDED_DATA.map(item => (
          <View key={item.id} style={styles.recCard}>
            {/* Top Image Section */}
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.cardImage}
              imageStyle={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            >
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>• {item.badge}</Text>
              </View>
              <Text style={styles.heartIcon}>♡</Text>

              <View style={styles.profileRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarInitial}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.profileName}>
                    {item.name} <Text style={{ color: COLORS.yellow }}>✓</Text>
                  </Text>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              </View>
            </ImageBackground>

            {/* Info Section */}
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
                <Text style={styles.clockIcon}>🕒</Text>
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

        {/* --- SECTION: NEWEST GIGS --- */}
        <Text style={[styles.sectionTitle, { marginLeft: 16, marginTop: 20 }]}>
          Newest Gigs
        </Text>

        {GIGS_DATA.map(gig => (
          <View key={gig.id} style={styles.gigCard}>
            <View style={styles.row}>
              <Image source={{ uri: gig.avatar }} style={styles.gigAvatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.gigTitle}>{gig.title}</Text>
                  <Text style={styles.bookmarkIcon}>🔖</Text>
                </View>
                <Text style={styles.locationText}>{gig.company}</Text>

                <View style={[styles.rowBetween, { marginTop: 10 }]}>
                  <View style={styles.priceChip}>
                    <Text style={styles.priceChipText}>{gig.price}</Text>
                  </View>
                  <Text style={styles.gigTime}>{gig.time}</Text>
                </View>

                {gig.tags && (
                  <View
                    style={[
                      styles.tag,
                      { alignSelf: 'flex-start', marginTop: 8 },
                    ]}
                  >
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

export default FeedScreen;
