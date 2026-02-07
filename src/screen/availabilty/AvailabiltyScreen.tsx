import React from 'react';
import { FlatList, StatusBar } from 'react-native';
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
  const { data: workers = [], isLoading } = useQuery({
    queryKey: ['fulltime'],
    queryFn: fetchFullTimeJobs,
  });
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AvailabilityHeader />
      <FlatList
        data={isLoading ? Array(5).fill({}) : workers} 
        keyExtractor={(item, index) => (item.id ? item.id : index.toString())}
        renderItem={({ item }) => (
          <WorkerCard
            worker={item as Worker}
            isLoading={isLoading}
            onPress={() => navigation.navigate('sendoffer')}
          />
        )}
        ListHeaderComponent={
          <AvailabilityFilters
            onSeasonal={() => navigation.navigate('Seasonal')}
          />
        }
        ListFooterComponent={
          <PremiumBanner onPress={() => navigation.navigate('sendoffer')} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      />
    </SafeAreaView>
  );
};

export default AvailabilityScreen;
