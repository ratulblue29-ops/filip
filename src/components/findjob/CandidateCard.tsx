import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, Lock, SendHorizontal, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../screen/seasonAvailabilty/style';
export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  location: string;
  image: string;
  status: 'Available' | 'Starts Soon';
  statusText: string;
  tags: string[];
  availabilityType: string;
  dates: string;
  isLocked: boolean;
}
interface CandidateCardProps {
  candidate: Candidate;
}
const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const navigation = useNavigation<any>();
  console.log('candidate', candidate);
  return (
    <View style={styles.card}>
      {/* Cover Image */}
      <Image source={{ uri: candidate.image }} style={styles.candidateImage} />

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
              backgroundColor:
                candidate.status === 'Available' ? '#4ADE80' : '#F59E0B',
            },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: candidate.status === 'Available' ? '#000' : '#FFF' },
          ]}
        >
          {candidate.statusText}
        </Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileRow}>
        <Image
          source={{ uri: candidate.avatar }}
          style={styles.avatarPlaceholder}
        />
        <View>
          <Text style={styles.candidateName}>{candidate.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#FFF" />
            <Text style={styles.locationText}>{candidate.location}</Text>
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
              {candidate.availabilityType}
            </Text>
            <Text style={styles.availabilityDates}>{candidate.dates}</Text>
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
