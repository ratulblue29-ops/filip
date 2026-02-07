import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { useNavigation } from '@react-navigation/native';
import CandidateCard from '../../components/findjob/CandidateCard';
import { useQuery } from '@tanstack/react-query';
import { fetchSeasonalJobs } from '../../services/jobs';
import CandidateCardSkeleton from '../../components/skeleton/CandidateCardSkeleton';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import NotificationDot from '../../components/feed/NotificationDot';

const SeasonAvailabilityScreen = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const { data: workers, isPending } = useQuery({
    queryKey: ['workers'],
    queryFn: fetchSeasonalJobs,
  });

  // notification get for dot
  const { hasUnread } = useUnreadNotifications();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft width={22} height={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Seasonal Talent</Text>

        <NotificationDot hasUnread={hasUnread} />
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
          {workers?.length} Available Candidate
        </Text>
        <TouchableOpacity style={styles.sortRow}>
          <Text style={styles.sortText}>Sort by</Text>
          <ChevronDown size={14} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Candidate List */}
      <FlatList
        data={isPending ? Array(5).fill({}) : workers}
        keyExtractor={(item, index) => (isPending ? index.toString() : item.id)}
        renderItem={({ item }) =>
          isPending ? (
            <CandidateCardSkeleton />
          ) : (
            <CandidateCard candidate={item} />
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default SeasonAvailabilityScreen;
