import React, { useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import {
    X,
    BriefcaseBusiness,
    CircleCheck,
    Calendar as CalendarIcon,
    File,
    Eye,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { Alert } from 'react-native';
import { ToastAndroid, Platform } from 'react-native';
type MarkedDates = {
    [key: string]: {
        selected?: boolean;
        startingDay?: boolean;
        endingDay?: boolean;
        color?: string;
        textColor?: string;
    };
};

const SeosonalAvailabilityCreationScreen = () => {
    const navigation = useNavigation();
    const [startDate, setStartDate] = useState('2025-02-03');
    const [endDate, setEndDate] = useState('2025-02-07');
    const [locations, setLocations] = useState([
        'San Francisco, CA',
        'Mykonos, Gr',
        'New York, NY',
        'Austin, TX',
    ]);
    const [aboutText, setAboutText] = useState('');
    const [isActive, setIsActive] = useState(true);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const removeLocation = (index: number) => {
        const updatedLocations = locations.filter((_, i) => i !== index);
        setLocations(updatedLocations);
    };

    const getMarkedDates = (): MarkedDates => {
        const marked: MarkedDates = {};

        if (!startDate || !endDate) return marked;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const current = new Date(start);

        while (current <= end) {
            const dateStr = current.toISOString().split('T')[0];

            if (dateStr === startDate && dateStr === endDate) {
                marked[dateStr] = {
                    selected: true,
                    color: '#FFD900',
                    textColor: '#111111',
                    startingDay: true,
                    endingDay: true,
                };
            } else if (dateStr === startDate) {
                marked[dateStr] = {
                    selected: true,
                    color: '#FFD900',
                    textColor: '#111111',
                    startingDay: true,
                };
            } else if (dateStr === endDate) {
                marked[dateStr] = {
                    selected: true,
                    color: '#FFD900',
                    textColor: '#111111',
                    endingDay: true,
                };
            } else {
                marked[dateStr] = {
                    selected: true,
                    color: '#FFD900',
                    textColor: '#111111',
                };
            }

            current.setDate(current.getDate() + 1);
        }

        return marked;
    };

    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month} ${day},\n${year}`;
    };

    const handleTost = () => {
        const message = 'Engagement request sent successfully.';

        if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(
                message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        } else {
            Alert.alert('Success', message);
        }

        navigation.goBack();
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Create Availability</Text>
                <TouchableOpacity onPress={handleTost} activeOpacity={0.7}>
                    <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Job Details</Text>
                    <Text style={styles.subsectionTitle}>Target Position</Text>
                    <View style={styles.jobCard}>
                        <BriefcaseBusiness width={20} height={20} color="#FFFFFF" />
                        <Text style={styles.jobText}>Head Mixologist</Text>
                        <CircleCheck width={20} height={20} color="#FFD900" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>
                    <View style={styles.labeldateRow}>
                        <Text style={styles.dateLabel}>Start Date</Text>
                        <Text style={styles.dateLabel}>End Date</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <View style={styles.dateCard}>
                            <CalendarIcon width={24} height={24} color="#ffffff" />
                            <View style={styles.dateInfo}>
                                <Text style={styles.dateValue}>{formatDateDisplay(startDate)}</Text>
                            </View>
                        </View>

                        <View style={styles.dateCard}>
                            <CalendarIcon width={24} height={24} color="#ffffff" />
                            <View style={styles.dateInfo}>
                                <Text style={styles.dateValue}>{formatDateDisplay(endDate)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.calendarContainer}>
                    <Calendar
                        current="2025-02-01"
                        markingType="period"
                        markedDates={getMarkedDates()}
                        onDayPress={(day) => {
                            if (!startDate || (startDate && endDate)) {
                                setStartDate(day.dateString);
                                setEndDate('');
                            } else {
                                if (new Date(day.dateString) < new Date(startDate)) {
                                    setStartDate(day.dateString);
                                } else {
                                    setEndDate(day.dateString);
                                }
                            }
                        }}
                        theme={{
                            calendarBackground: '#1E1E1E',
                            textSectionTitleColor: '#FFD900',
                            selectedDayBackgroundColor: '#FFD900',
                            selectedDayTextColor: '#111111',
                            todayTextColor: '#FFD900',
                            dayTextColor: '#FFFFFF',
                            textDisabledColor: '#666666',
                            monthTextColor: '#FFFFFF',
                            textMonthFontFamily: 'InterDisplayMedium',
                            textDayFontFamily: 'InterDisplayRegular',
                            textMonthFontWeight: '500' as any,
                            textDayFontWeight: '400' as any,
                            textDayHeaderFontFamily: 'InterDisplayMedium',
                            arrowColor: '#FFD900',
                            textDayHeaderFontSize: 18,
                        }}
                        style={{
                            borderRadius: 16,
                            padding: 10,
                        }}
                    />

                    <View style={styles.calendarActions}>
                        <TouchableOpacity
                            style={styles.calendarCancelBtn}
                            activeOpacity={0.7}
                            onPress={() => {
                                setStartDate('2025-02-03');
                                setEndDate('2025-02-07');
                            }}
                        >
                            <Text style={styles.calendarCancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.calendarDoneBtn} activeOpacity={0.7}>
                            <Text style={styles.calendarDoneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <Text style={styles.subsectionTitle}>Preferred Location</Text>
                    <View style={styles.locationsContainer}>
                        {locations &&
                            locations.length > 0 &&
                            locations.map((location, index) => (
                                <View key={index} style={styles.locationChip}>
                                    <Text style={styles.locationText}>{location}</Text>
                                    <TouchableOpacity
                                        onPress={() => removeLocation(index)}
                                        activeOpacity={0.7}
                                    >
                                        <X width={16} height={16} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About You</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Describe your experience and what makes you perfect for this role..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={6}
                        value={aboutText}
                        onChangeText={setAboutText}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Resume/CV</Text>
                    <View style={styles.fileCard}>
                        <View style={styles.fileLeft}>
                            <View style={styles.fileIcon}>
                                <File width={24} height={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.fileName}>Alex_mixologist_cv_2025.Pdf</Text>
                                <Text style={styles.fileSubtext}>Uploaded 2 days ago</Text>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.7}>
                            <X width={20} height={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.toggleCard}>
                        <View style={styles.toggleLeft}>
                            <View style={styles.fileIcon}>
                                <Eye width={24} height={24} color="#fff" />
                            </View>
                            <View>
                                <Text style={styles.toggleTitle}>Active Post</Text>
                                <Text style={styles.toggleSubtext}>
                                    Immediately Visible To Employers
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isActive}
                            onValueChange={setIsActive}
                            trackColor={{ false: '#2A2A2A', true: '#FFD900' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SeosonalAvailabilityCreationScreen;