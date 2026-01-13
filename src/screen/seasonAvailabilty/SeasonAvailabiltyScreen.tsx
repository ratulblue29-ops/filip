import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  ArrowLeft,
  Bell,
  Search,
  ChevronDown,
  MapPin,
  Calendar,
  Lock,
  SendHorizontal,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';

/* =======================
   Types
======================= */
interface Candidate {
  id: string;
  name: string;
  avatar: string;
  location: string;
  image: string;
  status: 'Available' | 'Starts Soon';
  statusText: string;
  tags: string[];
  availabilityType: string;
  dates: string;
  isLocked: boolean;
}

/* =======================
   Data
======================= */
const CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Alex M.',
    avatar:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400',
    location: 'Ibiza, Spain',
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400',
    status: 'Available',
    statusText: 'Available',
    tags: ['Head Chef', '5 Years Exp.', 'Michelin Star'],
    availabilityType: 'Available For Summer Season',
    dates: 'May 1 - Sept 30',
    isLocked: false,
  },
  {
    id: '2',
    name: 'Alex M.',
    avatar:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400',
    location: 'Mykonos, Greece',
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=400',
    status: 'Starts Soon',
    statusText: 'Starts June 15',
    tags: ['Mixologist', '3 Years Exp.'],
    availabilityType: 'Full Season Availability',
    dates: 'June 15 - Oct 30',
    isLocked: true,
  },
  {
    id: '3',
    name: 'Alex M.',
    avatar:
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=400',
    location: 'Ibiza, Spain',
    image:
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=400',
    status: 'Available',
    statusText: 'Available',
    tags: ['Head Waiter', 'Sommelier L2'],
    availabilityType: 'Flexible Dates',
    dates: 'June 1 - Oct 31',
    isLocked: false,
  },
];

/* =======================
   Screen
======================= */
const SeasonAvailabiltyScreen = () => {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    navigation.goBack();
  };

  /* =======================
     Candidate Card Renderer
  ======================= */
  const renderCandidate = (item: Candidate) => (
    <View style={styles.card}>
     <Image source={{ uri: item.image }} style={styles.candidateImage} />

        <View
          style={[
            styles.statusBadge,
            item.status === 'Available'
              ? styles.statusYellow
              : styles.statusDark,
          ]}
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  item.status === 'Available' ? '#F59E0B' : '#4ADE80',
              },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: item.status === 'Available' ? '#000' : '#FFF' },
            ]}
          >
            {item.statusText}
          </Text>
        </View>

        <View style={styles.profileRow}>
            <Image
              source={{ uri: item.image }}
              style={styles.avatarPlaceholder}
            />
            <View>
              <Text style={styles.candidateName}>{item.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#FFF" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>
            </View>
          </View>

      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.availabilityRow}>
          <Calendar size={24} color="#FFF" />
          <View>
            <Text style={styles.availabilityTitle}>
              {item.availabilityType}
            </Text>
            <Text style={styles.availabilityDates}>{item.dates}</Text>
          </View>
        </View>

        {item.isLocked ? (
          <TouchableOpacity style={styles.lockButton}>
            <Lock size={18} color="#FFF" />
            <Text style={styles.lockButtonText}>Upgrade To Contact</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.engageButton}>
            <Text style={styles.engageButtonText}>Engage Candidate</Text>

                          <SendHorizontal width={18} height={18} color="#1F2937"/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  /* =======================
     JSX
  ======================= */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft width={22} height={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Seasonal Talent</Text>

        <View>
          <Bell width={24} height={24} color="white" />
          <View style={styles.notifDot} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <TouchableOpacity
          style={[styles.filterBtn, styles.filterBtnActive]}
        >
          <Text style={styles.filterBtnTextActive}>Position</Text>
          <ChevronDown size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterBtnText}>Period</Text>
          <ChevronDown size={20} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterBtnText}>Location</Text>
          <ChevronDown size={20} color="#FFF" />
              </TouchableOpacity>
               <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterBtnText}>Period</Text>
          <ChevronDown size={20} color="#FFF" />
        </TouchableOpacity>

      </ScrollView>

      {/* List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.countText}>24 Available Candidate</Text>
        <TouchableOpacity style={styles.sortRow}>
          <Text style={styles.sortText}>Sort by</Text>
          <ChevronDown size={14} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Candidate List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {CANDIDATES.map(candidate => (
          <View key={candidate.id}>{renderCandidate(candidate)}</View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeasonAvailabiltyScreen;
