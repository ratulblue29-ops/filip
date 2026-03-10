import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Phone, MessageSquare } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { StyleSheet } from 'react-native';
import { fetchReceivedApplications } from '../../services/applyToJob';

const JobApplicationsScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // jobId passed from notification tap — used to filter applications for that specific job
  const { jobId } = route.params as { jobId: string };

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['receivedApplications'],
    queryFn: fetchReceivedApplications,
  });

  // Show only applications for this specific job
  const filtered = jobId
    ? applications.filter((a: any) => a.jobId === jobId)
    : applications;

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Applicant info */}
      <View style={styles.applicantRow}>
        <Image
          source={{
            uri:
              item.applicantPhoto ||
              'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1906669723.jpg',
          }}
          style={styles.avatar}
        />
        <View style={styles.applicantInfo}>
          <Text style={styles.applicantName}>{item.applicantName}</Text>
          <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        </View>
      </View>

      {/* Message */}
      {!!item.message && (
        <View style={styles.detailRow}>
          <MessageSquare size={16} color="#9CA3AF" />
          <Text style={styles.detailText}>{item.message}</Text>
        </View>
      )}

      {/* Phone — tapping opens the dialler with the number pre-filled */}
      {!!item.phone && (
        <TouchableOpacity
          style={styles.detailRow}
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
          activeOpacity={0.7}
        >
          <Phone size={16} color="#FFD900" />
          <Text style={[styles.detailText, { color: '#FFD900' }]}>
            {item.phone}
          </Text>
        </TouchableOpacity>
      )}

      {/* Email — tapping opens the mail app with the address pre-filled */}
      {!!item.email && (
        <TouchableOpacity
          style={styles.detailRow}
          onPress={() => Linking.openURL(`mailto:${item.email}`)}
          activeOpacity={0.7}
        >
          <Mail size={16} color="#FFD900" />
          <Text style={[styles.detailText, { color: '#FFD900' }]}>
            {item.email}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Applications</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <ActivityIndicator color="#FFD900" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No applications yet</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InterDisplay-SemiBold',
  },
  listContent: {
    paddingBottom: 60,
  },
  card: {
    backgroundColor: '#1D1D1D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 250, 251, 0.10)',
    gap: 12,
  },
  applicantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'InterDisplay-SemiBold',
  },
  jobTitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'InterDisplay-Regular',
    marginTop: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  detailText: {
    flex: 1,
    color: '#F5F5F5',
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
    lineHeight: 20,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 60,
    fontSize: 14,
    fontFamily: 'InterDisplay-Regular',
  },
});

export default JobApplicationsScreen;
