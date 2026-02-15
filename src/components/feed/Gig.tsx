// import { View, Text, FlatList } from 'react-native';
// import styles from '../../screen/feed/style';
// import FeedCard from './FeedCard';
// import { useQuery } from '@tanstack/react-query';

// import FeedCardSkeleton from '../skeleton/FeedCardSkeleton';
// import { fetchRecommendedJobs } from '../../services/jobs';

// const Gig = () => {
//   const { data: recommendedData, isPending } = useQuery({
//     queryKey: ['recommendedJobs'],
//     queryFn: fetchRecommendedJobs,
//   });
//   if (isPending) {
//     return <FeedCardSkeleton />;
//   }
//   return (
//     <View>
//       <View style={styles.headerRow}>
//         <Text style={styles.sectionTitle}>Recommended For You</Text>
//         {/* <TouchableOpacity>
//           <Text style={styles.seeAllText}>See All</Text>
//         </TouchableOpacity> */}
//       </View>

//       <FlatList
//         data={recommendedData}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => <FeedCard item={item} />}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* <Text style={styles.sectionTitle}>Newest Availabilities</Text> */}
//     </View>
//   );
// };

// export default Gig;

// import React from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import styles from '../../screen/feed/style';
// import FeedCard from './FeedCard';

// import { useInfiniteQuery } from '@tanstack/react-query';
// import FeedCardSkeleton from '../skeleton/FeedCardSkeleton';
// import { fetchRecommendedJobsPaginated } from '../../services/jobs';

// const Gig = () => {
//   const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
//     useInfiniteQuery({
//       queryKey: ['recommendedJobs'],
//       queryFn: ({ pageParam }) => fetchRecommendedJobsPaginated(pageParam, 10),
//       initialPageParam: null,
//       getNextPageParam: lastPage => {
//         return lastPage?.hasMore ? lastPage?.lastDoc : undefined;
//       },
//     });

//   const recommendedData = data?.pages?.flatMap(page => page.jobs) ?? [];

//   if (isPending) {
//     return <FeedCardSkeleton />;
//   }

//   return (
//     <View>
//       <View style={styles.headerRow}>
//         <Text style={styles.sectionTitle}>Recommended For You</Text>
//       </View>

//       <FlatList
//         data={recommendedData}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => <FeedCard item={item} />}
//         showsVerticalScrollIndicator={false}
//         ListFooterComponent={
//           <View style={{ marginVertical: 10 }}>
//             {hasNextPage ? (
//               <TouchableOpacity
//                 onPress={() => fetchNextPage()}
//                 activeOpacity={0.7}
//               >
//                 {isFetchingNextPage ? (
//                   <ActivityIndicator color="#fcd303" />
//                 ) : (
//                   <Text style={styles.seeAllText}>See More</Text>
//                 )}
//               </TouchableOpacity>
//             ) : null}
//           </View>
//         }
//       />
//     </View>
//   );
// };

// export default Gig;

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
        <Text style={styles.sectionTitle}>Recommended For You</Text>
      </View>

      <FlatList
        data={recommendedData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FeedCard item={item} wishlistIds={wishlistIds} />
        )}
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
