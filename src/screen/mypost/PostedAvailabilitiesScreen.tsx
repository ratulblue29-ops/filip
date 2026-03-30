import React, { useState, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  CircleSlash,
  CalendarRange,
  BriefcaseBusiness,
  Sun,
  MoreVertical,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styles from './style';
import { fetchMyJobs, closeJob } from '../../services/jobs';
import { formatSchedule, timeAgo } from '../../helper/timeanddateHelper';
import AvailabilitySkeleton from '../../components/skeleton/AvailabilitySkeleton';
import PostTypeModal from '../../components/availiability/PostTypeModal';
import { Mypost } from '../../@types/Mypost.type';
import NotificationDot from '../../components/feed/NotificationDot';
import { useUnreadNotifications } from '../../hooks/useUnreadNotifications';
import AvailabilityDetailModal from '../../components/mypost/AvailabilityDetailModal';
import { useTranslation } from 'react-i18next';

const PostedAvailabilitiesScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'past'>('all');
  const [showPostTypeModal, setShowPostTypeModal] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Mypost | null>(null);
  const [menuJobId, setMenuJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  // notification get for dot
  const { hasUnread } = useUnreadNotifications();
  // Queries
  const { data: availabilities = [], isLoading, refetch } = useQuery<Mypost[]>({
    queryKey: ['my-jobs'],
    queryFn: fetchMyJobs,
  });

  // Refetch on every focus — catches status changes made from other screens (e.g. hire action)
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const handleGoBack = () => navigation.goBack();
  const handleAddNew = () => setShowPostTypeModal(true);
  const handleCloseJob = (jobId: string) => {
    setMenuJobId(null);
    Alert.alert(
      'Close Job',
      'Close this job? It will be removed from the feed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close Job',
          style: 'destructive',
          onPress: async () => {
            try {
              await closeJob(jobId);
              queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
            } catch {
              Alert.alert('Error', 'Failed to close job. Please try again.');
            }
          },
        },
      ],
    );
  };

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
      case 'active': return t('posted_availabilities.status_active');
      case 'consumed': return t('posted_availabilities.status_consumed');
      case 'withdrawn': return t('posted_availabilities.status_withdrawn');
      case 'expired': return t('posted_availabilities.status_expired');
      default: return t('posted_availabilities.status_active');
    }
  };
  // Filter availabilities based on activeTab
  // const filteredAvailabilities = availabilities.filter((item: any) => {
  //   if (activeTab === 'all') return true;
  //   if (activeTab === 'active') return item.status === 'active';
  //   if (activeTab === 'past')
  //     return ['consumed', 'withdrawn', 'expired'].includes(item.status);
  //   return true;
  // });
  // 'all' excludes withdrawn — Option Y (withdrawn only visible in 'past' tab)
  const filteredAvailabilities = availabilities.filter((item: any) => {
    if (activeTab === 'all') return item.status !== 'withdrawn';
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
        <Text style={styles.title}>{t('posted_availabilities.title')}</Text>
        <NotificationDot hasUnread={hasUnread} />
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
            <Text style={styles.emptyMessageText}>{t('posted_availabilities.empty')}</Text>
          </View>
        ) : (
          filteredAvailabilities.map((item: Mypost) => (
            <TouchableOpacity
              key={item.id}
              style={styles.availabilityCard}
              onPress={() => {
                if (menuJobId === item.id) { setMenuJobId(null); return; }
                if (item.type !== 'fulltime' || item.status !== 'active') setSelectedJob(item);
              }}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  {item?.type === 'fulltime' ? (
                    <CalendarRange size={24} color="#1F2937" />
                  ) : item?.type === 'seasonal' ? (
                    <BriefcaseBusiness size={24} color="#1F2937" />
                  ) : item?.type === 'daily' ? (
                    <Sun size={24} color="#1F2937" />
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
                {item.type === 'fulltime' && item.status === 'active' ? (
                  <TouchableOpacity
                    onPress={() => setMenuJobId(menuJobId === item.id ? null : item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MoreVertical size={24} color="#ffffff" />
                  </TouchableOpacity>
                ) : (
                  <ChevronRight width={24} height={24} color="#ffffff" />
                )}
              </View>
              {/* 3-dot dropdown — fulltime active only */}
              {menuJobId === item.id && (
                <View style={styles.menuDropdown}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleCloseJob(item.id)}
                  >
                    <Text style={styles.menuItemText}>{t('posted_availabilities.menu_close')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ADD BUTTON */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Text style={styles.addButtonText}>{t('posted_availabilities.add_new')}</Text>
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
        onSelectDaily={() => {
          setShowPostTypeModal(false);
          navigation.navigate('DailyAvailabilityCreation');
        }}
      />
      <AvailabilityDetailModal
        job={selectedJob}
        visible={!!selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </SafeAreaView>
  );
};

export default PostedAvailabilitiesScreen;
