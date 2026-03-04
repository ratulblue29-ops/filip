import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  MapPin,
  CalendarCheck2,
  MessageCircleMore,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './viewProfileStyle';
import ReviewCard from '../../components/profile/ReviewCard';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getUserById, fetchCurrentUser } from '../../services/user';
import ProfileHead from './ProfileHead';
import { UserType } from '../../@types/ViewProfile.type';
import Toast from 'react-native-toast-message';
import { fetchWorkerActivePosts } from '../../services/engagement';
import ChooseAvailabilityModal from '../../components/availiability/ChooseAvailabilityModal';
import { checkChatAccess, createOrGetChat } from '../../services/chat';
import ChatAccessModal from '../../components/message/ChatAccessModal';
import { fetchUserReviews } from '../../services/review';
import { ReviewItem } from '../../@types/Review.type';
import { timeAgo } from '../../helper/timeAgo';

type RootStackParamList = { viewProfile: { userId: string } };
type ViewProfileRouteProp = RouteProp<RootStackParamList, 'viewProfile'>;

const ViewProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ViewProfileRouteProp>();
  const { userId } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [accessModalVisible, setAccessModalVisible] = useState(false);

  /* ── Target user profile ── */
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<UserType>({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  /* ── Current user (for membership tier check) ── */
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  /* ── Worker active posts — fetched on demand, cached per userId ── */
  const {
    data: posts = [],
    isFetching: postsLoading,
    refetch: fetchPosts,
  } = useQuery({
    queryKey: ['workerActivePosts', userId],
    queryFn: () => fetchWorkerActivePosts(userId),
    enabled: false,
  });

  const { data: reviews = [] } = useQuery<ReviewItem[]>({
    queryKey: ['userReviews', userId],
    queryFn: () => fetchUserReviews(userId),
    enabled: !!userId,
  });

  /* ── Chat gate ── */
  const handleChat = async () => {
    try {
      const tier = currentUser?.membership?.tier ?? 'free';
      const hasAccess = await checkChatAccess(userId, tier);
      if (!hasAccess) {
        setAccessModalVisible(true);
        return;
      }
      const chatId = await createOrGetChat(userId);
      navigation.navigate('ChatDetailScreen', { chatId, otherUserId: userId });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
    }
  };

  /* ── Engagement: open modal then fetch posts ── */
  const handleSendEngagement = async () => {
    setModalVisible(true);
    try {
      await fetchPosts();
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: err.message });
      setModalVisible(false);
    }
  };

  const handleSelectPost = (post: any) => {
    setModalVisible(false);
    navigation.navigate('SendOffer', {
      workerId: userId,
      selectedPost: post,
    });
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View />
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#FFD900" />
          <Text style={{ marginTop: 10, color: '#fff' }}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* ── Error ── */
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <X size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View />
        </View>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: 'red', fontSize: 16 }}>
            {(error as Error)?.message || 'Something went wrong'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff' }}>No user data found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHead photo={user.profile.photo} />

        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.box}>{user.profile.name}</Text>

        <Text style={styles.label}>City</Text>
        <View style={styles.inputWithIcon}>
          <MapPin size={24} color="#fff" />
          <Text style={styles.flexInput}>{user.profile.city ?? 'N/A'}</Text>
        </View>

        <Text style={styles.label}>Short Bio / CV</Text>
        <Text style={[styles.box, styles.bioText]}>
          {user.profile.aboutMe ?? 'No bio available'}
        </Text>

        <Text style={styles.label}>Professional Roles</Text>
        <View style={styles.rolesContainer}>
          <View style={styles.tagsWrapper}>
            {user.profile.skills.length > 0 ? (
              user.profile.skills.map((role, i) => (
                <View key={`${role}-${i}`} style={styles.tag}>
                  <Text style={styles.tagText}>{role}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: '#aaa' }}>No roles found</Text>
            )}
          </View>
        </View>

        <Text style={styles.label}>Reviews</Text>
        {reviews.length === 0 ? (
          <Text
            style={{
              color: '#555',
              marginTop: 12,
              fontFamily: 'InterDisplayRegular',
            }}
          >
            No reviews yet
          </Text>
        ) : (
          reviews.map(review => (
            <ReviewCard
              key={review.id}
              name={review.fromUserName ?? 'Anonymous'}
              role={review.fromUserRole ?? ''}
              time={timeAgo(review.createdAt)}
              rating={String(review.rating)}
              text={review.text}
              photo={review.fromUserPhoto}
            />
          ))
        )}
      </ScrollView>

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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <MessageCircleMore size={20} color="#FFD900" strokeWidth={2.5} />
          <Text style={styles.chatButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleSendEngagement}
        >
          <CalendarCheck2 size={20} color="#000" strokeWidth={2.5} />
          <Text style={styles.mainButtonText}>Send Engagement</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ViewProfileScreen;
