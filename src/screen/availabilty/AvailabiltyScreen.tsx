import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import Worker from '../../@types/Worker.type';
import { Bell, Search } from 'lucide-react-native';
import SparkleIcon from '../../components/svg/SparkelIcon';
import WorkerCard from '../../components/WorkerCard';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  secondaryText: '#9E9E9E',
};
const AvailabilityScreen = () => {
  const workers: Worker[] = [
    {
      id: '1',
      name: 'Alex',
      role: 'Server',
      rating: 4.9,
      reviews: 1501,
      price: '25',
      distance: '3.1',
      isVerified: true,
      isAvailable: true,
      bio: 'Experienced Fine Dining Server With 5+ Years In High-Volume Environments. Quick Learner And...',
      tags: ['Wine Knowledge', 'Pos System'],
      image: 'https://i.pravatar.cc/150?u=alex',
    },
    {
      id: '2',
      name: 'Mike T',
      role: 'Dishwasher',
      rating: 4.9,
      reviews: 1501,
      price: '35',
      distance: '4.1',
      isAvailable: true,
      bio: 'Hard Working And Reliable. Available For Late Shifts And Weekends. Fast In The Kitchen And Organized...',
      tags: ['Heavy Lifting', 'Sanitation'],
      image: 'https://i.pravatar.cc/150?u=mike',
    },
    {
      id: '3',
      name: 'Elena R',
      role: 'Bartender',
      rating: 4.9,
      reviews: 1501,
      price: '25',
      distance: '3.1',
      isAvailable: false,
      bio: 'Hard Working And Reliable. Available For Late Shifts And Weekends. Fast In The Kitchen And Organized...',
      tags: ['Heavy Lifting', 'Sanitation'],
      image: 'https://i.pravatar.cc/150?u=elena',
    },
  ];
  const navigator = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Find Workers</Text>
        <View>
          <Bell width={24} height={24} color="white" />
          <View style={styles.notifDot} />
        </View>
      </View>
  {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search width={24} height={24} color="white" />
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.secondaryText}
            style={styles.input}
          />
        </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filters */}
        <View style={styles.filterRow}>
          <TouchableOpacity style={[styles.chip, styles.activeChip]}>
            <Text style={styles.activeChipText}>Anytime</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chip}
          onPress={() => navigator.navigate('Seasonal')}>
            <Text style={styles.chipText}>Seasonal</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.resultsText}>32 Workers Found Nearby</Text>

        {/* Worker List */}
        {workers.map(item => (
          <WorkerCard key={item.id} worker={item} />
        ))}

        {/* Premium Banner */}
        <View style={styles.premiumBanner}>
          <View style={styles.premiumIconContainer}>
            <SparkleIcon width={24} height={24} />
          </View>
          <Text style={styles.premiumTitle}>Need Premium Staff?</Text>
          <Text style={styles.premiumSub}>
            Post A Verified Shift To Attract Our Highest-Rated Professionals
            Instantly
          </Text>
          <TouchableOpacity style={styles.premiumBtn} onPress={() => navigator.navigate('membership')}>
            <Text style={styles.filledBtnText}>Send Offers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AvailabilityScreen;
