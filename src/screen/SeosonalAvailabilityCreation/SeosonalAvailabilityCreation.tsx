
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
import { X, Calendar as CalendarIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';

import { getAuth } from '@react-native-firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
} from '@react-native-firebase/firestore';

import CalenderCompo from '../../components/availiability/CalendarCompo';
// import Resume from '../../components/availiability/Resume';
import Active from '../../components/availiability/Active';
import AvailiablityHeading from '../../components/availiability/AvailiablityHeading';
import Toast from 'react-native-toast-message';
import AvilabilityLocation from '../../components/availiability/AvilabilityLocation';
import AvailiabilityCategory from '../../components/availiability/AvailiabilityCategory';
import { addItemToList, removeItemFromList } from '../../helper/listHelper';
import UploadBanner from '../../components/availiability/UploadBanner';

const SeosonalAvailabilityCreationScreen = () => {
    const navigation = useNavigation<any>();
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('2025-02-03');
    const [endDate, setEndDate] = useState('2025-02-07');

    const [locations, setLocations] = useState<string[]>([]);
    const [newLocation, setNewLocation] = useState('');

    const [categoryInput, setCategoryInput] = useState('');
    const [categories, setCategories] = useState<string[]>([]);

    const [aboutText, setAboutText] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [title, setTitle] = useState('');

    const authInstance = getAuth();
    const db = getFirestore();

    const handleGoBack = () => navigation.goBack();

    /* LOCATION */
    const addLocation = () =>
        addItemToList(newLocation, setNewLocation, setLocations);

    const removeLocation = (index: number) =>
        removeItemFromList(index, setLocations);


    /*CATEGORY */
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

    /* FIREBASE JOB POST*/
    const handleTost = async () => {
        try {
            const user = authInstance.currentUser;

            if (!user) {
                Toast.show({
                    type: 'error',
                    text1: 'User not authenticated',
                });
                return;
            }

            if (!title.trim()) {
                Toast.show({
                    type: 'error',
                    text1: 'Title required',
                });
                return;
            }

            if (categories.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'Please add a category',
                });
                return;
            }

            const jobPost = {
                userId: user.uid,
                title: title,
                category: categories[0],

                type: 'seasonal',

                description: aboutText || 'No description provided.',
                bannerImage: bannerImage || '',

                schedule: {
                    start: `${startDate}T18:00:00Z`,
                    end: `${endDate}T02:00:00Z`,
                },

                location: locations,

                rate: {
                    amount: 25,
                    unit: 'hour',
                },

                requiredSkills: ['Serving', 'Wine Knowledge'],

                positions: {
                    total: 5,
                    filled: 0,
                },

                status: isActive ? 'open' : 'cancelled',

                visibility: {
                    priority: false,
                    creditUsed: 0,
                },

                applicationsCount: 0,

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'jobs'), jobPost);

            Toast.show({
                type: 'success',
                text1: 'Job Posted',
                text2: 'Your job has been posted successfully.',
            });

            navigation.goBack();
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error posting job',
                text2: (error as Error).message,
            });
        }
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

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <AvailiablityHeading setTitle={setTitle} />
                {/* Banner Upload */}
                <UploadBanner bannerImage={bannerImage} setBannerImage={setBannerImage} />

                {/* Availability */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>

                    <View style={styles.dateRow}>
                        <View style={styles.dateCard}>
                            <CalendarIcon color="#fff" size={24} />
                            <Text style={styles.dateValue}>
                                {formatDateDisplay(startDate)}
                            </Text>
                        </View>

                        <View style={styles.dateCard}>
                            <CalendarIcon color="#fff" size={24} />
                            <Text style={styles.dateValue}>
                                {formatDateDisplay(endDate)}
                            </Text>
                        </View>
                    </View>
                </View>

                <CalenderCompo
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                />

                {/* Category */}
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

                {/* <Resume /> */}
                <Active isActive={isActive} setIsActive={setIsActive} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default SeosonalAvailabilityCreationScreen;
