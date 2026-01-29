

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, CircleDollarSign } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './FulltimeStyle';
import { createJob } from '../../services/jobs';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';


const FullTimeAvailabilityCreation = () => {
    const navigation = useNavigation<any>();

    // State for all input fields
    const [position, setPosition] = useState('');
    const [city, setCity] = useState('');
    const [salary, setSalary] = useState('');
    const [daysPerWeek, setDaysPerWeek] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const queryClient = useQueryClient();
    const handlePostJob = async () => {
        try {
            await createJob({
                title: position || 'No Position',
                type: 'fulltime',
                description: description || 'No description provided.',
                location: city ? [city] : [],
                rate: { amount: Number(salary.replace(/\D/g, '')) || 0, unit: 'year' },
                positions: { total: Number(daysPerWeek) || 0, filled: 0 },
                visibility: { priority: 'active', creditUsed: 0, consumed: 0, withdrawn: 0 },
            });
            Toast.show({
                type: 'success',
                text1: 'Job Posted',
                text2: 'Your full-time job has been posted successfully.',
            });
            queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
            navigation.goBack();
        } catch (e) {
            console.log(e)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'An error occurred while posting your job.',
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.HeaderWrapper}>
                    <ArrowLeft color='#fff' onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Create Availability</Text>
                    <View />
                </View>

                {/* Posting Fee Card */}
                <View style={styles.feeCard}>
                    <View style={styles.iconTextRow}>
                        <CircleDollarSign size={26} color="#F5C400" />
                        <View style={styles.textWrapper}>
                            <Text style={styles.feeTitle}>Posting Fee</Text>
                            <Text style={styles.feeText}>
                                Posting a full-time job costs{' '}
                                <Text style={styles.bold}>1 credit</Text>.{'\n'}
                                You have 3 credits remaining in your balance.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.singleBorder} />

                    <TouchableOpacity style={styles.linkRow}>
                        <Text style={styles.link}>View Membership Benefits</Text>
                        <ArrowRight size={18} color="#D4AF37" />
                    </TouchableOpacity>
                </View>

                {/* Job Details */}
                <Text style={styles.sectionTitle}>Job Details</Text>

                <Text style={styles.label}>Position</Text>
                <TextInput
                    placeholder="Select Position"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={position}
                    onChangeText={setPosition}
                />

                <Text style={styles.label}>City</Text>
                <TextInput
                    placeholder="E.g. New York, NY"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={city}
                    onChangeText={setCity}
                />

                <View style={styles.row}>
                    <View style={styles.flex}>
                        <Text style={styles.label}>Salary</Text>
                        <TextInput
                            placeholder="65k/Yr"
                            placeholderTextColor="#9CA3AF"
                            style={styles.input}
                            value={salary}
                            onChangeText={setSalary}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.flex}>
                        <Text style={styles.label}>Days / Week</Text>
                        <TextInput
                            placeholder="5 Days"
                            placeholderTextColor="#9CA3AF"
                            style={styles.input}
                            value={daysPerWeek}
                            onChangeText={setDaysPerWeek}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* About */}
                <Text style={styles.sectionTitle}>About This Role</Text>
                <Text style={styles.label}>Job Description</Text>
                <TextInput
                    placeholder="Describe the responsibilities and day-to-day tasks..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.textArea}
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                {/* Contact */}
                <Text style={styles.sectionTitle}>Contact Info</Text>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    placeholder="Alex@Bristo.com"
                    placeholderTextColor="#9CA3AF"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TouchableOpacity style={styles.button} onPress={handlePostJob}>
                    <Text style={styles.buttonText}>Post Job Now</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default FullTimeAvailabilityCreation;
