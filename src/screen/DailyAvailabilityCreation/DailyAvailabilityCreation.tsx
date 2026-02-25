import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Calendar as CalendarIcon, Clock, Coins } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import { RootStackParamList } from '../../navigator/RootNavigator';
import { createJob } from '../../services/jobs';
import styles, { COLORS } from './style';

// Rate options — daily is added here since this is a shift-based post
const RATE_OPTIONS = ['hourly', 'daily'] as const;
type RateType = (typeof RATE_OPTIONS)[number];

// Which picker is currently open — only one at a time
type ActivePicker = 'date' | 'start' | 'end' | null;

const formatDate = (d: Date): string => {
  // Returns "Mon, Feb 27" format for display
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (d: Date): string => {
  // Returns "HH:MM" in 24h for storage, display shows "HH:MM"
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const toISODate = (d: Date): string => {
  // "YYYY-MM-DD" for schedule field
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
};

const DailyAvailabilityCreation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();

  // ─── Date & time state ────────────────────────────────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  // Controls which native picker is visible — one at a time to avoid overlap
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);

  // Temp value while picker is open (Android confirms on close, iOS live)
  const [tempDate, setTempDate] = useState<Date>(tomorrow);

  // ─── Rate ──────────────────────────────────────────────────────────────────
  const [rateType, setRateType] = useState<RateType>('hourly');
  const [rateAmount, setRateAmount] = useState('');

  // ─── Location & description ────────────────────────────────────────────────
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [targetPosition, setTargetPosition] = useState('');

  // ─── Inline errors ────────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const openPicker = (type: ActivePicker) => {
    // Seed temp value so picker doesn't jump to epoch on first open
    if (type === 'date') setTempDate(selectedDate ?? tomorrow);
    if (type === 'start') setTempDate(startTime ?? new Date());
    if (type === 'end') setTempDate(endTime ?? new Date());
    setActivePicker(type);
  };

  const onPickerChange = (event: DateTimePickerEvent, pickedDate?: Date) => {
    // Android dismisses on any action; iOS stays open until user scrolls away
    if (Platform.OS === 'android') {
      setActivePicker(null);
      if (event.type !== 'set' || !pickedDate) return;
      applyPickerValue(pickedDate);
    } else {
      // iOS — update live as user scrolls
      if (pickedDate) setTempDate(pickedDate);
    }
  };

  const applyPickerValue = (value: Date) => {
    if (activePicker === 'date') {
      setSelectedDate(value);
      clearError('date');
    } else if (activePicker === 'start') {
      setStartTime(value);
      clearError('time');
    } else if (activePicker === 'end') {
      setEndTime(value);
      clearError('time');
    }
  };

  // iOS "Done" button confirms the scrolled value
  const onIOSDone = () => {
    applyPickerValue(tempDate);
    setActivePicker(null);
  };

  const onIOSCancel = () => setActivePicker(null);

  // ─── Mutation ─────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: () =>
      createJob({
        title: city.trim()
          ? `Available in ${city.trim()}`
          : 'Daily Availability',
        type: 'daily',
        description: description.trim() || 'No description provided.',
        date: toISODate(selectedDate!),
        startTime: formatTime(startTime!),
        endTime: formatTime(endTime!),
        location: city.trim() ? [city.trim()] : [],
        targetPosition: targetPosition.trim(),
        rate: {
          amount: parseFloat(rateAmount),
          unit: rateType,
        },
        currency: 'EUR',
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      Toast.show({
        type: 'success',
        text1: 'Availability Posted',
        text2: 'Your daily availability is now live.',
      });
      navigation.goBack();
    },

    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Post Failed',
        text2: error?.message ?? 'Something went wrong.',
      });
    },
  });

  // ─── Validation ────────────────────────────────────────────────────────────

  const handlePost = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedDate) newErrors.date = 'Select a date';

    if (!startTime || !endTime) {
      newErrors.time = 'Select both start and end times';
    } else if (
      selectedDate &&
      endTime.getHours() * 60 + endTime.getMinutes() <=
        startTime.getHours() * 60 + startTime.getMinutes()
    ) {
      newErrors.time = 'End time must be after start time';
    }

    if (!rateAmount || parseFloat(rateAmount) <= 0)
      newErrors.rate = 'Enter a valid rate';

    if (!city.trim()) newErrors.city = 'City is required';

    if (!targetPosition.trim())
      newErrors.targetPosition = 'Target position is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    mutation.mutate();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const pickerMode = activePicker === 'date' ? 'date' : 'time';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Daily Availability</Text>

        <TouchableOpacity
          onPress={handlePost}
          activeOpacity={0.7}
          disabled={mutation.isPending}
        >
          <Text
            style={[
              styles.postText,
              mutation.isPending && styles.postTextDisabled,
            ]}
          >
            {mutation.isPending ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── 1-credit cost notice ── */}
        <View style={styles.creditBanner}>
          <Coins color={COLORS.primary} size={18} />
          <Text style={styles.creditBannerText}>
            Posting costs{' '}
            <Text style={styles.creditBannerHighlight}>1 credit</Text>. If no
            engagement is received by end of day, your credit is refunded.
          </Text>
        </View>

        {/* ── Target Position ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Position</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Barista, Waiter, Event Staff"
            placeholderTextColor={COLORS.gray}
            value={targetPosition}
            onChangeText={t => {
              setTargetPosition(t);
              clearError('targetPosition');
            }}
          />
          {errors.targetPosition ? (
            <Text style={styles.fieldError}>{errors.targetPosition}</Text>
          ) : null}
        </View>

        {/* ── Date ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date</Text>

          <TouchableOpacity
            style={[
              styles.pickerCard,
              activePicker === 'date' && styles.pickerCardActive,
            ]}
            onPress={() => openPicker('date')}
            activeOpacity={0.7}
          >
            <CalendarIcon color={COLORS.primary} size={20} />
            <Text style={styles.pickerLabel}>Pick a date</Text>
            <Text
              style={[
                styles.pickerValue,
                !selectedDate && styles.pickerPlaceholder,
              ]}
            >
              {selectedDate ? formatDate(selectedDate) : 'Tap to select'}
            </Text>
          </TouchableOpacity>

          {errors.date ? (
            <Text style={styles.fieldError}>{errors.date}</Text>
          ) : null}
        </View>

        {/* ── Start & End Time ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shift Hours</Text>

          <View style={styles.pickerRow}>
            {/* Start time card */}
            <TouchableOpacity
              style={[
                styles.pickerCard,
                activePicker === 'start' && styles.pickerCardActive,
              ]}
              onPress={() => openPicker('start')}
              activeOpacity={0.7}
            >
              <Clock color={COLORS.primary} size={18} />
              <Text style={styles.pickerLabel}>Start</Text>
              <Text
                style={[
                  styles.pickerValue,
                  !startTime && styles.pickerPlaceholder,
                ]}
              >
                {startTime ? formatTime(startTime) : '--:--'}
              </Text>
            </TouchableOpacity>

            {/* End time card */}
            <TouchableOpacity
              style={[
                styles.pickerCard,
                activePicker === 'end' && styles.pickerCardActive,
              ]}
              onPress={() => openPicker('end')}
              activeOpacity={0.7}
            >
              <Clock color={COLORS.primary} size={18} />
              <Text style={styles.pickerLabel}>End</Text>
              <Text
                style={[
                  styles.pickerValue,
                  !endTime && styles.pickerPlaceholder,
                ]}
              >
                {endTime ? formatTime(endTime) : '--:--'}
              </Text>
            </TouchableOpacity>
          </View>

          {errors.time ? (
            <Text style={styles.fieldError}>{errors.time}</Text>
          ) : null}
        </View>

        {/* ── Native DateTimePicker — rendered once, mode switches ── */}
        {activePicker !== null && (
          <>
            {Platform.OS === 'ios' && (
              /* iOS confirm/cancel row above the picker */
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: COLORS.cardBg,
                  borderRadius: 12,
                  marginBottom: 4,
                }}
              >
                <TouchableOpacity onPress={onIOSCancel}>
                  <Text style={{ color: COLORS.gray, fontSize: 15 }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onIOSDone}>
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 15,
                      fontWeight: '600',
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <DateTimePicker
              value={tempDate}
              mode={pickerMode}
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={pickerMode === 'date' ? new Date() : undefined}
              onChange={onPickerChange}
              themeVariant="dark"
            />
          </>
        )}

        {/* ── Rate ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rate</Text>

          <View style={styles.toggleGroup}>
            {RATE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  rateType === option && styles.toggleBtnActive,
                ]}
                onPress={() => {
                  setRateType(option);
                  clearError('rate');
                }}
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

          <View style={styles.currencyRow}>
            <Text style={styles.currencyBadge}>EUR</Text>
            <TextInput
              style={styles.currencyInput}
              placeholder="0.00"
              placeholderTextColor={COLORS.gray}
              keyboardType="numeric"
              value={rateAmount}
              onChangeText={t => {
                setRateAmount(t);
                clearError('rate');
              }}
            />
          </View>

          {errors.rate ? (
            <Text style={styles.fieldError}>{errors.rate}</Text>
          ) : null}
        </View>

        {/* ── City ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>City</Text>

          <TextInput
            style={styles.inputCard}
            placeholder="e.g. Amsterdam"
            placeholderTextColor={COLORS.gray}
            value={city}
            onChangeText={t => {
              setCity(t);
              clearError('city');
            }}
          />

          {errors.city ? (
            <Text style={styles.fieldError}>{errors.city}</Text>
          ) : null}
        </View>

        {/* ── Description (optional) ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Description{' '}
            <Text style={{ color: COLORS.gray, fontSize: 14 }}>(optional)</Text>
          </Text>

          <TextInput
            style={styles.textArea}
            placeholder="e.g. Experienced barista, available for evening shift..."
            placeholderTextColor={COLORS.gray}
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DailyAvailabilityCreation;
