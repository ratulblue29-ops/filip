
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../../screen/feed/style';
import FeedCard from './FeedCard';

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from '@react-native-firebase/firestore';

const Gig = () => {
  const [recommendedData, setRecommendedData] = useState<any[]>([]);
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const q = query(
          collection(getFirestore(), 'jobs'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const mappedData = snapshot.docs.map((doc: { data: () => any; id: string; }) => {
          const job = doc.data();

          return {
            id: doc.id,
            name: job.userName ?? 'Anonymous',
            role: job.title,
            rate: job.rate
              ? `€${job.rate.amount}`
              : '',
            location: Array.isArray(job.location)
              ? job.location.join(', ')
              : 'Unknown location',
            badge: job.type === 'seasonal'
              ? 'Seasonal'
              : 'Starts Soon',
            availability: job.schedule?.end
              ? 'Scheduled'
              : job.type,
            subAvailability: job.schedule?.end
              ? 'Flexible'
              : undefined,
            tags: job.requiredSkills ?? [],
            image:
              job.bannerImage && job.bannerImage !== ''
                ? job.bannerImage
                : 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
          };
        });

        setRecommendedData(mappedData);
      } catch (error) {
        console.log('Error fetching recommended jobs:', error);
      }
    };

    fetchRecommendedJobs();
  }, []);

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recommended For You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
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
