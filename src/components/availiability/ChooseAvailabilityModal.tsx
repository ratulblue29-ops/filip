import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  X,
  BriefcaseBusiness,
  CalendarRange,
  MapPin,
} from 'lucide-react-native';

type AvailabilityPost = {
  id: string;
  title: string;
  type: string;
  rate: { amount: number; unit: string };
  location: string[];
};

type ChooseAvailabilityModalProps = {
  visible: boolean;
  onClose: () => void;
  posts: AvailabilityPost[];
  loading: boolean;
  onSelect: (post: AvailabilityPost) => void;
};

const ChooseAvailabilityModal = ({
  visible,
  onClose,
  posts,
  loading,
  onSelect,
}: ChooseAvailabilityModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose Availability</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Select one availability post to send engagement
          </Text>

          {/* Content */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#FFD900"
              style={styles.loader}
            />
          ) : posts.length === 0 ? (
            <Text style={styles.emptyText}>
              This worker has no active availability posts
            </Text>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.postCard}
                  onPress={() => onSelect(item)}
                  activeOpacity={0.8}
                >
                  {/* Icon */}
                  <View style={styles.iconCircle}>
                    {item.type === 'fulltime' ? (
                      <CalendarRange size={22} color="#1F2937" />
                    ) : (
                      <BriefcaseBusiness size={22} color="#1F2937" />
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.postInfo}>
                    <Text style={styles.postTitle} numberOfLines={1}>
                      {item.title}
                    </Text>

                    <View style={styles.postMeta}>
                      <Text style={styles.postRate}>
                        €{item.rate?.amount}/{item.rate?.unit}
                      </Text>

                      {item.location?.length > 0 && (
                        <View style={styles.locationRow}>
                          <MapPin size={12} color="#9CA3AF" />
                          <Text style={styles.locationText} numberOfLines={1}>
                            {item.location.join(', ')}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.typeBadge}>
                      <Text style={styles.typeBadgeText}>
                        {item.type === 'fulltime' ? 'Full Time' : 'Seasonal'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChooseAvailabilityModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'InterDisplayMedium',
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'InterDisplayRegular',
    marginBottom: 16,
  },
  loader: {
    marginVertical: 30,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 30,
    fontFamily: 'InterDisplayRegular',
  },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInfo: {
    flex: 1,
    gap: 4,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'InterDisplayMedium',
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  postRate: {
    fontSize: 13,
    color: '#FFD900',
    fontFamily: 'InterDisplayMedium',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'InterDisplayRegular',
    flex: 1,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#374151',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeBadgeText: {
    fontSize: 11,
    color: '#D1D5DB',
    fontFamily: 'InterDisplayRegular',
  },
  cancelBtn: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontFamily: 'InterDisplayMedium',
  },
});
