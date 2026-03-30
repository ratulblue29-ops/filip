import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    CameraIcon,
    MapPin,
    User,
    Phone,
    ChevronDown,
} from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import {
    useQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { fetchCurrentUser, updateEmployerProfile } from '../../services/user';
import styles from './employerProfileStyle';
import { useTranslation } from 'react-i18next';

const EmployerProfile: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const [photo, setPhoto] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [about, setAbout] = useState('');
    const [address, setAddress] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const { data: user } = useQuery({
        queryKey: ['currentUser'],
        queryFn: fetchCurrentUser,
    });
    useEffect(() => {
        if (user) {
            setPhoto(user?.profile?.photo || null);
            setCompanyName(user?.profile?.companyName || '');
            setIndustry(user?.profile?.industry || '');
            setAbout(user?.profile?.about || '');
            setAddress(user?.employerProfile?.address || '');
            setContactName(user?.employerProfile?.contactName || '');
            setPhone(user?.employerProfile?.phone || '');
        }
    }, [user]);


    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, res => {
            if (res.assets?.[0]?.uri) {
                setPhoto(res.assets[0].uri);
            }
        });
    };

    // 🔥 employer profile update (SAFE mutation)
    const { mutate: saveProfile, isPending } = useMutation({
        mutationFn: updateEmployerProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            Toast.show({
                type: 'success',
                text1: t('employer_profile.toast_updated'),
                text2: t('employer_profile.toast_updated_sub'),
            });
        },
        onError: (err: any) => {
            Toast.show({
                type: 'error',
                text1: t('employer_profile.toast_failed'),
                text2: err.message || t('employer_profile.toast_failed_sub'),
            });
        },
    });

    const handleSave = () => {
        if (!companyName.trim()) {
            Toast.show({
                type: 'error',
                text1: t('employer_profile.toast_validation'),
                text2: t('employer_profile.toast_company_required'),
            });
            return;
        }

        saveProfile({
            photo,
            companyName,
            industry,
            about,
            address,
            contactName,
            phone,
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <Text style={styles.headerTitle}>{t('employer_profile.header')}</Text>

                {/* Photo */}
                <View style={styles.photoSection}>
                    <TouchableOpacity onPress={pickImage}>
                        <View style={styles.avatar}>
                            <Image
                                source={{
                                    uri:
                                        photo ||
                                        'https://static.vecteezy.com/system/resources/thumbnails/022/014/184/small/user-icon-member-login-isolated-vector.jpg',
                                }}
                                style={styles.avatarImage}
                            />
                            <View style={styles.cameraIcon}>
                                <CameraIcon size={22} color="#000" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text style={styles.uploadText}>{t('employer_profile.upload_photo')}</Text>
                    <Text style={styles.subText}>
                        {t('employer_profile.upload_sub')}
                    </Text>
                </View>

                {/* Company */}
                <Text style={styles.section}>{t('employer_profile.section_company')}</Text>

                <Text style={styles.label}>{t('employer_profile.label_company')}</Text>
                <TextInput
                    style={styles.input}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="The Grand Hotel"
                    placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>{t('employer_profile.label_industry')}</Text>
                <TouchableOpacity style={styles.dropdown}>
                    <Text style={styles.dropdownText}>
                        {industry || t('employer_profile.placeholder_industry')}
                    </Text>
                    <ChevronDown size={18} color="#9CA3AF" />
                </TouchableOpacity>

                <Text style={styles.label}>{t('employer_profile.label_about')}</Text>
                <TextInput
                    style={styles.textArea}
                    multiline
                    value={about}
                    onChangeText={setAbout}
                    placeholder={t('employer_profile.placeholder_about')}
                    placeholderTextColor="#9CA3AF"
                />

                {/* Location */}
                <Text style={styles.section}>{t('employer_profile.section_location')}</Text>

                <Text style={styles.label}>{t('employer_profile.label_address')}</Text>
                <View style={styles.iconInput}>
                    <MapPin size={18} color="#9CA3AF" />
                    <TextInput
                        style={styles.flexInput}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Street, City, Zip Code"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Contact */}
                <Text style={styles.section}>{t('employer_profile.section_contact')}</Text>

                <Text style={styles.label}>{t('employer_profile.label_contact')}</Text>
                <View style={styles.iconInput}>
                    <User size={18} color="#9CA3AF" />
                    <TextInput
                        style={styles.flexInput}
                        value={contactName}
                        onChangeText={setContactName}
                        placeholder={t('employer_profile.placeholder_contact')}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <Text style={styles.label}>{t('employer_profile.label_phone')}</Text>
                <View style={styles.iconInput}>
                    <Phone size={18} color="#9CA3AF" />
                    <TextInput
                        style={styles.flexInput}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="+1 (555) 000-0000"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Save */}
                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSave}
                    disabled={isPending}
                >
                    <Text style={styles.saveText}>
                        {isPending ? t('employer_profile.saving') : t('employer_profile.save')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default EmployerProfile;
