import { View, Text, Image } from 'react-native';
import React from 'react';
import styles from '../../screen/profile/viewProfileStyle';
import { ReviewProps } from '../../@types/Review.type';
import StarIcon from '../svg/StarIcon';

const ReviewCard = ({ name, role, time, text, rating, photo }: ReviewProps) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Image
        source={
          photo
            ? { uri: photo }
            : require('../../../assets/images/defaultProfile.png')
        }
        style={styles.avatarPlaceholder}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.reviewTitle}>{name}</Text>
        <Text style={styles.reviewSubtext}>
          {role} • {time}
        </Text>
      </View>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingText}>{rating}</Text>
        <StarIcon width={14} height={14} color="#FFD900" />
      </View>
    </View>
    <Text style={styles.reviewBody}>"{text}"</Text>
  </View>
);

export default ReviewCard;
