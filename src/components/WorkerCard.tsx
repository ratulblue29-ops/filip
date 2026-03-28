import { Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import styles from '../screen/availabilty/style';
import { Check, Dot } from 'lucide-react-native';
import Worker from '../@types/Worker.type';
import StarIcon from './svg/StarIcon';
import { useNavigation } from '@react-navigation/native';
import WorkerCardSkeleton from './skeleton/WorkerCardSkeleton';
import { fetchWorkerActivePosts } from '../services/engagement';
import ChooseAvailabilityModal from './availiability/ChooseAvailabilityModal';
import Toast from 'react-native-toast-message';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const WorkerCard = ({
  isLoading,
  worker,
}: {
  isLoading: boolean;
  worker: Worker;
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  // Prefetch worker posts only when modal opens — avoids waterfall on list render
  const {
    data: posts = [],
    isFetching: postsLoading,
    refetch: fetchPosts,
  } = useQuery({
    queryKey: ['workerActivePosts', worker?.user?.id],
    queryFn: () => fetchWorkerActivePosts(worker.user.id),
    enabled: false, // manual trigger only
  });

  if (isLoading) return <WorkerCardSkeleton />;

  const handleSendOffer = async () => {
    setModalVisible(true);
    try {
      await fetchPosts();
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      setModalVisible(false);
    }
  };

  const handleSelectPost = (post: any) => {
    setModalVisible(false);
    navigation.navigate('SendOffer', {
      workerId: worker.user.id,
      selectedPost: post,
    });
  };

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
          <Text style={styles.distanceText}>{worker.distance} {t('worker_card.mi_away')}</Text>
          {!worker.user?.opentowork === true && (
            <View style={styles.busyTag}>
              <Text style={styles.busyText}>{t('worker_card.busy')}</Text>
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
                navigation.navigate('viewProfile', { userId: worker.user.id })
              }
            >
              <Text style={styles.outlineBtnText}>{t('common.view_profile')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filledBtn}
              onPress={handleSendOffer}
            >
              <Text style={styles.filledBtnText}>{t('worker_card.send_offer')}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.disabledBtn} disabled>
            <Text style={styles.disabledBtnText}>{t('worker_card.unavailable')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ChooseAvailabilityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        posts={posts}
        loading={postsLoading}
        onSelect={handleSelectPost}
      />
    </View>
  );
};

export default WorkerCard;
