import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleSlash,
  CalendarRange,
  BriefcaseBusiness,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import styles from './style';
import { fetchMyJobs } from '../../services/jobs';
import { formatSchedule, timeAgo } from '../../helper/timeanddateHelper';
import AvailabilitySkeleton from '../../components/skeleton/AvailabilitySkeleton';
import PostTypeModal from '../../components/availiability/PostTypeModal';
import { Mypost } from '../../@types/Mypost.type';

const PostedAvailabilitiesScreen = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'past'>('all');
  const [showPostTypeModal, setShowPostTypeModal] = useState<boolean>(false);

  // Queries
  const { data: availabilities = [], isLoading } = useQuery<Mypost[]>({
    queryKey: ['my-jobs'],
    queryFn: fetchMyJobs,
  });

  const handleGoBack = () => navigation.goBack();
  const handleAddNew = () => setShowPostTypeModal(true);

  // Status styles
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return styles.statusActive;
      case 'consumed':
        return styles.statusConsumed;
      case 'withdrawn':
        return styles.statusWithdrawn;
      case 'expired':
        return styles.statusExpired;
      default:
        return styles.statusActive;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'consumed':
        return 'Consumed';
      case 'withdrawn':
        return 'Withdrawn';
      case 'expired':
        return 'Expired';
      default:
        return 'Active';
    }
  };
  // Filter availabilities based on activeTab
  const filteredAvailabilities = availabilities.filter((item: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return item.status === 'active';
    if (activeTab === 'past')
      return ['consumed', 'withdrawn', 'expired'].includes(item.status);
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>My Posted Availabilities</Text>
        <View>
          <Bell width={24} height={24} color="white" />
          <View style={styles.notifDot} />
        </View>
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        {['all', 'active', 'past'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as 'all' | 'active' | 'past')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* LIST */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isLoading && <AvailabilitySkeleton />}

        {!isLoading && filteredAvailabilities.length === 0 ? (
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>
              No availabilities found.
            </Text>
          </View>
        ) : (
          filteredAvailabilities.map((item: Mypost) => (
            <TouchableOpacity key={item.id} style={styles.availabilityCard}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  {item?.type === 'fulltime' ? (
                    <CalendarRange size={24} color="#1F2937" />
                  ) : item?.type === 'seasonal' ? (
                    <BriefcaseBusiness size={24} color="#1F2937" />
                  ) : (
                    <CircleSlash size={24} color="#1F2937" />
                  )}
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.availabilityTitle}>{item.title}</Text>
                  {item.type === 'seasonal' && (
                    <Text style={styles.scheduleText}>
                      {item.schedule?.start && item.schedule?.end
                        ? formatSchedule(item.schedule.start, item.schedule.end)
                        : 'N/A'}
                    </Text>
                  )}
                  <View style={styles.bottomRow}>
                    <View style={getStatusStyle(item.status)}>
                      <Text style={styles.statusText}>
                        {getStatusText(item.status)}
                      </Text>
                    </View>
                    <Text style={styles.postedTime}>
                      Posted{' '}
                      {item.createdAt
                        ? timeAgo(new Date(item.createdAt))
                        : 'N/A'}
                    </Text>
                  </View>
                </View>
                <ChevronRight width={24} height={24} color="#ffffff" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Text style={styles.addButtonText}>+ Post New</Text>
      </TouchableOpacity>

      {/* modal */}
      <PostTypeModal
        visible={showPostTypeModal}
        onClose={() => setShowPostTypeModal(false)}
        onSelectFullTime={() => {
          setShowPostTypeModal(false);
          navigation.navigate('FullTimeAvailabilityCreation');
        }}
        onSelectSeasonal={() => {
          setShowPostTypeModal(false);
          navigation.navigate('SeosonalAvailabilityCreation');
        }}
      />
    </SafeAreaView>
  );
};

export default PostedAvailabilitiesScreen;
