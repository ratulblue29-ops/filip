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
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAuth } from '@react-native-firebase/auth';
import styles from './sendOfferStyle';
import { createEngagement } from '../../services/engagement';
import { sendMessage } from '../../services/chat';
import { useTranslation } from 'react-i18next';

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
  schedule?: { start: string; end: string };
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
    timeZone: 'UTC',
  });

// ─── Component ────────────────────────────────────────────
const SendOfferScreen = () => {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  const {
    workerId,
    selectedPost,
  }: { workerId: string; selectedPost: SelectedPost } = route.params;

  // Derive rate options — daily excludes monthly
  const RATE_OPTIONS =
    selectedPost.type === 'daily'
      ? (['hourly', 'daily'] as const)
      : (['hourly', 'daily', 'monthly'] as const);

  // ── Form state ──

  // Daily: single work date
  // const [workDate, setWorkDate] = useState(new Date());
  // const [showDatePicker, setShowDatePicker] = useState(false);
  // const [workDateText, setWorkDateText] = useState(formatDate(new Date()));
  const [workDate, setWorkDate] = useState<Date>(() =>
    selectedPost.schedule?.start
      ? new Date(selectedPost.schedule.start)
      : new Date(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workDateText, setWorkDateText] = useState<string>(() =>
    formatDate(
      selectedPost.schedule?.start
        ? new Date(selectedPost.schedule.start)
        : new Date(),
    ),
  );

  // Seasonal: start date
  // const [startDate, setStartDate] = useState(new Date());
  // const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  // const [startDateText, setStartDateText] = useState(formatDate(new Date()));

  const [startDate, setStartDate] = useState<Date>(() =>
    selectedPost.schedule?.start
      ? new Date(selectedPost.schedule.start)
      : new Date(),
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [startDateText, setStartDateText] = useState<string>(() =>
    formatDate(
      selectedPost.schedule?.start
        ? new Date(selectedPost.schedule.start)
        : new Date(),
    ),
  );

  // Seasonal: end date
  // const defaultEndDate = new Date();
  // defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);

  // const [endDate, setEndDate] = useState(defaultEndDate);
  // const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  // const [endDateText, setEndDateText] = useState(formatDate(defaultEndDate));

  const [endDate, setEndDate] = useState<Date>(() => {
    if (selectedPost.schedule?.end) return new Date(selectedPost.schedule.end);
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d;
  });
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [endDateText, setEndDateText] = useState<string>(() => {
    if (selectedPost.schedule?.end)
      return formatDate(new Date(selectedPost.schedule.end));
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return formatDate(d);
  });

  // Daily: start time
  // const [startTime, setStartTime] = useState(new Date());
  // const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  // const [startTimeText, setStartTimeText] = useState(formatTime(new Date()));
  const [startTime, setStartTime] = useState<Date>(() =>
    selectedPost.schedule?.start
      ? new Date(selectedPost.schedule.start)
      : new Date(),
  );
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [startTimeText, setStartTimeText] = useState<string>(() =>
    formatTime(
      selectedPost.schedule?.start
        ? new Date(selectedPost.schedule.start)
        : new Date(),
    ),
  );

  // Daily: end time
  // const [endTime, setEndTime] = useState(new Date());
  // const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  // const [endTimeText, setEndTimeText] = useState(formatTime(new Date()));
  const [endTime, setEndTime] = useState<Date>(() =>
    selectedPost.schedule?.end
      ? new Date(selectedPost.schedule.end)
      : new Date(),
  );
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [endTimeText, setEndTimeText] = useState<string>(() =>
    formatTime(
      selectedPost.schedule?.end
        ? new Date(selectedPost.schedule.end)
        : new Date(),
    ),
  );

  // Seasonal: hours per day
  const [hoursPerDay, setHoursPerDay] = useState('');

  const [wage, setWage] = useState('');
  const [rateType, setRateType] = useState<'hourly' | 'daily' | 'monthly'>(
    'hourly',
  );
  const [location, setLocation] = useState(selectedPost?.location?.[0] ?? '');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Submit ──
  const handleSubmit = async () => {
    if (!wage.trim()) {
      Toast.show({ type: 'error', text1: t('send_offer.toast_wage_required') });
      return;
    }
    if (!location.trim()) {
      Toast.show({ type: 'error', text1: t('send_offer.toast_location_required') });
      return;
    }

    setLoading(true);
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) throw new Error('Login required');

      // 1. Create engagement doc (status: pending) — deducts 1 credit
      const engagementId = await createEngagement(workerId, selectedPost.id);

      // 2. Chat id is tied to engagement id
      const chatId = engagementId;

      // 3. Send structured offer card as job_attachment message
      await sendMessage(chatId, '', 'job_attachment', {
        offerCard: {
          engagementId,
          fromUserId: currentUser.uid,
          postTitle: selectedPost.title,
          // Daily-specific fields
          ...(selectedPost.type === 'daily' && {
            workDate: workDateText,
            startTime: startTimeText,
            endTime: endTimeText,
          }),
          // Seasonal-specific fields
          ...(selectedPost.type === 'seasonal' && {
            startDate: startDateText,
            endDate: endDateText,
            hoursPerDay: `${hoursPerDay} hrs/day`,
          }),
          rateType,
          wage: `\u20ac${wage}`,
          location,
          description,
          status: 'pending', // pending | accepted | declined | withdrawn
        },
      });

      Toast.show({ type: 'success', text1: t('send_offer.toast_sent') });

      // 4. Navigate into chat
      navigation.navigate('ChatDetailScreen', {
        chatId,
        otherUserId: workerId,
      });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: t('send_offer.toast_error'), text2: error.message });
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

        <Text style={styles.headerTitle}>{t('send_offer.title')}</Text>

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
          <Text style={styles.label}>{t('send_offer.label_post')}</Text>
          <View style={styles.inputWithIcon}>
            <FileText size={20} color="#FFD900" />
            <Text
              style={[styles.flexInput, { color: '#FFD900' }]}
              numberOfLines={1}
            >
              {selectedPost?.title ?? '\u2014'}
            </Text>
          </View>

          {/* ── DAILY: Work Date + Start Time + End Time ── */}
          {selectedPost.type === 'daily' && (
            <>
              <Text style={styles.label}>{t('send_offer.label_work_date')}</Text>
              <TouchableOpacity
                style={styles.inputWithIcon}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
              >
                <CalendarDays size={20} color="#9CA3AF" />
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

              {/* <Text style={styles.label}>Work Hours</Text>
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={[styles.inputWithIcon, { flex: 1 }]}
                  onPress={() => setShowStartTimePicker(true)}
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
                <Text style={styles.arrowText}>→</Text>
                <TouchableOpacity
                  style={[styles.inputWithIcon, { flex: 1 }]}
                  onPress={() => setShowEndTimePicker(true)}
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
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, selected) => {
                    setShowStartTimePicker(false);
                    if (selected) {
                      setStartTime(selected);
                      setStartTimeText(formatTime(selected));
                    }
                  }}
                />
              )}
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, selected) => {
                    setShowEndTimePicker(false);
                    if (selected) {
                      setEndTime(selected);
                      setEndTimeText(formatTime(selected));
                    }
                  }}
                />
              )} */}
              {/* <Text style={styles.label}>Work Hours</Text> */}
              <View style={styles.rowBetween}>
                {/* Start Time */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>{t('send_offer.label_start_time')}</Text>
                  <TouchableOpacity
                    style={styles.inputWithIcon}
                    onPress={() => setShowStartTimePicker(true)}
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
                </View>

                <Text style={styles.arrowText}> </Text>

                {/* End Time */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>{t('send_offer.label_end_time')}</Text>
                  <TouchableOpacity
                    style={styles.inputWithIcon}
                    onPress={() => setShowEndTimePicker(true)}
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
              </View>

              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, selected) => {
                    setShowStartTimePicker(false);
                    if (selected) {
                      setStartTime(selected);
                      setStartTimeText(formatTime(selected));
                    }
                  }}
                />
              )}
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, selected) => {
                    setShowEndTimePicker(false);
                    if (selected) {
                      setEndTime(selected);
                      setEndTimeText(formatTime(selected));
                    }
                  }}
                />
              )}
            </>
          )}

          {/* ── SEASONAL: Start Date + End Date + Work Hours per Day ── */}
          {selectedPost.type === 'seasonal' && (
            <>
              <Text style={styles.label}>{t('send_offer.label_start_date')}</Text>
              <TouchableOpacity
                style={styles.inputWithIcon}
                onPress={() => setShowStartDatePicker(true)}
                activeOpacity={0.8}
              >
                <CalendarDays size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.flexInput}
                  value={startDateText}
                  onChangeText={setStartDateText}
                  placeholderTextColor="#9CA3AF"
                />
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={new Date()}
                  onChange={(_, selected) => {
                    setShowStartDatePicker(false);
                    if (selected) {
                      setStartDate(selected);
                      setStartDateText(formatDate(selected));
                    }
                  }}
                />
              )}

              <Text style={styles.label}>{t('send_offer.label_end_date')}</Text>
              <TouchableOpacity
                style={styles.inputWithIcon}
                onPress={() => setShowEndDatePicker(true)}
                activeOpacity={0.8}
              >
                <CalendarDays size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.flexInput}
                  value={endDateText}
                  onChangeText={setEndDateText}
                  placeholderTextColor="#9CA3AF"
                />
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minimumDate={startDate}
                  onChange={(_, selected) => {
                    setShowEndDatePicker(false);
                    if (selected) {
                      setEndDate(selected);
                      setEndDateText(formatDate(selected));
                    }
                  }}
                />
              )}

              <Text style={styles.label}>{t('send_offer.label_hours')}</Text>
              <View style={styles.inputWithIcon}>
                <Clock size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.flexInput}
                  value={hoursPerDay}
                  onChangeText={setHoursPerDay}
                  keyboardType="numeric"
                  placeholder="e.g. 8"
                  placeholderTextColor="#9CA3AF"
                />
                <Text style={{ color: '#9CA3AF', fontSize: 13 }}>hrs/day</Text>
              </View>
            </>
          )}

          {/* ── Offered Wage ── */}
          <Text style={styles.label}>{t('send_offer.label_wage')}</Text>

          {/* Rate type toggle */}
          <View style={styles.toggleGroup}>
            {RATE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  rateType === option && styles.toggleBtnActive,
                ]}
                onPress={() => setRateType(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    rateType === option && styles.toggleBtnTextActive,
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* EUR currency input */}
          <View style={styles.currencyRow}>
            <Text style={styles.currencyBadge}>EUR</Text>
            <TextInput
              style={styles.currencyInput}
              value={wage}
              onChangeText={setWage}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* ── Location ── */}
          <Text style={styles.label}>{t('send_offer.label_location')}</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={20} color="#9CA3AF" />
            <TextInput
              style={styles.flexInput}
              value={location}
              onChangeText={setLocation}
              placeholder={t('send_offer.placeholder_location')}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* ── Description (optional) ── */}
          <Text style={styles.label}>{t('send_offer.label_description')}</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={300}
            placeholder={t('send_offer.placeholder_description')}
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
              <Text style={styles.saveText}>{t('send_offer.btn_send')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOfferScreen;
