import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Briefcase, Clock, MapPin, SendHorizontal } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../screen/dailyAvailability/style';

type DailyJob = {
  id: string;
  title: string;
  targetPosition: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string[];
  rate: { amount: number; unit: string };
  currency: string;
  user: {
    id: string;
    name: string;
    photo: string | null;
    city: string;
    verified: boolean;
  };
};

type Props = {
  item: DailyJob;
};

const DEFAULT_AVATAR =
  'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg';

const DailyCard = ({ item }: Props) => {
  const navigation = useNavigation<any>();

  const locationText =
    item.location.length > 0
      ? item.location.join(', ')
      : item.user.city || 'N/A';

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isToday = item.date === today;
  const isSoon = item.date > today;

  return (
    <View style={styles.card}>
      {/* ── User row ── */}
      <View style={styles.userRow}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          onPress={() => navigation.navigate('viewProfile', { userId: item.user.id })}
        >
          <Image
            source={{ uri: item.user.photo || DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color="#9CA3AF" />
              <Text style={styles.locationText}>{locationText}</Text>
            </View>
          </View>
          <View>
            <View style={{
              alignSelf: 'flex-start',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
              marginBottom: 10,
            }}>
              <View style={{
                width: 6, height: 6, borderRadius: 3, marginRight: 6,
                backgroundColor: isToday ? '#4ADE80' : isSoon ? '#F59E0B' : '#6B7280',
              }} />
              <Text style={{ color: '#FFF', fontSize: 12, fontFamily: 'InterDisplayMedium' }}>
                {isToday ? 'Available Today' : isSoon ? 'Starts Soon' : 'Ended'}
              </Text>
            </View>
            <View style={styles.rateChip}>
              <Text style={styles.rateText}>
                {item.currency} {item.rate.amount}/{item.rate.unit}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Info row ── */}
      <View style={styles.infoRow}>
        {/* Target position */}
        <View style={styles.infoItem}>
          <Briefcase size={18} color="#FFD900" />
          <View>
            <Text style={styles.infoLabel}>Position</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {item.targetPosition || 'Not specified'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Time */}
        <View style={styles.infoItem}>
          <Clock size={18} color="#FFD900" />
          <View>
            <Text style={styles.infoLabel}>{item.date}</Text>
            <Text style={styles.infoValue}>
              {item.startTime && item.endTime
                ? `${item.startTime} – ${item.endTime}`
                : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Engage button ── */}
      <TouchableOpacity
        style={styles.engageButton}
        onPress={() =>
          navigation.navigate('viewProfile', { userId: item.user.id })
        }
        activeOpacity={0.8}
      >
        <Text style={styles.engageButtonText}>View Profile</Text>
        <SendHorizontal width={18} height={18} color="#1F2937" />
      </TouchableOpacity>
    </View>
  );
};

export default DailyCard;
