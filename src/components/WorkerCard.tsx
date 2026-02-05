import { Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import styles from '../screen/availabilty/style';
import { Check, Dot } from 'lucide-react-native';
import Worker from '../@types/Worker.type';
import StarIcon from './svg/StarIcon';
import { useNavigation } from '@react-navigation/native';

const WorkerCard = ({
  worker,
  onPress,
}: {
  worker: Worker;
  onPress: () => void;
}) => {
  const navigation = useNavigation<any>();
  console.log(worker)
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.profileInfo}>
          <View>
            <Image source={{ uri: worker.image }} style={styles.avatar} />
            {worker.isVerified && (
              <View style={styles.verifiedBadge}>
                <Check width={16} height={16} color="white" />
              </View>
            )}
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.workerName}>{worker.name}</Text>
            <View style={styles.workerRoleWrapper}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>{worker.role}</Text>
              </View>
              <View style={styles.ratingRow}>
                <Dot color="#FCD34D" />
                <Text style={styles.ratingVal}>{worker.rating}</Text>
                <StarIcon width={16} height={16} color="#FCD34D" />
                <Text style={styles.reviewCount}>({worker.reviews})</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceText}>
            €{worker?.price}
            <Text style={styles.hrText}>/hr</Text>
          </Text>
          <Text style={styles.distanceText}>{worker.distance} Mi Away</Text>
          {!worker.isAvailable && (
            <View style={styles.busyTag}>
              <Text style={styles.busyText}>Busy</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.bioText} numberOfLines={2}>
        {worker.bio}
      </Text>

      <View style={styles.tagRow}>
        {worker.tags?.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.line} />

      <View style={styles.actionRow}>
        {worker?.isAvailable ? (
          <>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() =>
                navigation.navigate('viewprofile', {
                  workerId: worker.id,
                })
              }
            >
              <Text style={styles.outlineBtnText}>View Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filledBtn} onPress={onPress}>
              <Text style={styles.filledBtnText}>Send Offer</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.disabledBtn} disabled>
            <Text style={styles.disabledBtnText}>Currently Unavailable</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default WorkerCard;
