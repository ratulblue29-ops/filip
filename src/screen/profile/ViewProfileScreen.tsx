import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { X, MapPin, CalendarCheck2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './viewProfileStyle';
import ReviewCard from '../../components/profile/ReviewCard';
// import ProfileHead from "./ProfileHead";
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../services/user';
import ProfileHead from './ProfileHead';
import { UserType } from '../../@types/ViewProfile.type';
import Toast from 'react-native-toast-message';
import { useState } from 'react';
import { fetchWorkerActivePosts } from '../../services/engagement';
import ChooseAvailabilityModal from '../../components/availiability/ChooseAvailabilityModal';

// interface Day {
//     day: string;
//     date: string;
//     active: boolean;
//     hasDot?: boolean;
// }

type RootStackParamList = {
  viewProfile: { userId: string };
};
type ViewProfileRouteProp = RouteProp<RootStackParamList, 'viewProfile'>;

const ViewProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<ViewProfileRouteProp>();

  const { userId } = route.params;

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
  console.log('user get', user);

  // const dates: Day[] = [
  //     { day: "Sat", date: "12", active: true, hasDot: true },
  //     { day: "Sun", date: "13", active: false },
  //     { day: "Mon", date: "14", active: false, hasDot: true },
  //     { day: "Tue", date: "15", active: false },
  //     { day: "Wed", date: "16", active: false, hasDot: true },
  //     { day: "Thu", date: "17", active: true, hasDot: true },
  //     { day: "Fri", date: "18", active: true, hasDot: true },
  // ];

  //   const handleSendEngagement = () => {
  //     const message = 'Engagement request sent successfully.';

  //     if (Platform.OS === 'android') {
  //       ToastAndroid.showWithGravity(
  //         message,
  //         ToastAndroid.SHORT,
  //         ToastAndroid.BOTTOM,
  //       );
  //     } else {
  //       Alert.alert('Success', message);
  //     }

  //     navigation.goBack();
  //   };

  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const handleSendEngagement = async () => {
    try {
      setPostsLoading(true);
      setModalVisible(true);
      const activePosts = await fetchWorkerActivePosts(user?.id || '');
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
      workerId: user?.id || '',
      selectedPost: post,
    });
  };

  // Loading UI
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

  // Error UI
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

  // safety fallback
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: '#fff' }}>No user data found.</Text>
      </SafeAreaView>
    );
  }

  // const roles: string[] = user.roles ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
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
        {/* Profile Section */}
        <ProfileHead photo={user.profile.photo} />

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.box}>{user.profile.name}</Text>

        {/* City + Age */}
        <View>
          <Text style={styles.label}>City</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={24} color="#fff" />
            <Text style={styles.flexInput}>{user.profile.city ?? 'N/A'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          {/* <View>
                        <Text style={styles.label}>City</Text>
                        <View style={styles.inputWithIcon}>
                            <MapPin size={24} color="#fff" />
                            <Text style={styles.flexInput}>{user.profile.city ?? "N/A"}</Text>
                        </View>
                    </View> */}

          {/* <View style={styles.age}>
                        <Text style={styles.label}>Age</Text>
                        <Text style={[styles.box, styles.agetext]}>
                            {user.age ?? "N/A"}
                        </Text>
                    </View> */}
        </View>

        {/* Bio */}
        <Text style={styles.label}>Short Bio / CV</Text>
        <Text style={[styles.box, styles.bioText]}>
          {user.profile.aboutMe ?? 'No bio available'}
        </Text>

        {/* Roles */}
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

        {/* Availability */}
        {/* <Text style={styles.label}>This Week</Text>
                <View style={styles.daysRow}>
                    {dates.map((item, i) => (
                        <View key={i} style={styles.dayContainer}>
                            <Text style={styles.dayLabelText}>{item.day}</Text>

                            <View
                                style={[
                                    styles.dateCircle,
                                    item.active && styles.activeDateCircle,
                                ]}
                            >
                                <Text
                                    style={[styles.dateText, item.active && styles.activeDateText]}
                                >
                                    {item.date}
                                </Text>
                            </View>

                            {item.hasDot && (
                                <View style={[styles.dot, { backgroundColor: "#FFD900" }]} />
                            )}
                        </View>
                    ))}
                </View> */}

        {/* Reviews */}
        <Text style={styles.label}>Reviews</Text>

        <ReviewCard
          name="The Grand Hotel"
          role="Event Server"
          time="2d ago"
          rating="5.0"
          text="Alex was fantastic! Showed up early and handled the rush perfectly. Highly recommended."
        />
        <ReviewCard
          name="The Grand Hotel"
          role="Event Server"
          time="2d ago"
          rating="5.0"
          text="Great energy and very skilled with cocktails. Good vibes only."
        />
      </ScrollView>

      <ChooseAvailabilityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        posts={posts}
        loading={postsLoading}
        onSelect={handleSelectPost}
      />

      {/* Footer */}
      <View style={styles.footer}>
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
