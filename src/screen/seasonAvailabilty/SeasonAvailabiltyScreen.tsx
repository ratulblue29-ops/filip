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
import useRefresh from '../../hooks/useRefresh';
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
import FilterDropdown from '../../components/findjob/FilterDropdown';
import { useTranslation } from 'react-i18next';

const SeasonAvailabilityScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(
    null,
  );
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const handleReset = () => {
    setPositionFilter(null);
    setAvailabilityFilter(null);
    setLocationFilter(null);
    setSortBy(null);
  };

  // const handleBack = () => {
  //   navigation.goBack();
  // };

  const {
    data: workers,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['workers'],
    queryFn: fetchSeasonalJobs,
  });

  const { refreshing, onRefresh } = useRefresh(refetch);

  // notification get for dot
  const { hasUnread } = useUnreadNotifications();

  const positionOptions = useMemo(() => {
    if (!workers) return [];
    const all = workers.flatMap((w: any) => w.tags ?? []);
    return [...new Set(all)] as string[];
  }, [workers]);

  const locationOptions = useMemo(() => {
    if (!workers) return [];
    const all = workers.flatMap((w: any) => w.location ?? []).filter(Boolean);
    return [...new Set(all)] as string[];
  }, [workers]);

  const availabilityOptions = [t('find_workers.available_now'), t('find_workers.starts_soon')];
  const sortOptions = [t('find_workers.newest_first'), t('find_workers.oldest_first')];

  const filteredWorkers = useMemo(() => {
    if (!workers) return [];

    let result = [...workers];

    if (search.trim()) {
      result = result.filter(
        (w: any) =>
          w.title?.toLowerCase().includes(search.toLowerCase()) ||
          w.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          w.tags?.some((tag: string) =>
            tag.toLowerCase().includes(search.toLowerCase()),
          ),
      );
    }

    if (positionFilter) {
      result = result.filter((w: any) =>
        w.tags?.some(
          (tag: string) => tag.toLowerCase() === positionFilter.toLowerCase(),
        ),
      );
    }

    if (locationFilter) {
      result = result.filter(
        (w: any) =>
          w.location?.some(
            (loc: string) => loc.toLowerCase() === locationFilter.toLowerCase(),
          ),
      );
    }

    if (availabilityFilter === t('find_workers.available_now')) {
      const now = new Date();
      result = result.filter((w: any) => {
        const start = w.dateRange?.start ? new Date(w.dateRange.start) : null;
        const end = w.dateRange?.end ? new Date(w.dateRange.end) : null;
        return start && end && now >= start && now <= end;
      });
    } else if (availabilityFilter === t('find_workers.starts_soon')) {
      const now = new Date();
      result = result.filter((w: any) => {
        const start = w.dateRange?.start ? new Date(w.dateRange.start) : null;
        return start && start > now;
      });
    }

    if (sortBy === t('find_workers.newest_first')) {
      result.sort((a: any, b: any) => {
        const aTime = new Date(a.dateRange?.start ?? 0).getTime();
        const bTime = new Date(b.dateRange?.start ?? 0).getTime();
        return bTime - aTime;
      });
    } else if (sortBy === t('find_workers.oldest_first')) {
      result.sort((a: any, b: any) => {
        const aTime = new Date(a.dateRange?.start ?? 0).getTime();
        const bTime = new Date(b.dateRange?.start ?? 0).getTime();
        return aTime - bTime;
      });
    }

    return result;
  }, [
    workers,
    positionFilter,
    locationFilter,
    availabilityFilter,
    sortBy,
    search,
    t,
  ]);

  const hasActiveFilters =
    positionFilter || locationFilter || availabilityFilter || sortBy;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft width={22} height={22} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Seasonal Talent</Text>

        <NotificationDot hasUnread={hasUnread} />
      </View> */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('find_workers.title')}</Text>
        <NotificationDot hasUnread={hasUnread} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder={t('find_workers.search_placeholder')}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Type Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.chip, styles.activeChip]}>
          <Text style={styles.activeChipText}>{t('find_workers.seasonal')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => navigation.navigate('Daily')}
        >
          <Text style={styles.chipText}>{t('find_workers.daily')}</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {/* <FlatList
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
      /> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 16,
        }}
      >
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            {
              key: 'position',
              label: t('find_workers.position'),
              options: positionOptions,
              selected: positionFilter,
              onSelect: setPositionFilter,
            },
            {
              key: 'availability',
              label: t('find_workers.availability'),
              options: availabilityOptions,
              selected: availabilityFilter,
              onSelect: setAvailabilityFilter,
            },
            {
              key: 'location',
              label: t('find_workers.location'),
              options: locationOptions,
              selected: locationFilter,
              onSelect: setLocationFilter,
            },
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
      {/* <View style={styles.listHeader}>
        <Text style={styles.countText}>
          {workers?.length} Available Candidate
        </Text>
        <TouchableOpacity style={styles.sortRow}>
          <Text style={styles.sortText}>Sort by</Text>
          <ChevronDown size={14} color="#FFD700" />
        </TouchableOpacity>
      </View> */}
      <View style={styles.listHeader}>
        <Text style={styles.countText}>
          {filteredWorkers.length} {t('find_workers.available_candidate')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {hasActiveFilters ? (
            <TouchableOpacity onPress={handleReset}>
              <Text
                style={{
                  color: '#FF4444',
                  fontSize: 13,
                  fontFamily: 'InterDisplayRegular',
                }}
              >
                {t('find_workers.reset')}
              </Text>
            </TouchableOpacity>
          ) : null}
          <FilterDropdown
            label={t('find_workers.sort_by')}
            options={sortOptions}
            selected={sortBy}
            onSelect={setSortBy}
          />
        </View>
      </View>

      {/* Candidate List */}
      <FlatList
        data={isPending ? Array(5).fill({}) : filteredWorkers}
        keyExtractor={(item, index) => (isPending ? index.toString() : item.id)}
        renderItem={({ item }) =>
          isPending ? (
            <CandidateCardSkeleton />
          ) : (
            <CandidateCard candidate={item} />
          )
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

export default SeasonAvailabilityScreen;
