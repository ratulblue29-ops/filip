import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';

import { styles } from './style';
import FilterItem from '../../components/FilterItem';
import { JobCard } from '../../components/fulltime/JobCard';
import { fetchRecommendedJobs } from '../../services/jobs';
import JobCardSkeleton from '../../components/skeleton/JobCardSkeleton';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import NotificationDot from '../../components/feed/NotificationDot';
// TYPES
type Filter = {
  id: string;
  label: string;
  active: boolean;
};

// FILTERS
const INITIAL_FILTERS: Filter[] = [
  { id: '1', label: 'All Jobs', active: true },
  { id: '2', label: 'Kitchen', active: false },
  { id: '3', label: 'Front House', active: false },
  { id: '4', label: '$50k+', active: false },
  { id: '5', label: 'Immediate Starts', active: false },
];

const FulltimeScreen = () => {
  const [filters, setFilters] = useState<Filter[]>(INITIAL_FILTERS);
  const [searchText, setSearchText] = useState('');
  
  // FETCH JOBS
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['fulltime-jobs'],
    queryFn: fetchRecommendedJobs,
  });

  // ACTIVE FILTER
  const activeFilter = useMemo(
    () => filters.find(f => f.active)?.label,
    [filters],
  );

  // FILTER LOGIC
  const filteredJobs = useMemo(() => {
    return jobs.filter(
      (job: {
        title: string;
        description: string;
        rate: { amount: number };
        priority: string;
      }) => {
        // SEARCH
        const searchMatch =
          job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchText.toLowerCase());

        if (!searchMatch) return false;
        if (activeFilter === 'All Jobs') return true;

        if (activeFilter === 'Kitchen') {
          return job.title?.toLowerCase().includes('kitchen');
        }

        if (activeFilter === 'Front House') {
          return (
            job.title?.toLowerCase().includes('front') ||
            job.title?.toLowerCase().includes('reception')
          );
        }

        if (activeFilter === '$50k+') {
          return job.rate?.amount >= 50000;
        }

        if (activeFilter === 'Immediate Starts') {
          return job.priority === 'active';
        }
        return true;
      },
    );
  }, [jobs, searchText, activeFilter]);

  //FILTER HANDLER
  const onFilterPress = useCallback((id: string) => {
    setFilters(prev =>
      prev.map(item => ({
        ...item,
        active: item.id === id,
      })),
    );
  }, []);

  const renderFilterItem: ListRenderItem<Filter> = useCallback(
    ({ item }) => (
      <FilterItem
        label={item.label}
        active={item.active}
        onPress={() => onFilterPress(item.id)}
      />
    ),
    [onFilterPress],
  );

  const renderJobItem: ListRenderItem<any> = useCallback(
    ({ item }) => <JobCard job={item} onBookmark={() => {}} />,
    [],
  );

  // notification get for dot
  const { hasUnread } = useUnreadNotifications();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Full-Time roles</Text>
        <NotificationDot hasUnread={hasUnread} />
      </View>

      {/* Search */}
      <View style={styles.searchContainerWrapper}>
        <View style={styles.searchContainer}>
          <Search width={24} height={24} color="white" />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search jobs"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.filterBtnIcon}>
          <SlidersHorizontal width={24} height={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <FlatList
        data={filters}
        horizontal
        renderItem={renderFilterItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      />

      {/* Job List */}
      <FlatList
        data={isLoading ? [] : filteredJobs}
        keyExtractor={item => item.id}
        renderItem={renderJobItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading ? (
            <JobCardSkeleton />
          ) : (
            <Text
              style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 50 }}
            >
              No jobs found
            </Text>
          )
        }
      />
    </SafeAreaView>
  );
};

export default FulltimeScreen;
