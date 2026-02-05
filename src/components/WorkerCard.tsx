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
  console.log('kormocari', worker);
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.profileInfo}>
          <View>
            <Image source={{ uri: worker.user?.photo }} style={styles.avatar} />
            {worker.user.verified && (
              <View style={styles.verifiedBadge}>
                <Check width={16} height={16} color="white" />
              </View>
            )}
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.workerName}>{worker?.user?.name}</Text>
            <View style={styles.workerRoleWrapper}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleText}>
                  {worker.location?.[0] ?? '—'}
                </Text>
              </View>
              <View style={styles.ratingRow}>
                <Dot color="#FCD34D" />
                <Text style={styles.ratingVal}>{worker.user?.rating}</Text>
                <StarIcon width={16} height={16} color="#FCD34D" />
                <Text style={styles.reviewCount}>
                  ({worker.user?.reviewsCount})
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.priceText}>
            €{worker?.rate?.amount}
            <Text style={styles.hrText}> {worker?.rate?.unit}</Text>
          </Text>
          <Text style={styles.distanceText}>{worker.distance} Mi Away</Text>
          {!worker.user?.opentowork === true && (
            <View style={styles.busyTag}>
              <Text style={styles.busyText}>Busy</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.bioText} numberOfLines={2}>
        {worker.description}
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
        {worker?.user?.opentowork === true ? (
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
