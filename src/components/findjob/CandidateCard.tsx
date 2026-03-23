import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, SendHorizontal, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../screen/seasonAvailabilty/style';
import Worker from '../../@types/Worker.type';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { fetchWorkerActivePosts } from '../../services/engagement';
import ChooseAvailabilityModal from '../availiability/ChooseAvailabilityModal';

type CandidateCardProps = {
  candidate: Worker;
};

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const formatCustomDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Posts fetched on demand — cached per workerId, deduped across cards
  const {
    data: posts = [],
    isFetching: postsLoading,
    refetch: fetchPosts,
  } = useQuery({
    queryKey: ['workerActivePosts', candidate?.user?.id],
    queryFn: () => fetchWorkerActivePosts(candidate.user.id),
    enabled: false,
  });

  const handleEngage = async () => {
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
      workerId: candidate.user.id,
      selectedPost: post,
    });
  };

  const now = new Date();
  const start = candidate.dateRange?.start ? new Date(candidate.dateRange.start) : null;
  const end = candidate.dateRange?.end ? new Date(candidate.dateRange.end) : null;
  const isAvailableNow = start && end && now >= start && now <= end;
  const isStartsSoon = start && start > now;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: candidate?.bannerImage || 'n/a' }}
        style={styles.candidateImage}
      />

      <View
        style={[
          styles.statusBadge,
          isAvailableNow ? styles.statusYellow : styles.statusDark
        ]}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: isAvailableNow ? '#4ADE80' : '#F59E0B' }
          ]}
        />
        <Text style={styles.statusText}>
          {isAvailableNow ? 'Available Now' : isStartsSoon ? 'Starts Soon' : 'Ended'}
        </Text>
      </View>

      <View style={styles.profileRow}>
        <Image
          source={{
            uri:
              candidate.user.photo ||
              'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
          }}
          style={styles.avatarPlaceholder}
        />
        <View>
          <Text style={styles.candidateName}>{candidate?.user?.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#FFF" />
            <Text style={styles.locationText}>{candidate?.user?.city}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          {candidate.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.availabilityRow}>
          <Calendar size={24} color="#FFF" />
          <View>
            <Text style={styles.availabilityTitle}>
              {candidate?.title || ''}
            </Text>
            <Text style={styles.availabilityDates}>
              {formatCustomDate(candidate.dateRange?.start)} -{' '}
              {formatCustomDate(candidate.dateRange?.end)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.engageButton} onPress={handleEngage}>
          <Text style={styles.engageButtonText}>Engage Candidate</Text>
          <SendHorizontal width={18} height={18} color="#1F2937" />
        </TouchableOpacity>
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

export default CandidateCard;
