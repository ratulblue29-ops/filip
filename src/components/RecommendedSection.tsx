import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import RecommendedCard from './RecommendedCard';
import {styles} from '../styles/RecommendedSectionStyles';
import {recommendedGigs} from '../data/dummyData';
import type {RecommendedGig} from '../data/dummyData';

const RecommendedSection = (): React.JSX.Element => {
  const handleSeeAll = () => {
    console.log('See All pressed');
  };

  const renderItem = ({item}: {item: RecommendedGig}) => (
    <RecommendedCard gig={item} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended For You</Text>
        <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recommendedGigs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default RecommendedSection;