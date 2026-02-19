import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, Lock, SendHorizontal, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../screen/seasonAvailabilty/style';
import Worker from '../../@types/Worker.type';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../../services/user';
import Toast from 'react-native-toast-message';
import { fetchWorkerActivePosts } from '../../services/engagement';
import ChooseAvailabilityModal from '../availiability/ChooseAvailabilityModal';
import { checkChatAccess } from '../../services/chat';
import ChatAccessModal from '../message/ChatAccessModal';

interface CandidateCardProps {
  candidate: Worker;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const navigation = useNavigation<any>();

  const formatCustomDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  const isPremium = user?.membership?.tier === 'premium';

  // const handleEngage = async () => {
  //   try {
  //     // ✅ Create job context from candidate data
  //     const jobContext = {
  //       jobId: candidate.id,
  //       title: candidate.title || 'Seasonal Job',
  //       type: 'seasonal' as const,
  //       rate: candidate.rate,
  //       location: candidate.location,
  //       schedule: {
  //         start: candidate.dateRange?.start || '',
  //         end: candidate.dateRange?.end || '',
  //       },
  //     };

  //     // ✅ Pass job context when creating chat
  //     const chatId = await createOrGetChat(candidate.user.id, jobContext);

  //     // ✅ Navigate to ChatScreen first, with chatId param
  //     navigation.navigate('chat', {
  //       autoChatId: chatId,
  //       autoUserId: candidate.user.id,
  //     });
  //   } catch (error: any) {
  //     Toast.show({
  //       type: 'error',
  //       text1: 'Error',
  //       text2: error.message || 'Failed to start chat',
  //     });
  //   }
  // };
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [accessModalVisible, setAccessModalVisible] = useState(false);

  const handleEngage = async () => {
    try {
      // Gate check: premium OR accepted engagement
      const membershipTier = user?.membership?.tier ?? 'free';
      const hasAccess = await checkChatAccess(
        candidate.user.id,
        membershipTier,
      );

      if (!hasAccess) {
        setAccessModalVisible(true);
        return;
      }

      setPostsLoading(true);
      setModalVisible(true);
      const activePosts = await fetchWorkerActivePosts(candidate.user.id);
      setPosts(activePosts);
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
      setModalVisible(false);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleSelectPost = (post: any) => {
    setModalVisible(false);
    navigation.navigate('SendOffer', {
      workerId: candidate.user.id,
      selectedPost: post,
    });
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: candidate?.bannerImage || 'n/a' }}
        style={styles.candidateImage}
      />

      <View
        style={[
          styles.statusBadge,
          candidate.status === 'Available'
            ? styles.statusYellow
            : styles.statusDark,
        ]}
      >
        <View
          style={[
            styles.dot,
            {
              backgroundColor: candidate?.isAvailable ? '#4ADE80' : '#F59E0B',
            },
          ]}
        />
        <Text style={styles.statusText}>
          {candidate?.isAvailable ? 'Available' : 'Starts Soon'}
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
      <ChatAccessModal
        visible={accessModalVisible}
        onClose={() => setAccessModalVisible(false)}
      />
    </View>
  );
};

export default CandidateCard;
