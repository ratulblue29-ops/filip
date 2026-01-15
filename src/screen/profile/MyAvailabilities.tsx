import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  Bell,
  ChevronRight,
  Plus,
  ChefHat,
  Martini,
  GlassWater,
  UtensilsCrossed,
  Eraser,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---
type Status = 'Active' | 'Consumed' | 'Withdrawn' | 'Expired';

interface AvailabilityItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  date: string;
  time: string;
  status: Status;
  statusText?: string;
  postedTime: string;
}

// --- Mock Data ---
const DATA: AvailabilityItem[] = [
  {
    id: '1',
    title: 'Head Chef',
    icon: <ChefHat color="#121212" size={24} />,
    date: 'Fri, Nov 14',
    time: '5 Pm - 11 Pm',
    status: 'Active',
    statusText: '3 Offers Received',
    postedTime: '2d Ago',
  },
  {
    id: '2',
    title: 'Banquet Server',
    icon: <Martini color="#121212" size={24} />,
    date: 'Weekend',
    time: 'On Call',
    status: 'Active',
    statusText: 'Open For Offers',
    postedTime: '1h Ago',
  },
  {
    id: '3',
    title: 'Bartender',
    icon: <GlassWater color="#121212" size={24} />,
    date: 'Sat, Sat 12',
    time: '7 Am - 12 Pm',
    status: 'Consumed',
    postedTime: '1d Ago',
  },
  {
    id: '4',
    title: 'Assistant Cook',
    icon: <UtensilsCrossed color="#121212" size={24} />,
    date: 'Sat, Sat 12',
    time: '7 Am - 12 Pm',
    status: 'Withdrawn',
    postedTime: '1d Ago',
  },
  {
    id: '5',
    title: 'Cleaner',
    icon: <Eraser color="#121212" size={24} />,
    date: 'Sat, Sat 12',
    time: '7 Am - 12 Pm',
    status: 'Expired',
    postedTime: '1d Ago',
  },
];

// --- Colors ---
const COLORS = {
  background: '#121212',
  cardBg: '#1C1C1E',
  primaryYellow: '#FFD700',
  activeGreen: '#C4F469',
  withdrawnRed: '#4A1515',
  withdrawnText: '#FF453A',
  expiredGray: '#3A3A3C',
  textMain: '#FFFFFF',
  textSecondary: '#A1A1AA',
};

const AvailabilityCard = ({ item }: { item: AvailabilityItem }) => {
  const getStatusStyle = (status: Status) => {
    switch (status) {
      case 'Active':
        return { bg: COLORS.activeGreen, text: '#000' };
      case 'Withdrawn':
        return { bg: COLORS.withdrawnRed, text: COLORS.withdrawnText };
      case 'Consumed':
        return { bg: COLORS.expiredGray, text: COLORS.textSecondary };
      case 'Expired':
        return { bg: COLORS.expiredGray, text: COLORS.textSecondary };
      default:
        return { bg: COLORS.expiredGray, text: '#FFF' };
    }
  };

  const statusStyle = getStatusStyle(item.status);

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>{item.icon}</View>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text
            style={styles.cardSubtitle}
          >{`${item.date}  •  ${item.time}`}</Text>
        </View>
        <ChevronRight color={COLORS.textSecondary} size={20} />
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.statusRow}>
          <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>
              {item.status}
            </Text>
          </View>
          {item.statusText && (
            <Text style={styles.statusDetailText}>{item.statusText}</Text>
          )}
        </View>
        <Text style={styles.postedText}>Posted {item.postedTime}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MyAvailabilities() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <ChevronLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Posted Availabilities</Text>
        <TouchableOpacity>
          <Bell color="#FFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {['All', 'Active', 'Past'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {DATA.map(item => (
          <AvailabilityCard key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Plus color="#000" size={24} />
        <Text style={styles.fabText}>Post New</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.primaryYellow,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  cardFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusDetailText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  postedText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: COLORS.primaryYellow,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
});
