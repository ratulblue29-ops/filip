import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { MapPin, Bookmark, ChevronLeft } from 'lucide-react-native';
import { styles } from './style';
import { fetchWishlistJobs, removeFromWishlist } from '../../services/wishlist';
import FilterItem from '../../components/FilterItem';
import { RootStackParamList } from '../../navigator/RootNavigator';
import ApplyModal from '../../components/fulltime/ApplyModal';

// ─── Types ────────────────────────────────────────────────────────────────────

type JobType = 'all' | 'fulltime' | 'seasonal' | 'daily';

type SavedJob = {
  id: string;
  type: JobType;
  title: string;
  location?: string[];
  userId: string;
  bannerImage?: string | null;
  rate?: { amount: number; unit: string };
  user?: { name?: string; photo?: string } | null;
};

type Filter = { id: JobType; label: string };

const FILTERS: Filter[] = [
  { id: 'all', label: 'All Saved' },
  { id: 'fulltime', label: 'Full-Time' },
  { id: 'seasonal', label: 'Seasonal' },
  { id: 'daily', label: 'Daily' },
];

// ─── SavedJobCard ─────────────────────────────────────────────────────────────

type CardProps = {
  job: SavedJob;
  onUnsave: (id: string) => void;
  onAction: (job: SavedJob) => void;
  isActionLoading: boolean;
};

const SavedJobCard = React.memo(
  ({ job, onUnsave, onAction, isActionLoading }: CardProps) => {
    const isFulltime = job.type === 'fulltime';

    return (
      <View style={styles.card}>
        {job.bannerImage ? (
          <Image
            source={{ uri: job.bannerImage }}
            style={styles.cardBanner}
            resizeMode="cover"
          />
        ) : null}
        <View style={styles.cardHeader}>
          <Image
            source={{
              uri:
                job.user?.photo ??
                'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
            }}
            style={styles.cardAvatar}
            resizeMode="cover"
          />
          <View style={styles.cardMeta}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {job.title}
            </Text>
            <View style={styles.locationRow}>
              <MapPin width={13} height={13} color="#9CA3AF" />
              <Text style={styles.locationText} numberOfLines={1}>
                {job.location?.[0] ?? 'Location not set'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => onUnsave(job.id)}
            activeOpacity={0.7}
            style={styles.unsaveBtn}
          >
            <Bookmark width={20} height={20} color="#FFD900" fill="#FFD900" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardTagRow}>
          <View
            style={[
              styles.typeBadge,
              isFulltime ? styles.badgeFulltime : styles.badgeSeasonal,
            ]}
          >
            <Text style={styles.badgeText}>
              {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
            </Text>
          </View>
          {job.rate && (
            <Text style={styles.rateText}>
              € {job.rate.amount}/{job.rate.unit}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.8}
          onPress={() => onAction(job)}
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <ActivityIndicator color="#111827" size="small" />
          ) : (
            <Text style={styles.ctaBtnText}>
              {isFulltime ? 'Apply Now' : 'Engage Candidate'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  },
);

// ─── Screen ───────────────────────────────────────────────────────────────────

const SavedJobsScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<JobType>('all');
  const [loadingJobId, setLoadingJobId] = useState<string | null>(null);
  const [applyModalJob, setApplyModalJob] = useState<SavedJob | null>(null);

  const { data: savedJobs = [], isPending } = useQuery({
    queryKey: ['wishlistJobs'],
    queryFn: fetchWishlistJobs,
  });

  // Optimistic unsave — instant UI feedback, rolls back on error
  const { mutate: unsave } = useMutation({
    mutationFn: removeFromWishlist,
    onMutate: async (jobId: string) => {
      await queryClient.cancelQueries({ queryKey: ['wishlistJobs'] });
      const prev = queryClient.getQueryData<SavedJob[]>(['wishlistJobs']);
      queryClient.setQueryData<SavedJob[]>(['wishlistJobs'], old =>
        (old ?? []).filter(j => j.id !== jobId),
      );
      // Keep bookmark icons in FeedCard/FulltimeScreen in sync
      queryClient.invalidateQueries({ queryKey: ['wishlistIds'] });
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      queryClient.setQueryData(['wishlistJobs'], ctx?.prev);
    },
  });

  // fulltime → applyToJob | seasonal/daily → createEngagement
  const handleAction = useCallback(
    async (job: SavedJob) => {
      if (loadingJobId) return;
      setLoadingJobId(job.id);
      try {
        if (job.type === 'fulltime') {
          setApplyModalJob(job);
          setLoadingJobId(null);
          return;
        } else {
          // Saved job IS the availability post — navigate directly to SendOffer
          navigation.navigate('SendOffer', {
            workerId: job.userId,
            selectedPost: {
              id: job.id,
              title: job.title,
              location: job.location ?? [],
              rate: job.rate ?? { amount: 0, unit: 'hour' },
              type: job.type,
            },
          });
          setLoadingJobId(null);
          return;
        }
      } catch (err: any) {
        console.warn('SavedJobsScreen action error:', err?.message);
      } finally {
        setLoadingJobId(null);
      }
    },
    [loadingJobId],
  );

  const filteredJobs = useMemo<SavedJob[]>(() => {
    if (activeFilter === 'all') return savedJobs;
    return savedJobs.filter((j: SavedJob) => j.type === activeFilter);
  }, [savedJobs, activeFilter]);

  const renderFilter: ListRenderItem<Filter> = useCallback(
    ({ item }) => (
      <FilterItem
        label={item.label}
        active={activeFilter === item.id}
        onPress={() => setActiveFilter(item.id)}
      />
    ),
    [activeFilter],
  );

  const renderJob: ListRenderItem<SavedJob> = useCallback(
    ({ item }) => (
      <SavedJobCard
        job={item}
        onUnsave={unsave}
        onAction={handleAction}
        isActionLoading={loadingJobId === item.id}
      />
    ),
    [unsave, handleAction, loadingJobId],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backBtn}
        >
          <ChevronLeft width={24} height={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Posts</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={FILTERS}
        horizontal
        renderItem={renderFilter}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      />

      <FlatList
        data={isPending ? [] : filteredJobs}
        keyExtractor={item => item.id}
        renderItem={renderJob}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          isPending ? (
            <ActivityIndicator color="#FFD900" style={styles.loader} />
          ) : (
            <Text style={styles.emptyText}>No saved jobs here</Text>
          )
        }
      />
      {applyModalJob && (
        <ApplyModal
          visible={!!applyModalJob}
          onClose={() => setApplyModalJob(null)}
          job={applyModalJob}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedJobsScreen;
