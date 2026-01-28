
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
import AvailabilityPrice from '../../components/availiability/AvailabilityPrice';
import { createJob } from '../../services/jobs';

const SeasonalAvailabilityCreationScreen = () => {
    const navigation = useNavigation<any>();
    const queryClient = useQueryClient();
    // States
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hourlyPrice, setHourlyPrice] = useState('0');
    const [locations, setLocations] = useState<string[]>([]);
    const [newLocation, setNewLocation] = useState('');
    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<string[]>([]);
    const [aboutText, setAboutText] = useState('');
    const [title, setTitle] = useState('');

    // Helpers
    const addLocation = () =>
        addItemToList(newLocation, setNewLocation, setLocations);
    const removeLocation = (index: number) =>
        removeItemFromList(index, setLocations);

    const addCategory = () =>
        addItemToList(categoryInput, setCategoryInput, setCategories);
    const removeCategory = (index: number) =>
        removeItemFromList(index, setCategories);

    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month} ${day},\n${year}`;
    };

    const handleGoBack = () => navigation.goBack();
    // priority status based on end date
    const getPriorityStatus = () => {
        const now = new Date();
        const end = new Date(endDate);
        if (now > end) return 'expired';
        return 'active';
    };

    // Mutation for posting job
    const mutation = useMutation({
        mutationFn: () =>
            createJob({
                title,
                type: 'seasonal',
                description: aboutText,
                bannerImage: bannerImage || '',
                schedule: {
                    start: `${startDate}T00:00:00Z`,
                    end: `${endDate}T23:59:59Z`,
                },
                location: locations,
                rate: {
                    amount: hourlyPrice ? parseFloat(hourlyPrice) : 0,
                    unit: 'hour',
                },
                requiredSkills: categories,
                positions: { total: 5, filled: 0 },
                visibility: {
                    priority: getPriorityStatus(),
                    creditUsed: 0,
                    consumed: 0,
                    withdrawn: 0,
                },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
            Toast.show({
                type: 'success',
                text1: 'Job Posted',
                text2: 'Your job has been posted successfully.',
            });
            navigation.goBack();
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: 'Error posting job',
                text2: error?.message || 'Something went wrong',
            });
        },
    });

    const handlePost = () => {
        if (!title.trim()) {
            Toast.show({ type: 'error', text1: 'Title required' });
            return;
        }

        if (!startDate || !endDate) {
            Toast.show({ type: 'error', text1: 'Please select start and end dates' });
            return;
        }
        if (categories.length === 0) {
            Toast.show({ type: 'error', text1: 'Please add skill' });
            return;
        }

        mutation.mutate();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Create Availability</Text>

                <TouchableOpacity onPress={handlePost} activeOpacity={0.7}>
                    <Text style={styles.postText}>Post</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <AvailiablityHeading setTitle={setTitle} />

                {/* Banner Upload */}
                <UploadBanner bannerImage={bannerImage} setBannerImage={setBannerImage} />

                {/* Hourly price */}
                <AvailabilityPrice price={hourlyPrice} setPrice={setHourlyPrice} />

                {/* Availability dates */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>
                    <View style={styles.dateRow}>
                        <View style={styles.dateCard}>
                            <CalendarIcon color="#fff" size={24} />
                            <Text style={styles.dateValue}>{formatDateDisplay(startDate)}</Text>
                        </View>

                        <View style={styles.dateCard}>
                            <CalendarIcon color="#fff" size={24} />
                            <Text style={styles.dateValue}>{formatDateDisplay(endDate)}</Text>
                        </View>
                    </View>
                </View>

                <CalenderCompo
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />

                {/* Categories */}
                <AvailiabilityCategory
                    categoryInput={categoryInput}
                    setCategoryInput={setCategoryInput}
                    categories={categories}
                    removeCategory={removeCategory}
                    addCategory={addCategory}
                />

                {/* Locations */}
                <AvilabilityLocation
                    newLocation={newLocation}
                    setNewLocation={setNewLocation}
                    locations={locations}
                    removeLocation={removeLocation}
                    addLocation={addLocation}
                />

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About You</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Describe your experience..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        value={aboutText}
                        onChangeText={setAboutText}
                        textAlignVertical="top"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SeasonalAvailabilityCreationScreen;
