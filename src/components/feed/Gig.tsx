import { View, Text, FlatList } from 'react-native';
import styles from '../../screen/feed/style';
import FeedCard from './FeedCard';
import { useQuery } from '@tanstack/react-query';

import FeedCardSkeleton from '../skeleton/FeedCardSkeleton';
import { fetchRecommendedJobs } from '../../services/jobs';

const Gig = () => {
  const { data: recommendedData, isPending } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: fetchRecommendedJobs,
  });
  if (isPending) {
    return <FeedCardSkeleton />;
  }
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        {/* <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={recommendedData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <FeedCard item={item} />}
        showsVerticalScrollIndicator={false}
      />

      {/* <Text style={styles.sectionTitle}>Newest Availabilities</Text> */}
    </View>
  );
};

export default Gig;
