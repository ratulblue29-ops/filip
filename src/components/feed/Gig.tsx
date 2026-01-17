import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import styles from '../../screen/feed/style';
import FeedCard from './FeedCard';
const Gig = () => {
      const RECOMMENDED_DATA = [
    {
      id: '1',
      name: 'Micheal J.',
      role: 'Event Server',
      rate: '€25',
      location: 'SoHo, New York • 0.5 Mil',
      badge: 'Starts In 2 Hours',
      availability: 'Today, 6:00 PM - 2:00 AM',
      tags: ['Weddings', 'Vip Service'],
      image:
        'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800',
    },
    {
      id: '2',
      name: 'Sarah J.',
      role: 'Bartender Assistance',
      rate: '€35',
      location: 'Zinc Lounge • 5 Mil',
      badge: 'Seasonal',
      availability: 'Nov 15 - Jan 05',
      subAvailability: 'Flexible Weekends',
      tags: ['Inventory', 'Mixology Basic'],
      image:
        'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800',
    },
  ];
  return (
    <View>
    <View style={styles.headerRow}>
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <TouchableOpacity>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    </View>

    <FlatList
      data={RECOMMENDED_DATA}
      vertical
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FeedCard item={item} />}
      showsHorizontalScrollIndicator={false}
    />

    <Text style={styles.sectionTitle}>Newest Gigs</Text>
  </View>
  )
}

export default Gig