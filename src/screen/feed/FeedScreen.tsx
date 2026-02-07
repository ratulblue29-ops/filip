import {
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createDrawerNavigator } from '@react-navigation/drawer';
import styles from './style';
import { Bookmark, Search } from 'lucide-react-native';
import MainDrawer from '../../components/feed/MainDrawer';
import Gig from '../../components/feed/Gig';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '../../services/user';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import NotificationDot from '../../components/feed/NotificationDot';

const COLORS = {
  secondaryText: '#9E9E9E',
  yellow: '#fcd303',
};
const Drawer = createDrawerNavigator();
const FeedContent = ({ navigation }: any) => {
  const GIGS_DATA = [
    {
      id: '1',
      title: 'Cataring Staff',
      company: 'Creative Event • 3.1 Mil',
      price: '€20/Hr',
      time: 'Sat, Oct 25 • 4pm Start',
      spots: '5 Spots Left',
      avatar: 'https://i.pravatar.cc/150?u=a',
    },
    {
      id: '2',
      title: 'House Staff',
      company: 'Burger Joint • 0.2 Mil',
      price: '€18/Hr',
      time: 'Today • 5 PM - 11 PM',
      tags: ['Dishwashing'],
      avatar: 'https://i.pravatar.cc/150?u=b',
    },
  ];
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
  });
  // notification get for dot
  const { hasUnread } = useUnreadNotifications();
  // get current time
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.topRow}
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.7}
        >
          <View>
            <Image
              source={{
                uri: user?.profile?.photo,
              }}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.nameText}>{user?.profile?.name}</Text>
          </View>
        </TouchableOpacity>
        {/* notification dot */}
        <NotificationDot hasUnread={hasUnread} />
      </View>
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search"
          placeholderTextColor={COLORS.secondaryText}
          style={styles.input}
        />
      </View>
      <FlatList
        data={GIGS_DATA}
        keyExtractor={item => item.id}
        ListHeaderComponent={<Gig />}
        renderItem={({ item: gig }) => (
          <View style={styles.gigCard}>
            <View style={styles.row}>
              <Image source={{ uri: gig.avatar }} style={styles.gigAvatar} />
              <View style={styles.gigInfo}>
                <View style={styles.rowBetween}>
                  <Text style={styles.gigTitle}>{gig.title}</Text>
                  <Bookmark width={24} height={24} color="#fff" />
                </View>
                <Text style={styles.locationText_gig}>{gig.company}</Text>
                <View style={styles.rowBetween}>
                  <View style={styles.priceChip}>
                    <Text style={styles.priceChipText}>{gig.price}</Text>
                  </View>
                  <Text style={styles.gigTime}>{gig.time}</Text>
                </View>
                {gig.tags && (
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{gig.tags[0]}</Text>
                  </View>
                )}
                {gig.spots && <Text style={styles.spotsText}>{gig.spots}</Text>}
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
      {/* </ScrollView> */}
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
        overlayColor: 'rgba(255, 255, 255, 0.3)',
        swipeEnabled: true,
        drawerStyle: styles.drawerStyle,
      }}
    >
      <Drawer.Screen name="FeedContent" component={FeedContent} />
    </Drawer.Navigator>
  );
};

export default FeedScreen;
