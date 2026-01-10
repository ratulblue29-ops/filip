import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles/RecommendedCardStyles';
import type {RecommendedGig} from '../data/dummyData';

interface RecommendedCardProps {
  gig: RecommendedGig;
}

const RecommendedCard = ({gig}: RecommendedCardProps): React.JSX.Element => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleViewProfile = () => {
    console.log('View Profile:', gig.id);
  };

  return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={gig.image} style={styles.image} />
  
          <View style={styles.userRow}>
            <Image source={gig.user.avatar} style={styles.avatar} />
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{gig.user.name}</Text>
                {gig.user.verified && (
                  <Icon name="checkmark-circle" size={16} color="#FFD700" />
                )}
              </View>
            </View>
          </View>

          <View style={styles.topRow}>
            {gig.featured && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Starts In 2 Hours</Text>
              </View>
            )}
            {gig.seasonal && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Seasonal</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleFavorite}
              activeOpacity={0.7}>
              <Icon
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? '#ff3b30' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContent}>
          <View style={styles.titleRow}>
            <View style={styles.titleColumn}>
              <Text style={styles.title}>{gig.title}</Text>
              <View style={styles.locationRow}>
                <Text style={styles.location}>
                  {gig.location} • {gig.distance}
                </Text>
              </View>
            </View>
            <Text style={styles.rate}>
              {gig.currency}
              {gig.rate}
              <Text style={styles.rateUnit}>/hr</Text>
            </Text>
          </View>

        <View style={styles.availableBox}>
          <Icon name="time-outline" size={24} color="#FFD700" />
          <View style={styles.availableContent}>
            <Text style={styles.availableLabel}>Available</Text>
            <Text style={styles.date}>{gig.date}</Text>
            {gig.duration && (
              <Text style={styles.duration}>{gig.duration}</Text>
            )}
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {gig.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.viewProfileButton}
          onPress={handleViewProfile}
          activeOpacity={0.8}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecommendedCard;