import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import styles from '../../screen/feed/style';
import FeedCard from './FeedCard';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import FeedCardSkeleton from '../skeleton/FeedCardSkeleton';

import { fetchRecommendedJobsPaginated } from '../../services/jobs';
import { fetchWishlistIds } from '../../services/wishlist';

const Gig = () => {
  // RECOMMENDED JOBS
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['recommendedJobs'],
      queryFn: ({ pageParam }) => fetchRecommendedJobsPaginated(pageParam, 10),
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
    return data?.pages?.flatMap(page => page.jobs) ?? [];
  }, [data]);

  if (isPending || wishlistLoading) {
    return <FeedCardSkeleton />;
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
