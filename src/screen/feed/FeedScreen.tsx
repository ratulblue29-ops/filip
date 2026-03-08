import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Search } from 'lucide-react-native';

import styles from './style';
import MainDrawer from '../../components/feed/MainDrawer';
import Gig from '../../components/feed/Gig';
import FeedCard from '../../components/feed/FeedCard';
import NotificationDot from '../../components/feed/NotificationDot';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import useRefresh from '../../hooks/useRefresh';
import { fetchCurrentUser } from '../../services/user';
import { searchJobs } from '../../services/jobs';
import { fetchWishlistIds } from '../../services/wishlist';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import ReviewModal from '../../components/engagement/ReviewModal';
import { getReviewEligibleEngagement } from '../../services/review';
import {
  fetchReceivedEngagements,
  fetchSentEngagements,
} from '../../services/engagement';
import { getAuth } from '@react-native-firebase/auth';

const COLORS = {
  secondaryText: '#9E9E9E',
};

const Drawer = createDrawerNavigator();

const FeedContent = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [reviewModal, setReviewModal] = useState<{
    engagementId: string;
    toUserId: string;
    toUserName: string;
    role: 'employer' | 'worker';
  } | null>(null);

  // just for testing rad1pick@gmail.com & red@gmail.com
  // const [reviewModal, setReviewModal] = useState<{
  //   engagementId: string;
  //   toUserId: string;
  //   toUserName: string;
  //   role: 'employer' | 'worker';
  // } | null>({
  //   engagementId: 't0GSOyoKkmZt1BYOs9o2',
  //   toUserId: 'rjGuO6eyqAOcyCXZTEmzyF96gZC3',
  //   toUserName: 'Worker',
  //   role: 'employer',
  // });

  /* ---------------- DEBOUNCE ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(searchText.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  /* ---------------- CURRENT USER ---------------- */
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });

  /* ---------------- WISHLIST ---------------- */
  const { data: wishlistIds = [] } = useQuery({
    queryKey: ['wishlistIds'],
    queryFn: fetchWishlistIds,
  });

  /* ---------------- SEARCH QUERY ---------------- */
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['searchJobs', debouncedText],
    queryFn: () => searchJobs(debouncedText),
    enabled: debouncedText.length > 2,
  });

  /* ---------------- REFRESH ---------------- */
  const queryClient = useQueryClient();
  const { refreshing, onRefresh } = useRefresh(() =>
    queryClient
      .invalidateQueries({ queryKey: ['currentUser'] })
      .then(() => queryClient.invalidateQueries({ queryKey: ['wishlistIds'] }))
      .then(() =>
        queryClient.invalidateQueries({ queryKey: ['recommendedJobs'] }),
      ),
  );

  /* ---------------- NOTIFICATIONS ---------------- */
  const { hasUnread } = useUnreadNotifications();

  const { data: receivedEngagements = [] } = useQuery({
    queryKey: ['receivedEngagements'],
    queryFn: fetchReceivedEngagements,
    enabled: true,
  });

  const { data: sentEngagements = [] } = useQuery({
    queryKey: ['sentEngagements'],
    queryFn: fetchSentEngagements,
    enabled: true,
  });

  useEffect(() => {
    const allEngagements = [...receivedEngagements, ...sentEngagements];
    if (allEngagements.length === 0) return;

    const currentUser = getAuth().currentUser;
    if (!currentUser) return;

    getReviewEligibleEngagement(allEngagements).then(result => {
      if (!result) return;
      const { engagement } = result;
      const isEmployer = engagement.fromUserId === currentUser.uid;

      setReviewModal({
        engagementId: engagement.id,
        toUserId: isEmployer ? engagement.workerId : engagement.fromUserId,
        toUserName: 'your colleague',
        role: isEmployer ? 'employer' : 'worker',
      });
    });
  }, [receivedEngagements, sentEngagements]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  /* ---------------- AVATAR ---------------- */
  const avatarSource =
    user?.profile?.photo && user.profile.photo.trim().length > 0
      ? { uri: user.profile.photo }
      : {
          uri: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
        };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ================= HEADER ================= */}
      <View style={[styles.header, { justifyContent: 'space-between' }]}>
        <TouchableOpacity
          style={styles.topRow}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <Image
            source={avatarSource}
            style={styles.avatar}
            resizeMode="cover"
          />

          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.nameText}>{user?.profile?.name || 'User'}</Text>
          </View>
        </TouchableOpacity>

        <NotificationDot hasUnread={hasUnread} />
      </View>

      {/* ================= SEARCH ================= */}
      <View style={styles.searchContainer}>
        <Search width={20} height={20} color="white" />
        <TextInput
          placeholder="Search availability…"
          placeholderTextColor={COLORS.secondaryText}
          style={styles.input}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* ================= CONTENT ================= */}

      {searchText.length > 0 && debouncedText.length < 3 ? (
        <View style={styles.noResultContainer}>
          <Text style={styles.noResultText}>Type at least 3 characters</Text>
        </View>
      ) : debouncedText.length > 2 ? (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <FeedCard item={item} wishlistIds={wishlistIds} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            !searchLoading ? (
              <View style={styles.noResultContainer}>
                <Text style={styles.noResultText}>No results found</Text>
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFD900"
            />
          }
        />
      ) : (
        <Gig refreshing={refreshing} onRefresh={onRefresh} />
      )}
      {reviewModal && (
        <ReviewModal
          visible={!!reviewModal}
          onClose={() => setReviewModal(null)}
          engagementId={reviewModal.engagementId}
          toUserId={reviewModal.toUserId}
          toUserName={reviewModal.toUserName}
          role={reviewModal.role}
        />
      )}
    </SafeAreaView>
  );
};

const FeedScreen = () => {
  return (
    <Drawer.Navigator
      drawerContent={() => <MainDrawer />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'front',
        overlayColor: 'rgba(255,255,255,0.3)',
        swipeEnabled: true,
        drawerStyle: styles.drawerStyle,
      }}
    >
      <Drawer.Screen name="FeedContent" component={FeedContent} />
    </Drawer.Navigator>
  );
};

export default FeedScreen;
