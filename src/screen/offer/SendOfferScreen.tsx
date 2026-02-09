import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import { X, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from './SendOver';
import StarIcon from '../../components/svg/StarIcon';
import MapView, { Marker } from 'react-native-maps';
import { useMutation } from '@tanstack/react-query';
import { sendOffer } from '../../services/offer';

const SendOfferScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { worker } = route.params;

  // --------------------------
  // Dynamic worker info
  // --------------------------
  const workerName = worker?.user?.name || 'Unknown Worker';
  const workerPhoto =
    worker?.user?.photo || 'https://i.pravatar.cc/150?u=default';
  const workerRating = worker?.user?.rating ?? 0;
  const workerTitle = worker?.title || 'No Title';
  const workerLocation =
    worker?.location?.length > 0 ? worker.location[0] : 'No Location';

  // --------------------------
  // Inputs (editable)
  // --------------------------
  const [shiftDate, setShiftDate] = useState<string>('Oct 24, 2023');
  const [startTime, setStartTime] = useState<string>('18:00');
  const [endTime, setEndTime] = useState<string>('02:00');

  const [hourlyRate, setHourlyRate] = useState<string>('25');
  const [hours, setHours] = useState<string>('8');

  const [context, setContext] = useState<string>('');

  // --------------------------
  // Estimated Total
  // --------------------------
  const estimatedTotal = useMemo(() => {
    const rate = Number(hourlyRate);
    const totalHours = Number(hours);

    if (isNaN(rate) || isNaN(totalHours)) return 0;

    return rate * totalHours;
  }, [hourlyRate, hours]);

  // --------------------------
  // Mutation (Tanstack Query)
  // --------------------------
  const { mutate: sendOfferMutation, isPending } = useMutation({
    mutationFn: sendOffer,
    onSuccess: () => {
      const msg = `Offer sent to ${workerName}`;

      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          msg,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else {
        Alert.alert('Success', msg);
      }

      navigation.goBack();
    },
    onError: (error: any) => {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          error?.message || 'Offer failed',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else {
        Alert.alert('Error', error?.message || 'Offer failed');
      }
    },
  });

  // --------------------------
  // Submit offer
  // --------------------------
  const handleSendEngagement = () => {
    if (!shiftDate.trim()) {
      return Alert.alert('Error', 'Shift date is required');
    }

    if (!startTime.trim()) {
      return Alert.alert('Error', 'Start time is required');
    }

    if (!endTime.trim()) {
      return Alert.alert('Error', 'End time is required');
    }

    if (!hourlyRate.trim() || Number(hourlyRate) <= 0) {
      return Alert.alert('Error', 'Hourly rate must be valid');
    }

    if (!hours.trim() || Number(hours) <= 0) {
      return Alert.alert('Error', 'Hours must be valid');
    }

    if (!context.trim()) {
      return Alert.alert('Error', 'Job context is required');
    }

    // schedule string
    const schedule = `${shiftDate} | ${startTime} - ${endTime}`;

    sendOfferMutation({
      applicationId: worker?.id,
      jobId: worker?.id,
      workerId: worker?.userId,
      rate: Number(hourlyRate),
      schedule,
      location: workerLocation,
      message: context,
    });
  };

  // --------------------------
  // Google Map dummy lat/lng
  // (later worker doc e latitude/longitude add korte hobe)
  // --------------------------
  const defaultLat = 48.8738;
  const defaultLng = 2.295;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X color="#FFFFFF" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Offer</Text>
        <View />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Worker Card */}
        <View style={styles.card}>
          <Image source={{ uri: workerPhoto }} style={styles.avatar} />
          <View>
            <Text style={styles.labelSmall}>Sending Offer To</Text>
            <Text style={styles.name}>{workerName}</Text>

            <View style={styles.rowAlign}>
              <Text style={styles.rating}>{workerRating}</Text>
              <StarIcon width={16} height={16} />
              <Text style={styles.role}> • {workerTitle}</Text>
            </View>
          </View>
        </View>

        {/* Shift Details: Date */}
        <Text style={styles.sectionTitle}>Shift Details</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.inputText}
            value={shiftDate}
            onChangeText={setShiftDate}
            placeholder="Shift Date"
            placeholderTextColor="rgba(245,245,245,0.5)"
          />
        </View>

        {/* Shift Details: Time */}
        <View style={styles.row}>
          <View style={styles.inputBox}>
            <TextInput
              style={[styles.inputText, styles.inputTexttime]}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="Start"
              placeholderTextColor="rgba(245,245,245,0.5)"
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={[styles.inputText, styles.inputTexttime]}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="End"
              placeholderTextColor="rgba(245,245,245,0.5)"
            />
          </View>
        </View>

        {/* Shift Details: Money */}
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={[styles.card, styles.shiftCard]}>
          <Text style={styles.labelRate}>Hourly Rate</Text>

          <View>
            <View style={styles.shiftWrapper}>
              <View style={styles.rateInputContainer}>
                <TextInput
                  style={styles.rateInput}
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                  keyboardType="numeric"
                  placeholder="Rate"
                  placeholderTextColor="#555"
                />
              </View>

              <Text style={styles.mathText}>×</Text>

              <TextInput
                style={styles.hoursText}
                value={hours}
                onChangeText={setHours}
                keyboardType="numeric"
                placeholder="Hours"
                placeholderTextColor="rgba(245,245,245,0.4)"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.shiftPrice}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>€{estimatedTotal}</Text>
            </View>
          </View>
        </View>

        {/* Location Section */}
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <TouchableOpacity style={styles.locationLabelBox}>
            <Text style={[styles.inputText, styles.buttonText]}>
              {workerLocation}
            </Text>
          </TouchableOpacity>

          {/* Google Map (design same frame) */}
          <View style={styles.mapFrame}>
            <MapView
              style={styles.webview} // same style use korlam
              initialRegion={{
                latitude: defaultLat,
                longitude: defaultLng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
            >
              <Marker
                coordinate={{ latitude: defaultLat, longitude: defaultLng }}
              />
            </MapView>
          </View>
        </View>

        {/* Job Context */}
        <Text style={styles.sectionTitle}>Job Context</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.contextInput}
            multiline
            placeholder="Describe the role briefly..."
            placeholderTextColor="rgba(245, 245, 245, 0.6)"
            maxLength={200}
            value={context}
            onChangeText={setContext}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity
          onPress={handleSendEngagement}
          style={[styles.sendButton, isPending && { opacity: 0.6 }]}
          disabled={isPending}
        >
          <Text style={styles.sendButtonText}>
            {isPending ? 'Sending...' : 'Send Offer'}
          </Text>
          <ArrowRight color="#000" size={24} strokeWidth={3} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOfferScreen;
