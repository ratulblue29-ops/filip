import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Search, ChevronDown, X, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchWishlistIds,
  addToWishlist,
  removeFromWishlist,
} from '../../services/wishlist';
import { styles } from './style';
import FilterItem from '../../components/FilterItem';
import { JobCard } from '../../components/fulltime/JobCard';
import { fetchRecommendedJobsPaginated } from '../../services/jobs';
import JobCardSkeleton from '../../components/skeleton/JobCardSkeleton';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import NotificationDot from '../../components/feed/NotificationDot';
import { fetchMyOffers } from '../../services/applyToJob';

const FulltimeScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  /* ---------------- PAGINATION FETCH JOBS ---------------- */
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['fulltime-jobs'],
      queryFn: ({ pageParam }) =>
        fetchRecommendedJobsPaginated(pageParam, 10, 'fulltime'),
      initialPageParam: null,
      getNextPageParam: lastPage => {
        return lastPage?.hasMore ? lastPage?.lastDoc : undefined;
      },
    });

  const { data: myOffers = [] } = useQuery({
    queryKey: ['my-offers'],
    queryFn: fetchMyOffers,
  });

  const appliedJobIds = useMemo(
    () => new Set(myOffers.map((o: any) => o.job.id)),
    [myOffers],
  );

  const queryClient = useQueryClient();

  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlistIds'],
    queryFn: fetchWishlistIds,
  });

  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  const { mutate: toggleWishlist } = useMutation({
    mutationFn: (jobId: string) =>
      wishlistSet.has(jobId) ? removeFromWishlist(jobId) : addToWishlist(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlistIds'] });
      queryClient.invalidateQueries({ queryKey: ['wishlistJobs'] });
    },
  });

  /* ---------------- FIX ESLINT WARNING ---------------- */
  const jobs = useMemo(() => {
    return data?.pages?.flatMap(page => page.jobs) ?? [];
  }, [data]);

  const locationFilters = useMemo(() => {
    const locations = new Set<string>();
    jobs.forEach((job: any) => {
      if (Array.isArray(job.location)) {
        job.location.forEach((loc: string) => {
          if (loc?.trim()) locations.add(loc.trim());
        });
      }
    });
    return ['All', ...Array.from(locations)];
  }, [jobs]);

  const positionFilters = useMemo(() => {
    const positions = new Set<string>();
    jobs.forEach((job: any) => {
      if (job.title?.trim()) positions.add(job.title.trim());
    });
    return ['All', ...Array.from(positions)];
  }, [jobs]);

  // ACTIVE FILTER
  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) => {
      const searchMatch =
        job.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchText.toLowerCase());

      if (!searchMatch) return false;

      if (selectedLocation !== 'All') {
        const locationMatch = Array.isArray(job.location) &&
          job.location.some((loc: string) => loc?.toLowerCase() === selectedLocation.toLowerCase());
        if (!locationMatch) return false;
      }

      if (selectedPosition !== 'All') {
        if (job.title?.trim() !== selectedPosition) return false;
      }

      return true;

      // Match against job.location array
      // return Array.isArray(job.location) &&
      //   job.location.some(
      //     (loc: string) =>
      //       loc?.toLowerCase() === selectedLocation.toLowerCase(),
      //   );
    });
  }, [jobs, searchText, selectedLocation, selectedPosition]);

  const renderJobItem: ListRenderItem<any> = useCallback(
    ({ item }) => (
      <JobCard
        job={{
          ...item,
          isApplied: appliedJobIds.has(item.id),
          isWishlisted: wishlistSet.has(item.id),
        }}
        onBookmark={() => toggleWishlist(item.id)}
      />
    ),
    [appliedJobIds, wishlistSet, toggleWishlist],
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
      </View>

      {/* Location Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => { setPositionDropdownOpen(false); setDropdownOpen(prev => !prev); }}
          style={[styles.locationBtn, selectedLocation !== 'All' ? styles.locationBtnActive : styles.locationBtnDefault]}
          activeOpacity={0.8}
        >
          <Text style={selectedLocation !== 'All' ? styles.locationBtnTextActive : styles.locationBtnText}>
            {selectedLocation === 'All' ? 'Location' : selectedLocation}
          </Text>
          <ChevronDown size={20} color={selectedLocation !== 'All' ? '#000' : '#FFF'} />
        </TouchableOpacity>

        {selectedLocation !== 'All' && (
          <TouchableOpacity
            onPress={() => { setSelectedLocation('All'); setDropdownOpen(false); }}
            style={styles.resetBtn}
            activeOpacity={0.8}
          >
            <X size={16} color="#FFF" />
          </TouchableOpacity>
        )}

        {dropdownOpen && (
          <View style={styles.dropdown}>
            {locationFilters.filter(l => l !== 'All').map(loc => (
              <TouchableOpacity
                key={loc}
                onPress={() => { setSelectedLocation(loc); setDropdownOpen(false); }}
                style={styles.dropdownItem}
              >
                <Text style={selectedLocation === loc ? styles.dropdownItemTextActive : styles.dropdownItemText}>{loc}</Text>
                {selectedLocation === loc && <Check size={16} color="#FFD900" />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Position Dropdown */}
        <TouchableOpacity
          onPress={() => { setDropdownOpen(false); setPositionDropdownOpen(prev => !prev); }}
          style={[styles.locationBtn, selectedPosition !== 'All' ? styles.locationBtnActive : styles.locationBtnDefault]}
          activeOpacity={0.8}
        >
          <Text style={selectedPosition !== 'All' ? styles.locationBtnTextActive : styles.locationBtnText}>
            {selectedPosition === 'All' ? 'Position' : selectedPosition}
          </Text>
          <ChevronDown size={20} color={selectedPosition !== 'All' ? '#000' : '#FFF'} />
        </TouchableOpacity>

        {selectedPosition !== 'All' && (
          <TouchableOpacity
            onPress={() => { setSelectedPosition('All'); setPositionDropdownOpen(false); }}
            style={styles.resetBtn}
            activeOpacity={0.8}
          >
            <X size={16} color="#FFF" />
          </TouchableOpacity>
        )}

        {positionDropdownOpen && (
          <View style={[styles.dropdown, { left: 120 }]}>
            {positionFilters.filter(p => p !== 'All').map(pos => (
              <TouchableOpacity
                key={pos}
                onPress={() => { setSelectedPosition(pos); setPositionDropdownOpen(false); }}
                style={styles.dropdownItem}
              >
                <Text style={selectedPosition === pos ? styles.dropdownItemTextActive : styles.dropdownItemText}>{pos}</Text>
                {selectedPosition === pos && <Check size={16} color="#FFD900" />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Job List */}
      <FlatList
        data={isPending ? [] : filteredJobs}
        keyExtractor={item => item.id}
        renderItem={renderJobItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isPending ? (
            <JobCardSkeleton />
          ) : (
            <Text
              style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 50 }}
            >
              No jobs found
            </Text>
          )
        }
        ListFooterComponent={
          <View style={{ marginVertical: 10 }}>
            {hasNextPage ? (
              <TouchableOpacity
                onPress={() => fetchNextPage()}
                activeOpacity={0.7}
              >
                {isFetchingNextPage ? (
                  <ActivityIndicator color="#fcd303" />
                ) : (
                  <Text style={styles.seeAllText}>See More</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default FulltimeScreen;
