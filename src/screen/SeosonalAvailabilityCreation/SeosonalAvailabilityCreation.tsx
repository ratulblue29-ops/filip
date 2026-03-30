import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import styles from './style';

import CalenderCompo from '../../components/availiability/CalendarCompo';
import AvailiablityHeading from '../../components/availiability/AvailiablityHeading';
import AvilabilityLocation from '../../components/availiability/AvilabilityLocation';
import AvailiabilityCategory from '../../components/availiability/AvailiabilityCategory';
import { addItemToList, removeItemFromList } from '../../helper/listHelper';
import UploadBanner from '../../components/availiability/UploadBanner';
import { createJob } from '../../services/jobs';
import { uploadJobBanner } from '../../services/uploadPhoto';
import { useTranslation } from 'react-i18next';

// Workplace options for toggle selector
// const WORKPLACE_OPTIONS = ['On-site', 'Remote', 'Hybrid'] as const;
// type WorkplaceType = (typeof WORKPLACE_OPTIONS)[number];

// Rate type options for toggle selector
const RATE_OPTIONS = ['hourly', 'daily', 'monthly'] as const;
type RateType = (typeof RATE_OPTIONS)[number];

// Minimum character count required for about section
const ABOUT_MIN_CHARS = 30;

const SeasonalAvailabilityCreationScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();

  // — Banner
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  // — Dates
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // — Rate
  const [rateType, setRateType] = useState<RateType>('hourly');
  const [rateAmount, setRateAmount] = useState('');

  // — Workplace & position
  // const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('On-site');
  // const [targetPosition, setTargetPosition] = useState('');

  // — Locations
  const [locations, setLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState('');

  // — Skills
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  // — About & title
  const [aboutText, setAboutText] = useState('');
  const [title, setTitle] = useState('');

  // — Inline field errors (keyed by field name)
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const addLocation = () =>
    addItemToList(newLocation, setNewLocation, setLocations);

  const removeLocation = (index: number) =>
    removeItemFromList(index, setLocations);

  const addCategory = () =>
    addItemToList(categoryInput, setCategoryInput, setCategories);

  const removeCategory = (index: number) =>
    removeItemFromList(index, setCategories);

  // Clears a specific field error when user starts editing
  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '--';
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day},\n${year}`;
  };

  const handleGoBack = () => navigation.goBack();

  // ─── Mutation ────────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: async () => {
      let finalBannerImage = '';

      // Upload local image if one was selected from device
      if (bannerImage && bannerImage.startsWith('file://')) {
        finalBannerImage = await uploadJobBanner(bannerImage);
      }

      return createJob({
        title,
        type: 'seasonal',
        description: aboutText,
        bannerImage: finalBannerImage,
        schedule: {
          start: `${startDate}T00:00:00Z`,
          end: `${endDate}T23:59:59Z`,
        },
        location: locations,
        rate: {
          amount: rateAmount ? parseFloat(rateAmount) : 0,
          unit: rateType,
        },
        requiredSkills: categories,
        positions: { total: 5, filled: 0 },
        // New required fields per client spec
        // workplaceType,
        // targetPosition,
        currency: 'EUR',
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      Toast.show({
        type: 'success',
        text1: t('seasonal_creation.toast_posted'),
        text2: t('seasonal_creation.toast_posted_sub'),
      });
      navigation.goBack();
    },

    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: t('seasonal_creation.toast_error'),
        text2: error?.message || t('seasonal_creation.toast_error_sub'),
      });
    },
  });

  // ─── Validation ──────────────────────────────────────────────────────────────

  const handlePost = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = t('seasonal_creation.error_title');
    }

    // if (!targetPosition.trim()) {
    //   newErrors.targetPosition = 'Target position is required';
    // }

    if (!startDate || !endDate) {
      newErrors.dates = t('seasonal_creation.error_dates');
    } else if (new Date(startDate) > new Date(endDate)) {
      newErrors.dates = t('seasonal_creation.error_dates_order');
    }

    if (categories.length === 0) {
      newErrors.skills = t('seasonal_creation.error_skills');
    }

    if (locations.length === 0) {
      newErrors.locations = t('seasonal_creation.error_locations');
    }

    if (!rateAmount || parseFloat(rateAmount) <= 0) {
      newErrors.rate = t('seasonal_creation.error_rate');
    }

    if (aboutText.trim().length < ABOUT_MIN_CHARS) {
      newErrors.about = t('seasonal_creation.error_about', { min: ABOUT_MIN_CHARS });
    }

    setErrors(newErrors);

    // Block submission if any errors exist
    if (Object.keys(newErrors).length > 0) return;

    mutation.mutate();
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <Text style={styles.cancelText}>{t('seasonal_creation.cancel')}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('seasonal_creation.title')}</Text>

        <TouchableOpacity
          onPress={handlePost}
          activeOpacity={0.7}
          disabled={mutation.isPending}
        >
          <Text style={styles.postText}>
            {mutation.isPending ? t('seasonal_creation.posting') : t('seasonal_creation.post')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Title ── */}
        <AvailiablityHeading
          setTitle={val => {
            setTitle(val);
            clearError('title');
          }}
        />
        {errors.title ? (
          <Text style={styles.fieldError}>{errors.title}</Text>
        ) : null}

        {/* ── Target Position ── */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Target Position</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Barista, Waiter, Event Staff"
            placeholderTextColor="#9CA3AF"
            value={targetPosition}
            onChangeText={t => {
              setTargetPosition(t);
              clearError('targetPosition');
            }}
          />
          {errors.targetPosition ? (
            <Text style={styles.fieldError}>{errors.targetPosition}</Text>
          ) : null}
        </View> */}

        {/* ── Banner Upload (optional) ── */}
        <UploadBanner
          bannerImage={bannerImage}
          setBannerImage={setBannerImage}
        />

        {/* ── Workplace Type ── */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workplace Type</Text>
          <View style={styles.toggleGroup}>
            {WORKPLACE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.toggleBtn,
                  workplaceType === option && styles.toggleBtnActive,
                ]}
                onPress={() => setWorkplaceType(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.toggleBtnText,
                    workplaceType === option && styles.toggleBtnTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* ── Rate Type + Amount ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('seasonal_creation.section_rate')}</Text>

          {/* Rate type selector */}
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

          {/* EUR currency input — currency is hardcoded to EUR per spec */}
          <View style={styles.currencyRow}>
            <Text style={styles.currencyBadge}>EUR</Text>
            <TextInput
              style={styles.currencyInput}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={rateAmount}
              onChangeText={val => {
                setRateAmount(val);
                clearError('rate');
              }}
            />
          </View>
          {errors.rate ? (
            <Text style={styles.fieldError}>{errors.rate}</Text>
          ) : null}
        </View>

        {/* ── Availability Dates ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('seasonal_creation.section_availability')}</Text>

          <View style={styles.dateRow}>
            <View style={styles.dateCard}>
              <CalendarIcon color="#fff" size={24} />
              <Text style={styles.dateValue}>
                {formatDateDisplay(startDate)}
              </Text>
            </View>

            <View style={styles.dateCard}>
              <CalendarIcon color="#fff" size={24} />
              <Text style={styles.dateValue}>{formatDateDisplay(endDate)}</Text>
            </View>
          </View>

          {errors.dates ? (
            <Text style={styles.fieldError}>{errors.dates}</Text>
          ) : null}
        </View>

        <CalenderCompo
          startDate={startDate}
          endDate={endDate}
          setStartDate={(d: string) => {
            setStartDate(d);
            clearError('dates');
          }}
          setEndDate={(d: string) => {
            setEndDate(d);
            clearError('dates');
          }}
        />

        {/* ── Skills ── */}
        <AvailiabilityCategory
          categoryInput={categoryInput}
          setCategoryInput={setCategoryInput}
          categories={categories}
          removeCategory={removeCategory}
          addCategory={() => {
            addCategory();
            clearError('skills');
          }}
        />
        {errors.skills ? (
          <Text style={styles.fieldError}>{errors.skills}</Text>
        ) : null}

        {/* ── Preferred Locations ── */}
        <AvilabilityLocation
          newLocation={newLocation}
          setNewLocation={setNewLocation}
          locations={locations}
          removeLocation={removeLocation}
          addLocation={() => {
            addLocation();
            clearError('locations');
          }}
        />
        {errors.locations ? (
          <Text style={styles.fieldError}>{errors.locations}</Text>
        ) : null}

        {/* ── About You ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('seasonal_creation.section_about')}</Text>
          <TextInput
            style={styles.textArea}
            placeholder={t('seasonal_creation.about_placeholder')}
            placeholderTextColor="#9CA3AF"
            multiline
            value={aboutText}
            onChangeText={val => {
              setAboutText(val);
              clearError('about');
            }}
            textAlignVertical="top"
          />
          {/* Character count feedback so user knows min requirement */}
          <Text style={styles.charCount}>
            {aboutText.trim().length}/{ABOUT_MIN_CHARS} min
          </Text>
          {errors.about ? (
            <Text style={styles.fieldError}>{errors.about}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeasonalAvailabilityCreationScreen;
