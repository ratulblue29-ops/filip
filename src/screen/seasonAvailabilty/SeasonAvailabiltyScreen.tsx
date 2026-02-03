import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { ArrowLeft, Bell, Search, ChevronDown } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import CandidateCard, {
  Candidate,
} from '../../components/findjob/CandidateCard';
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

const SeasonAvailabilityScreen = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const filteredCandidates = CANDIDATES.filter(candidate =>
    candidate.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft width={22} height={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Seasonal Talent</Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('notification')}
        >
          <Bell width={24} height={24} color="white" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[
          { label: 'Position' },
          { label: 'Availability' },
          { label: 'Location' },
        ]}
        keyExtractor={item => item.label}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterBtn,
              item.label === 'Position' && styles.filterBtnActive,
            ]}
          >
            <Text
              style={
                item.label === 'Position'
                  ? styles.filterBtnTextActive
                  : styles.filterBtnText
              }
            >
              {item.label}
            </Text>
            <ChevronDown
              size={20}
              color={item.label === 'Position' ? '#000' : '#FFF'}
            />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterScroll}
      />

      {/* List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.countText}>
          {filteredCandidates.length} Available Candidate
        </Text>
        <TouchableOpacity style={styles.sortRow}>
          <Text style={styles.sortText}>Sort by</Text>
          <ChevronDown size={14} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Candidate List */}
      <FlatList
        data={filteredCandidates}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CandidateCard candidate={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default SeasonAvailabilityScreen;
