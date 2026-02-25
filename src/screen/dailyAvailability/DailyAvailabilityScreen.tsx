import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import useRefresh from '../../hooks/useRefresh';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import NotificationDot from '../../components/feed/NotificationDot';
import DailyCard from '../../components/findjob/DailyCard';
import { fetchDailyJobs } from '../../services/jobs';
import { styles } from './style';
import CandidateCardSkeleton from '../../components/skeleton/CandidateCardSkeleton';

const DailyAvailabilityScreen = () => {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const { hasUnread } = useUnreadNotifications();

  const {
    data: jobs = [],
    isPending,
    refetch,
  } = useQuery({
    queryKey: ['dailyJobs'],
    queryFn: fetchDailyJobs,
  });

  const { refreshing, onRefresh } = useRefresh(refetch);

  const filtered = useMemo(() => {
    if (!search.trim()) return jobs;
    const lower = search.toLowerCase();
    return jobs.filter(
      (j: any) =>
        j.targetPosition?.toLowerCase().includes(lower) ||
        j.user?.name?.toLowerCase().includes(lower) ||
        j.location?.some((l: string) => l.toLowerCase().includes(lower)),
    );
  }, [jobs, search]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft width={22} height={22} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Talent</Text>
        <NotificationDot hasUnread={hasUnread} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search width={24} height={24} color="white" />
        <TextInput
          placeholder="Search by position, name, city..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={isPending ? Array(4).fill({}) : filtered}
        keyExtractor={(item, index) => (isPending ? index.toString() : item.id)}
        renderItem={({ item }) =>
          isPending ? <CandidateCardSkeleton /> : <DailyCard item={item} />
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFD900"
          />
        }
      />
    </SafeAreaView>
  );
};

export default DailyAvailabilityScreen;
