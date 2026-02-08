import { Banknote, Bookmark, Clock, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { JobCardProps } from '../../@types/JobCardProps.type';
import Toast from 'react-native-toast-message';
import { applyToJob } from '../../services/applyToJob';

const InfoTag = ({
  text,
  iconType,
}: {
  text: string;
  iconType: 'location' | 'salary' | 'time';
}) => {
  const getIcon = () => {
    if (iconType === 'location')
      return <MapPin width={16} height={16} color="white" />;
    if (iconType === 'salary')
      return <Banknote width={16} height={16} color="white" />;
    return <Clock width={16} height={16} color="white" />;
  };
  return (
    <View
      style={[styles.tagContainer, iconType === 'salary' && styles.salaryTag]}
    >
      {getIcon()}
      <Text
        style={[styles.tagText, iconType === 'salary' && styles.salaryText]}
      >
        {text}
      </Text>
    </View>
  );
};

export const JobCard: React.FC<JobCardProps> = ({ job, onBookmark }) => {
  const [loading, setLoading] = useState(false);

  // const handleApply = async (): Promise<void> => {
  //   if (loading) return;

  //   try {
  //     const user = auth().currentUser;
  //     if (!user) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Please login to apply',
  //       });
  //       return;
  //     }

  //     if (!job?.id || !job?.userId) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Job information missing',
  //       });
  //       return;
  //     }

  //     if (job.userId === user.uid) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'You cannot apply to your own job',
  //       });
  //       return;
  //     }

  //     setLoading(true);
  //     const db = firestore();

  //     // if already applied
  //     const existingSnap = await db
  //       .collection('jobApplications')
  //       .where('jobId', '==', job.id)
  //       .where('applicantId', '==', user.uid)
  //       .limit(1)
  //       .get();

  //     if (!existingSnap.empty) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'You already applied for this job',
  //       });
  //       setLoading(false);
  //       return;
  //     }

  //     const applicationRef = db.collection('jobApplications').doc();
  //     const jobRef = db.collection('jobs').doc(job.id);
  //     const notifRef = db.collection('notifications').doc();

  //     await db.runTransaction(async transaction => {
  //       const jobSnap = await transaction.get(jobRef);
  //       if (!jobSnap.exists) {
  //         throw new Error('Job not found');
  //       }

  //       transaction.set(applicationRef, {
  //         jobId: job.id,
  //         applicantId: user.uid,
  //         jobOwnerId: job.userId,
  //         status: 'pending',
  //         createdAt: firestore.FieldValue.serverTimestamp(),
  //       });

  //       transaction.set(notifRef, {
  //         toUserId: job.userId,
  //         fromUserId: user.uid,
  //         type: 'JOB_APPLY',
  //         title: 'New Job Application',
  //         data: {
  //           jobId: job.id,
  //           applicationId: applicationRef.id,
  //         },
  //         isRead: false,
  //         createdAt: firestore.FieldValue.serverTimestamp(),
  //       });
  //     });

  //     Toast.show({
  //       type: 'success',
  //       text1: 'Applied successfully',
  //     });
  //   } catch (error) {
  //     const msg = error instanceof Error ? error.message : 'Failed to apply';
  //     Toast.show({
  //       type: 'error',
  //       text1: msg,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleApply = async () => {
    try {
      setLoading(true);
      await applyToJob(job);
      Toast.show({ type: 'success', text1: 'Applied successfully' });
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err.message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleSection}>
          <Image source={{ uri: job?.user?.photo }} style={styles.avatar} />
          <View>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job?.user?.name}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onBookmark}>
          <Bookmark width={24} height={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Info Tags */}
      <View style={styles.tagsWrapper}>
        <View style={styles.row}>
          <InfoTag text={job.location} iconType="location" />
          {job.rate && (
            <InfoTag
              text={`€ ${job.rate.amount}/${
                job.rate.unit.charAt(0).toUpperCase() + job.rate.unit.slice(1)
              }`}
              iconType="salary"
            />
          )}
        </View>
        <View style={styles.row}>
          <InfoTag
            text={job.type.charAt(0).toUpperCase() + job.type.slice(1)}
            iconType="time"
          />
        </View>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        style={[styles.applyButton, loading && { opacity: 0.7 }]}
        onPress={handleApply}
        disabled={loading}
      >
        <Text style={styles.applyButtonText}>
          {loading ? 'Applying...' : 'Apply Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#121212',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 245, 245, 0.07)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
  },
  jobTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'InterDisplayBold',
  },
  companyName: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
  },
  tagsWrapper: {
    gap: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 21,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  salaryTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  tagText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontFamily: 'InterDisplayRegular',
    fontWeight: '400',
    marginLeft: 4,
  },
  salaryText: {
    color: '#FBBF24',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#FFD900',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'InterDisplayMedium',
    lineHeight: 24,
  },
});
