import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, Lock, SendHorizontal, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../screen/seasonAvailabilty/style';
import Worker from '../../@types/Worker.type';

interface CandidateCardProps {
  candidate: Worker;
}
const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const navigation = useNavigation<any>();
  const formatCustomDate = (dateString?: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.card}>
      {/* Cover Image */}
      <Image
        source={{ uri: candidate?.bannerImage || 'n/a' }}
        style={styles.candidateImage}
      />

      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          candidate.status === 'Available'
            ? styles.statusYellow
            : styles.statusDark,
        ]}
      >
        <View
          style={[
            styles.dot,
            {
              backgroundColor: candidate?.isAvailable ? '#4ADE80' : '#F59E0B',
            },
          ]}
        />
        <Text style={styles.statusText}>
          {candidate?.isAvailable ? 'Available' : 'Starts Soon'}
        </Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileRow}>
        <Image
          source={{
            uri: candidate.user.photo || 'n/a',
          }}
          style={styles.avatarPlaceholder}
        />
        <View>
          <Text style={styles.candidateName}>{candidate?.user?.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#FFF" />
            <Text style={styles.locationText}>{candidate?.user?.city}</Text>
          </View>
        </View>
      </View>

      {/* Tags & Availability */}
      <View style={styles.cardContent}>
        <View style={styles.tagContainer}>
          {candidate.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.availabilityRow}>
          <Calendar size={24} color="#FFF" />
          <View>
            <Text style={styles.availabilityTitle}>
              {candidate?.title || ''}
            </Text>
            <Text style={styles.availabilityDates}>
              {formatCustomDate(candidate.dateRange?.start)} -{' '}
              {formatCustomDate(candidate.dateRange?.end)}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        {candidate.isLocked ? (
          <TouchableOpacity
            style={styles.lockButton}
            onPress={() => navigation.navigate('membership')}
          >
            <Lock size={18} color="#FFF" />
            <Text style={styles.lockButtonText}>Upgrade To Contact</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.engageButton}
            onPress={() => navigation.navigate('chat')}
          >
            <Text style={styles.engageButtonText}>Engage Candidate</Text>
            <SendHorizontal width={18} height={18} color="#1F2937" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CandidateCard;
