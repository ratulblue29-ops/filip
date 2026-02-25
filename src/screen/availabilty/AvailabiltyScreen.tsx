import React from 'react';
import { FlatList, StatusBar, RefreshControl } from 'react-native';
import useRefresh from '../../hooks/useRefresh';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './style';
import WorkerCard from '../../components/WorkerCard';
import { useNavigation } from '@react-navigation/native';
import AvailabilityHeader from '../../components/findjob/AvailabilityHeader';
import AvailabilityFilters from '../../components/findjob/AvailabilityFilters';
import PremiumBanner from '../../components/findjob/PremiumBanner';
import { useQuery } from '@tanstack/react-query';
import { fetchFullTimeJobs } from '../../services/jobs';
import Worker from '../../@types/Worker.type';

const AvailabilityScreen = () => {
  const navigation = useNavigation<any>();
  const {
    data: workers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['fulltime'],
    queryFn: fetchFullTimeJobs,
  });
  const { refreshing, onRefresh } = useRefresh(refetch);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AvailabilityHeader />
      <FlatList
        data={isLoading ? Array(5).fill({}) : workers}
        keyExtractor={(item, index) => (item.id ? item.id : index.toString())}
        renderItem={({ item }) => (
          <WorkerCard worker={item as Worker} isLoading={isLoading} />
        )}
        ListHeaderComponent={
          <AvailabilityFilters
            onSeasonal={() => navigation.navigate('Seasonal')}
            onDaily={() => navigation.navigate('Daily')}
          />
        }
        ListFooterComponent={
          <PremiumBanner
            onPress={() =>
              navigation.navigate('SendOffer', {
                workerId: '',
                selectedPost: null,
              })
            }
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          // 👈 add this
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

export default AvailabilityScreen;
