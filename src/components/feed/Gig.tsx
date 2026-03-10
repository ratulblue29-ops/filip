import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import styles from '../../screen/feed/style';
import FeedCard from './FeedCard';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import FeedCardSkeleton from '../skeleton/FeedCardSkeleton';

import { fetchRecommendedJobsPaginated } from '../../services/jobs';
import { fetchWishlistIds } from '../../services/wishlist';

type GigProps = {
  refreshing: boolean;
  onRefresh: () => void;
};

const Gig = ({ refreshing, onRefresh }: GigProps) => {
  // RECOMMENDED JOBS
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['recommendedJobs'],
      queryFn: ({ pageParam }) =>
        fetchRecommendedJobsPaginated(pageParam, 10, 'all'),
      initialPageParam: null,
      getNextPageParam: lastPage => {
        return lastPage?.hasMore ? lastPage?.lastDoc : undefined;
      },
    });

  //  FETCH WISHLIST IDS
  const { data: wishlistIds = [], isLoading: wishlistLoading } = useQuery({
    queryKey: ['wishlistIds'],
    queryFn: fetchWishlistIds,
  });

  //  FLATTEN JOBS
  const recommendedData = useMemo(() => {
    const all = data?.pages?.flatMap(page => page.jobs) ?? [];
    // Feed shows ONLY daily and seasonal — fulltime lives in its own tab
    return all.filter(
      (job: any) => job.type === 'daily' || job.type === 'seasonal',
    );
  }, [data]);

  if (isPending || wishlistLoading) {
    return (
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={<FeedCardSkeleton />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD900"
          />
        }
      />
    );
  }

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Available Now</Text>
      </View>

      <FlatList
        data={recommendedData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FeedCard item={item} wishlistIds={wishlistIds} />
        )}
        ListEmptyComponent={
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultText}>No availability posted yet</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD900"
          />
        }
        ListFooterComponent={
          <View style={styles.gigContainer}>
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
    </View>
  );
};

export default Gig;
