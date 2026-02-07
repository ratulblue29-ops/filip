import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import { BadgeCheck, Clock, Heart } from 'lucide-react-native';
import styles from '../../screen/feed/style';
import { useNavigation } from '@react-navigation/native';
import { Feedtype } from '../../@types/Feed.type';

const FeedCard = ({ item }: { item: Feedtype }) => {
  const navigation = useNavigation<any>();
  const [liked, setLiked] = useState<boolean>(false);
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };
  return (
    <View key={item.id} style={styles.recCard}>
      <ImageBackground
        source={{ uri: item?.bannerImage || 'n/a' }}
        style={styles.cardImage}
      >
        <View style={styles.MainbadgeContainer}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>• {item.type}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setLiked(!liked)}
            style={[styles.heartWrapper]}
          >
            <Heart
              height={24}
              width={24}
              color={liked ? '#FF3B30' : 'white'}
              fill={liked ? '#FF3B30' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.profileRow}>
          <View style={styles.avatarCircle}>
            <Image
              style={styles.avatarPlaceholder}
              source={{
                uri: item?.user?.photo || 'n/a',
              }}
            />
          </View>
          <View>
            <Text style={styles.profileName}>
              {item?.user?.name || 'Unknown'}
            </Text>
            {item?.user?.verified === true && (
              <View style={styles.verifiedContainer}>
                <BadgeCheck width={16} height={16} color="#FFD900" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>

      <View style={styles.cardInfo}>
        <View style={styles.rowBetween}>
          <Text style={styles.roleTitle}>{item?.title}</Text>
          <Text style={styles.rateText}>
            €{item.rate?.amount}
            <Text style={styles.perHr}>/{item?.rate?.unit}</Text>
          </Text>
        </View>
        <Text style={styles.locationText}>{item.location}</Text>

        <View style={styles.availabilityBox}>
          <Clock width={24} height={24} color="#FFD900" />
          <View>
            <Text style={styles.availLabel}>
              {item.subAvailability ? 'Availability' : 'Next Available'}
            </Text>
            <Text style={styles.availValue}>
              {item?.schedule?.start && item?.schedule?.end
                ? `${formatDate(item.schedule.start)} - ${formatDate(
                    item.schedule.end,
                  )}`
                : 'Date not available'}
            </Text>
            {item.subAvailability && (
              <Text style={styles.availSub}>{item.subAvailability}</Text>
            )}
          </View>
        </View>

        <View style={styles.tagRow}>
          {Array.isArray(item?.requiredSkills) &&
            item.requiredSkills.map((skill: string, idx: number) => (
              <View key={`${skill}-${idx}`} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
              </View>
            ))}
        </View>

        <TouchableOpacity
          style={styles.viewProfileBtn}
          onPress={() => navigation.navigate('viewprofile')}
        >
          <Text style={styles.viewProfileText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedCard;
