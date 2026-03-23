import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import useRefresh from '../../hooks/useRefresh';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import NotificationDot from '../../components/feed/NotificationDot';
import DailyCard from '../../components/findjob/DailyCard';
import { fetchDailyJobs } from '../../services/jobs';
import { styles } from './style';
import CandidateCardSkeleton from '../../components/skeleton/CandidateCardSkeleton';
import FilterDropdown from '../../components/findjob/FilterDropdown';

const DailyAvailabilityScreen = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const { hasUnread } = useUnreadNotifications();

  const {
    data: jobs = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['dailyJobs'],
    queryFn: fetchDailyJobs,
  });

  const { refreshing, onRefresh } = useRefresh(refetch);

  const locationOptions = useMemo(() => {
    const all = jobs.flatMap((j: any) => j.location ?? []).filter(Boolean);
    return [...new Set(all)] as string[];
  }, [jobs]);

  const availabilityOptions = ['Available Today', 'Starts Soon'];

  const handleReset = () => {
    setAvailabilityFilter(null);
    setLocationFilter(null);
  };

  const hasActiveFilters = availabilityFilter || locationFilter;

  // const filtered = useMemo(() => {
  //   if (!search.trim()) return jobs;
  //   const lower = search.toLowerCase();
  //   return jobs.filter(
  //     (j: any) =>
  //       j.targetPosition?.toLowerCase().includes(lower) ||
  //       j.user?.name?.toLowerCase().includes(lower) ||
  //       j.location?.some((l: string) => l.toLowerCase().includes(lower)),
  //   );
  // }, [jobs, search]);
  const filtered = useMemo(() => {
    let result = [...jobs];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (j: any) =>
          j.targetPosition?.toLowerCase().includes(lower) ||
          j.user?.name?.toLowerCase().includes(lower) ||
          j.location?.some((l: string) => l.toLowerCase().includes(lower)),
      );
    }

    if (locationFilter) {
      result = result.filter((j: any) =>
        j.location?.some(
          (l: string) => l.toLowerCase() === locationFilter.toLowerCase(),
        ),
      );
    }

    if (availabilityFilter === 'Available Today') {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      result = result.filter((j: any) => j.date === today);
    } else if (availabilityFilter === 'Starts Soon') {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      result = result.filter((j: any) => j.date > today);
    }

    return result;
  }, [jobs, search, locationFilter, availabilityFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft width={22} height={22} color="white" />
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Daily Talent</Text>
        <NotificationDot hasUnread={hasUnread} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search by position, name, city..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Type Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.chipText}>Seasonal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.chip, styles.activeChip]}>
          <Text style={styles.activeChipText}>Daily</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { key: 'availability', label: 'Availability', options: availabilityOptions, selected: availabilityFilter, onSelect: setAvailabilityFilter },
            { key: 'location', label: 'Location', options: locationOptions, selected: locationFilter, onSelect: setLocationFilter },
          ]}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <FilterDropdown
              label={item.label}
              options={item.options}
              selected={item.selected}
              onSelect={item.onSelect}
            />
          )}
        />
      </View>

      {/* List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.countText}>{filtered.length} Available</Text>
        {hasActiveFilters ? (
          <TouchableOpacity onPress={handleReset}>
            <Text style={{ color: '#FF4444', fontSize: 13, fontFamily: 'InterDisplayRegular' }}>Reset</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* List */}
      <FlatList
        data={isPending ? Array(4).fill({}) : filtered}
        keyExtractor={(item, index) => (isPending ? index.toString() : item.id)}
        renderItem={({ item }) =>
          isPending ? <CandidateCardSkeleton /> : <DailyCard item={item} />
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD900"
          />
        }
      />
    </SafeAreaView>
  );
};

export default DailyAvailabilityScreen;
