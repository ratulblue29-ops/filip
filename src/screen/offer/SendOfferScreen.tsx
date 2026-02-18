import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  MapPin,
  Clock,
  CalendarDays,
  FileText,
  Banknote,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './sendOfferStyle';
import { createEngagement } from '../../services/engagement';
import { createOrGetChat, sendMessage } from '../../services/chat';

// ─── Types ────────────────────────────────────────────────
type RootStackParamList = {
  SendOffer: { workerId: string; selectedPost: SelectedPost };
  ChatDetailScreen: { chatId: string; otherUserId: string };
};

type SelectedPost = {
  id: string;
  title: string;
  location: string[];
  rate: { amount: number; unit: string };
  type: string;
};

// ─── Helpers ──────────────────────────────────────────────
const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatTime = (d: Date): string =>
  d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

// ─── Component ────────────────────────────────────────────
const SendOfferScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  const {
    workerId,
    selectedPost,
  }: { workerId: string; selectedPost: SelectedPost } = route.params;

  // ── Form state ──
  const [workDate, setWorkDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workDateText, setWorkDateText] = useState(formatDate(new Date()));

  const [startTime, setStartTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startTimeText, setStartTimeText] = useState(formatTime(new Date()));

  const [endTime, setEndTime] = useState(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [endTimeText, setEndTimeText] = useState(formatTime(new Date()));

  const [wage, setWage] = useState('');
  const [location, setLocation] = useState(selectedPost?.location?.[0] ?? '');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Submit ──
  const handleSubmit = async () => {
    if (!wage.trim()) {
      Toast.show({ type: 'error', text1: 'Offered wage is required' });
      return;
    }
    if (!location.trim()) {
      Toast.show({ type: 'error', text1: 'Location is required' });
      return;
    }

    setLoading(true);
    try {
      // 1. Create engagement doc (status: pending)
      const engagementId = await createEngagement(workerId, selectedPost.id);

      // 2. Create or get chat between employer and worker
      const chatId = await createOrGetChat(workerId);

      // 3. Send structured offer card as job_attachment message
      await sendMessage(chatId, '', 'job_attachment', {
        offerCard: {
          engagementId,
          postTitle: selectedPost.title,
          workDate: workDateText,
          startTime: startTimeText,
          endTime: endTimeText,
          wage: `\u20ac${wage}`,
          location,
          description,
          status: 'pending', // pending | accepted | declined | withdrawn
        },
      });

      Toast.show({ type: 'success', text1: 'Offer sent!' });

      // 4. Navigate into chat
      navigation.navigate('ChatDetailScreen', {
        chatId,
        otherUserId: workerId,
      });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Error', text2: error.message });
    } finally {
      setLoading(false);
    }
  };

  // ── UI ──
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Send Offer</Text>

        {/* spacer so title stays centred */}
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* ── Availability Post (read-only) ── */}
          <Text style={styles.label}>Availability Post</Text>
          <View style={styles.inputWithIcon}>
            <FileText size={20} color="#FFD900" />
            <Text
              style={[styles.flexInput, { color: '#FFD900' }]}
              numberOfLines={1}
            >
              {selectedPost?.title ?? '\u2014'}
            </Text>
          </View>

          {/* ── Work Date ── */}
          <Text style={styles.label}>Work Date</Text>
          <TouchableOpacity
            style={styles.inputWithIcon}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <CalendarDays size={20} color="#9CA3AF" />
            {/* Editable: user can tap picker OR clear and type manually */}
            <TextInput
              style={styles.flexInput}
              value={workDateText}
              onChangeText={setWorkDateText}
              placeholderTextColor="#9CA3AF"
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={workDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={new Date()}
              onChange={(_, selected) => {
                setShowDatePicker(false);
                if (selected) {
                  setWorkDate(selected);
                  setWorkDateText(formatDate(selected));
                }
              }}
            />
          )}

          {/* ── Work Hours ── */}
          <Text style={styles.label}>Work Hours</Text>
          <View style={styles.rowBetween}>
            {/* Start */}
            <TouchableOpacity
              style={[styles.inputWithIcon, { flex: 1 }]}
              onPress={() => setShowStartPicker(true)}
              activeOpacity={0.8}
            >
              <Clock size={18} color="#9CA3AF" />
              <TextInput
                style={styles.flexInput}
                value={startTimeText}
                onChangeText={setStartTimeText}
                placeholderTextColor="#9CA3AF"
              />
            </TouchableOpacity>

            <Text style={styles.arrowText}>{'\u2192'}</Text>

            {/* End */}
            <TouchableOpacity
              style={[styles.inputWithIcon, { flex: 1 }]}
              onPress={() => setShowEndPicker(true)}
              activeOpacity={0.8}
            >
              <Clock size={18} color="#9CA3AF" />
              <TextInput
                style={styles.flexInput}
                value={endTimeText}
                onChangeText={setEndTimeText}
                placeholderTextColor="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selected) => {
                setShowStartPicker(false);
                if (selected) {
                  setStartTime(selected);
                  setStartTimeText(formatTime(selected));
                }
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, selected) => {
                setShowEndPicker(false);
                if (selected) {
                  setEndTime(selected);
                  setEndTimeText(formatTime(selected));
                }
              }}
            />
          )}

          {/* ── Offered Wage ── */}
          <Text style={styles.label}>Offered Wage ({'\u20ac'}/hr)</Text>
          <View style={styles.inputWithIcon}>
            <Banknote size={20} color="#9CA3AF" />
            <TextInput
              style={styles.flexInput}
              value={wage}
              onChangeText={setWage}
              keyboardType="numeric"
              placeholder="e.g. 20"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* ── Location ── */}
          <Text style={styles.label}>Location</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={20} color="#9CA3AF" />
            <TextInput
              style={styles.flexInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Work location"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* ── Description (optional) ── */}
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={300}
            placeholder="Any extra details about the role..."
            placeholderTextColor="#9CA3AF"
          />
          <Text style={styles.counter}>{description.length}/300</Text>

          {/* ── Submit ── */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1F2937" />
            ) : (
              <Text style={styles.saveText}>Send Offer</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOfferScreen;
