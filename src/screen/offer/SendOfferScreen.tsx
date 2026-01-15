import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from './SendOver';
import StarIcon from '../../components/svg/StarIcon';

const SendOfferScreen: React.FC = () => {
  const [hourlyRate, setHourlyRate] = useState<string>('25.00');
  const [context, setContext] = useState<string>('');
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; background: #1A1A1A; }
          #map { height: 100vh; width: 100vw; }
          .leaflet-control-attribution { display: none !important; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', {zoomControl: false}).setView([48.8738, 2.2950], 15);
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
          L.marker([48.8738, 2.2950]).addTo(map);
        </script>
      </body>
    </html>
  `;
  const navigation = useNavigation<any>();
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
        <View style={styles.card}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?u=jackson' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.labelSmall}>Sending Offer To</Text>
            <Text style={styles.name}>Anik</Text>
            <View style={styles.rowAlign}>
              <Text style={styles.rating}>4.9</Text>
              <StarIcon width={16} height={16} />
              <Text style={styles.role}> • Bartender</Text>
            </View>
          </View>
        </View>

        {/* Shift Details: Date/Time */}
        <Text style={styles.sectionTitle}>Shift Details</Text>
        <View style={styles.inputBox}>
          <Text style={styles.inputText}>Oct 24, 2023</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.inputBox}>
            <Text style={[styles.inputText, styles.inputTexttime]}>18:00</Text>
          </View>
          <View style={styles.inputBox}>
            <Text style={[styles.inputText, styles.inputTexttime]}>02:00</Text>
          </View>
        </View>

        {/* Shift Details: Money */}
        <Text style={styles.sectionTitle}>Shift Details</Text>
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
                  placeholderTextColor="#555"
                />
              </View>
              <TouchableOpacity>
                <Text style={styles.mathText}>×</Text>
              </TouchableOpacity>
              <Text style={styles.hoursText}>8hrs</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.shiftPrice}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>€2500</Text>
            </View>
          </View>
        </View>

        {/* Location Section - FREE MAP */}
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.mapContainer}>
          <TouchableOpacity style={styles.locationLabelBox}>
            <Text style={[styles.inputText, styles.buttonText]}>
              The Grand Hotel, Downtown
            </Text>
          </TouchableOpacity>
          <View style={styles.mapFrame}>
            <WebView
              originWhitelist={['*']}
              source={{ html: mapHtml }}
              style={styles.webview}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* Job Context */}
        <Text style={styles.sectionTitle}>Job Context</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.contextInput}
            multiline
            placeholder="Describe the role briefly (e.g., Private event bartender needed for cocktail service… 0/200"
            placeholderTextColor="rgba(245, 245, 245, 0.6)"
            maxLength={200}
            value={context}
            onChangeText={setContext}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send Offer</Text>
          <ArrowRight color="#000" size={24} strokeWidth={3} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOfferScreen;
