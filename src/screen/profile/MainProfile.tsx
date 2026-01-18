import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraIcon, MapPin, Plus, } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import styles from './mainProfileStyle';
import { useNavigation } from '@react-navigation/native';



const MainProfile: React.FC = () => {
    const [about, setAbout] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [openToWork, setOpenToWork] = useState(true);
    const [photo, setPhoto] = useState<string | null>(null);

    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
            if (res.assets && res.assets[0]?.uri) {
                setPhoto(res.assets[0].uri);
            }
        });
    };

    const addSkill = () => {
        if (!skillInput.trim()) return;
        setSkills(prev => [...prev, skillInput.trim()]);
        setSkillInput('');
    };
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>

                    {/* Header */}
                    <Text style={styles.headerTitle}>Edit Profile</Text>

                    {/* Photo */}
                    <View style={styles.photoSection}>
                        <TouchableOpacity onPress={pickImage}>
                            <View style={styles.avatar}>
                                {photo ? (
                                    <Image source={{ uri: photo }} style={styles.avatarImage} />
                                ) : (
                                    <Image source={{ uri: 'https://thumbs.dreamstime.com/b/handsome-stylish-modern-african-american-business-man-entrepreneur-executive-sitting-outside-office-cheerful-smile-155856257.jpg' }} style={styles.avatarImage} />
                                )}
                                <View style={styles.cameraIcon}>
                                    <CameraIcon size={24} color="#1F2937" />
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.uploadText}>Upload Photo</Text>
                        <Text style={styles.subText}>Make A Great First Impression</Text>
                    </View>

                    {/* About */}
                    <Text style={styles.label}>About Me</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Tell employer about your experience..."
                        placeholderTextColor="#fff"
                        value={about}
                        onChangeText={setAbout}
                        multiline
                        maxLength={300}
                    />
                    <Text style={styles.counter}>{about.length}/300</Text>

                    {/* City */}
                    <Text style={styles.label}>Base City</Text>
                    <View style={styles.inputWithIcon}>
                        <View>
                            <Text style={styles.flexInput}>San Francisco, CA</Text>
                        </View>
                        <MapPin size={24} color="#374151" />
                    </View>

                    {/* Skills */}
                    {/* Skills header */}
                    <View style={styles.rowBetween}>
                        <Text style={[styles.label, styles.skillLabel]}>Skills & Expertise</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Skill input */}
                    <View style={styles.skillInputWrapper}>
                        <TextInput
                            style={styles.skillInput}
                            placeholder="Add A Skill (E.G. Barista)"
                            placeholderTextColor="#9CA3AF"
                            value={skillInput}
                            onChangeText={setSkillInput}
                        />
                        <TouchableOpacity
                            style={styles.plusIcon}
                            onPress={addSkill}
                            onPressIn={() => navigation.navigate('role')}
                        >
                            <Plus size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>


                    <View style={styles.skillWrap}>
                        {skills.map((skill, index) => (
                            <View key={index} style={styles.skillChip}>
                                <Text style={styles.skillText}>{skill}</Text>
                            </View>
                        ))}
                    </View>


                    {/* Open To Work */}
                    <View style={styles.switchRow}>
                        <View>
                            <Text style={[styles.label, styles.openToWorkText]}>Open To Work</Text>
                            <Text style={styles.subText}>Show Employer You Are Available</Text>
                        </View>

                        <Switch
                            value={openToWork}
                            onValueChange={setOpenToWork}
                            trackColor={{ false: '#515E72', true: '#515E72' }}
                            thumbColor="#FFFFFF"
                            style={styles.bigSwitch}
                        />
                    </View>


                    {/* Save */}
                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveText}>Save Profile</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MainProfile;