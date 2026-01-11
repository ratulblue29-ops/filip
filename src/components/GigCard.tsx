import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles/GigCardStyles';
import type {NewestGig} from '../data/dummyData';

interface GigCardProps {
  gig: NewestGig;
}

const GigCard = ({gig}: GigCardProps): React.JSX.Element => {
  const [isBookmarked, setIsBookmarked] = useState(gig.bookmarked);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCardPress = () => {
    console.log('Gig pressed:', gig.id);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleCardPress}
      activeOpacity={0.7}>
      <Image source={gig.user.avatar} style={styles.avatar} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.leftContent}>
            <Text style={styles.title}>{gig.title}</Text>
            <View style={styles.companyRow}>
              <Text style={styles.company}>{gig.company}</Text>
              <Text style={styles.separator}> • </Text>
              <Text style={styles.distance}>{gig.distance}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={handleBookmark}
            activeOpacity={0.7}>
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? '#ffffff' : '#fff'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.middleRow}>
          <View style={styles.rateBox}>
            <Text style={styles.rateText}>{gig.rate}</Text>
          </View>
          <View style={styles.dateTimeColumn}>
            <Text style={styles.dateText}>
              {gig.date} {gig.time && `• ${gig.time}`}
            </Text>
            {gig.duration && (
              <Text style={styles.durationText}>{gig.duration}</Text>
            )}
          </View>
        </View>

<View style={styles.bottomRow}>
  {gig.tags.length > 0 && (
    <View style={styles.tagsContainer}>
      {gig.tags.map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  )}
  {gig.spotsLeft && (
    <Text style={styles.spotsLeft}>{gig.spotsLeft}</Text>
  )}
</View>
      </View>
    </TouchableOpacity>
  );
};

export default GigCard;