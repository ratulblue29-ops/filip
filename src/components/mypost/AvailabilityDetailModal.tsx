import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Edit2, Save } from 'lucide-react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { Mypost } from '../../@types/Mypost.type';
import { fetchJobById, updateJob } from '../../services/jobs';
import styles from './modalStyle';

type Props = {
  job: Mypost | null;
  visible: boolean;
  onClose: () => void;
};

// Rate type options — daily type only supports hourly/daily
type RateType = 'hourly' | 'daily' | 'monthly';
const SEASONAL_RATE_OPTIONS: RateType[] = ['hourly', 'daily', 'monthly'];
const DAILY_RATE_OPTIONS: RateType[] = ['hourly', 'daily'];

// Maps status string to its badge background color — colocated with render logic
const statusBgColor: Record<string, string> = {
  active: '#BEF264',
  consumed: '#475569',
  withdrawn: '#ff000041',
  expired: '#374151',
};

const AvailabilityDetailModal = ({ job, visible, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // ─── Fetch full job detail on open ───────────────────────────────────────────
  const { data: detail, isLoading } = useQuery<Record<string, any>>({
    queryKey: ['job-detail', job?.id],
    queryFn: () => fetchJobById(job!.id),
    // Only runs when modal is open and a job is selected
    enabled: !!job?.id && visible,
  });

  // ─── Edit form state ──────────────────────────────────────────────────────────
  // All types
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Fulltime
  const [city, setCity] = useState('');
  const [salary, setSalary] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  // Seasonal + Daily
  const [rateAmount, setRateAmount] = useState('');
  const [rateType, setRateType] = useState<RateType>('hourly');
  // Daily
  const [targetPosition, setTargetPosition] = useState('');
  const [dailyCity, setDailyCity] = useState('');

  // Seed form fields when detail arrives from Firestore
  useEffect(() => {
    if (!detail) return;
    setTitle(detail.title ?? '');
    setDescription(detail.description ?? '');
    // Fulltime seeds
    setCity(detail.location?.[0] ?? '');
    setSalary(String(detail.rate?.amount ?? ''));
    setDaysPerWeek(String(detail.daysPerWeek ?? ''));
    setPhone(detail.contact?.phone ?? '');
    setEmail(detail.contact?.email ?? '');
    // Seasonal + Daily seeds
    setRateAmount(String(detail.rate?.amount ?? ''));
    setRateType((detail.rate?.unit as RateType) ?? 'hourly');
    // Daily seeds
    setTargetPosition(detail.targetPosition ?? '');
    setDailyCity(detail.location?.[0] ?? '');
  }, [detail]);

  // Reset edit mode whenever modal closes so next open starts in read view
  useEffect(() => {
    if (!visible) setIsEditing(false);
  }, [visible]);

  // ─── Save mutation ────────────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: () => {
      if (!job) throw new Error('No job selected');

      // Base fields shared across all types
      const payload: Record<string, any> = {
        title,
        description,
      };

      if (job.type === 'fulltime') {
        payload.location = city.trim() ? [city.trim()] : [];
        payload.rate = {
          amount: Number(salary.replace(/\D/g, '')) || 0,
          unit: 'month',
        };
        payload.daysPerWeek = Number(daysPerWeek) || 0;
        payload.contact = {
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
        };
      }

      if (job.type === 'seasonal') {
        payload.rate = {
          amount: parseFloat(rateAmount) || 0,
          unit: rateType,
        };
      }

      if (job.type === 'daily') {
        payload.targetPosition = targetPosition.trim();
        payload.location = dailyCity.trim() ? [dailyCity.trim()] : [];
        payload.rate = {
          amount: parseFloat(rateAmount) || 0,
          unit: rateType,
        };
      }

      return updateJob(job.id, payload);
    },
    onSuccess: () => {
      // Refresh list + re-seed detail cache on next open
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job-detail', job?.id] });
      Toast.show({
        type: 'success',
        text1: 'Saved',
        text2: 'Post updated successfully.',
      });
      setIsEditing(false);
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Save failed',
        text2: err?.message ?? 'Something went wrong.',
      });
    },
  });

  // ─── Helpers ──────────────────────────────────────────────────────────────────

  // Renders a labeled read-only row — skips render if value is falsy
  const readRow = (label: string, value: string | undefined | null) => {
    if (!value) return null;
    return (
      <View style={styles.readRow} key={label}>
        <Text style={styles.readLabel}>{label}</Text>
        <Text style={styles.readValue}>{value}</Text>
      </View>
    );
  };

  // Formats ISO date string for display e.g. "Mon Jan 01 2026"
  const formatDate = (iso: string | undefined | null) =>
    iso ? new Date(iso).toDateString() : undefined;

  const rateDisplay = (d: Record<string, any> | undefined) =>
    d?.rate?.amount ? `€${d.rate.amount} / ${d.rate.unit}` : undefined;

  const type = job?.type;

  // ─── Rate toggle helper ───────────────────────────────────────────────────────
  const renderRateToggle = (options: RateType[]) => (
    <>
      <View style={styles.toggleGroup}>
        {options.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.toggleBtn,
              rateType === opt && styles.toggleBtnActive,
            ]}
            onPress={() => setRateType(opt)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleBtnText,
                rateType === opt && styles.toggleBtnTextActive,
              ]}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.currencyRow}>
        <Text style={styles.currencyBadge}>EUR</Text>
        <TextInput
          style={styles.currencyInput}
          value={rateAmount}
          onChangeText={setRateAmount}
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
          placeholder="0.00"
        />
      </View>
    </>
  );

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Post' : 'Post Details'}
          </Text>

          {/* Right action: Edit icon (read mode) or Save icon (edit mode) */}
          {!isEditing ? (
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <Edit2 size={22} color="#FFD900" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => mutation.mutate()}
              activeOpacity={0.7}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <ActivityIndicator size="small" color="#FFD900" />
              ) : (
                <Save size={22} color="#FFD900" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ── Body ── */}
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#FFD900" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Type + Status badges */}
            <View style={styles.statusRow}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                  {type?.toUpperCase() ?? ''}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 24,
                  backgroundColor:
                    statusBgColor[job?.status ?? ''] ?? '#BEF264',
                }}
              >
                <Text style={styles.statusText}>
                  {job?.status?.toUpperCase() ?? ''}
                </Text>
              </View>
            </View>

            {/* ── READ VIEW ── */}
            {!isEditing && (
              <>
                {readRow('Title', detail?.title)}

                {type === 'fulltime' && (
                  <>
                    {readRow('City', detail?.location?.[0])}
                    {readRow(
                      'Salary',
                      detail?.rate?.amount
                        ? `€${detail.rate.amount} / month`
                        : undefined,
                    )}
                    {readRow(
                      'Days / Week',
                      detail?.daysPerWeek
                        ? `${detail.daysPerWeek} days`
                        : undefined,
                    )}
                    {readRow('Phone', detail?.contact?.phone)}
                    {readRow('Email', detail?.contact?.email)}
                  </>
                )}

                {type === 'seasonal' && (
                  <>
                    {readRow('Rate', rateDisplay(detail))}
                    {readRow('Start Date', formatDate(detail?.schedule?.start))}
                    {readRow('End Date', formatDate(detail?.schedule?.end))}
                    {readRow(
                      'Locations',
                      detail?.location?.length
                        ? detail.location.join(', ')
                        : undefined,
                    )}
                    {readRow(
                      'Skills',
                      detail?.requiredSkills?.length
                        ? detail.requiredSkills.join(', ')
                        : undefined,
                    )}
                  </>
                )}

                {type === 'daily' && (
                  <>
                    {readRow('Target Position', detail?.targetPosition)}
                    {readRow('Date', detail?.date)}
                    {readRow('Start Time', detail?.startTime)}
                    {readRow('End Time', detail?.endTime)}
                    {readRow('City', detail?.location?.[0])}
                    {readRow('Rate', rateDisplay(detail))}
                  </>
                )}

                {readRow('Description', detail?.description)}
              </>
            )}

            {/* ── EDIT FORM ── */}
            {isEditing && (
              <>
                {/* Common: Title */}
                <Text style={styles.fieldLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="#9CA3AF"
                  placeholder="Post title"
                />

                {/* Fulltime-specific fields */}
                {type === 'fulltime' && (
                  <>
                    <Text style={styles.fieldLabel}>City</Text>
                    <TextInput
                      style={styles.input}
                      value={city}
                      onChangeText={setCity}
                      placeholderTextColor="#9CA3AF"
                      placeholder="E.g. Berlin"
                    />

                    <Text style={styles.fieldLabel}>Salary (€ / month)</Text>
                    <TextInput
                      style={styles.input}
                      value={salary}
                      onChangeText={setSalary}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                      placeholder="3500"
                    />

                    <Text style={styles.fieldLabel}>Days / Week</Text>
                    <TextInput
                      style={styles.input}
                      value={daysPerWeek}
                      onChangeText={setDaysPerWeek}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                      placeholder="5"
                    />

                    <Text style={styles.fieldLabel}>Phone</Text>
                    <TextInput
                      style={styles.input}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                      placeholder="+49 123 456 789"
                    />

                    <Text style={styles.fieldLabel}>Email</Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#9CA3AF"
                      placeholder="example@email.com"
                    />
                  </>
                )}

                {/* Seasonal-specific fields */}
                {type === 'seasonal' && (
                  <>
                    <Text style={styles.fieldLabel}>Rate</Text>
                    {renderRateToggle(SEASONAL_RATE_OPTIONS)}
                  </>
                )}

                {/* Daily-specific fields */}
                {type === 'daily' && (
                  <>
                    <Text style={styles.fieldLabel}>Target Position</Text>
                    <TextInput
                      style={styles.input}
                      value={targetPosition}
                      onChangeText={setTargetPosition}
                      placeholderTextColor="#9CA3AF"
                      placeholder="e.g. Barista, Waiter"
                    />

                    <Text style={styles.fieldLabel}>City</Text>
                    <TextInput
                      style={styles.input}
                      value={dailyCity}
                      onChangeText={setDailyCity}
                      placeholderTextColor="#9CA3AF"
                      placeholder="e.g. Amsterdam"
                    />

                    <Text style={styles.fieldLabel}>Rate</Text>
                    {renderRateToggle(DAILY_RATE_OPTIONS)}
                  </>
                )}

                {/* Common: Description */}
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                  placeholder="Describe the role..."
                />

                {/* Cancel edit — returns to read view without saving */}
                <TouchableOpacity
                  style={styles.cancelEditBtn}
                  onPress={() => setIsEditing(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelEditText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default AvailabilityDetailModal;
