import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { launchImageLibrary } from 'react-native-image-picker';

const UploadBanner = ({
    bannerImage,
    setBannerImage,
}: {
    bannerImage: string | null;
    setBannerImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {

    const pickImage = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
            });

            if (result.assets && result.assets.length > 0) {
                setBannerImage(result.assets[0].uri || null);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error picking image',
                text2: (error as Error).message,
            });
        }
    };

    return (
        <View style={styles.container}>
            {/* Banner Upload */}
            <Text style={styles.label}>Banner Image</Text>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={pickImage}
                style={styles.bannerBox}
            >
                {bannerImage ? (
                    <Image
                        source={{ uri: bannerImage }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <View style={styles.plusCircle}>
                            <Text style={styles.plusText}>+</Text>
                        </View>
                        <Text style={styles.placeholderText}>Upload banner image</Text>
                        <Text style={styles.recommendedText}>Recommended ratio 16:9</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default UploadBanner;
const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    bannerBox: {
        height: 160,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(245, 245, 245, 0.07)',
        backgroundColor: '#1D1D1D',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    plusCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(252, 211, 77, 0.16)',
    },
    plusText: {
        color: '#FCD34D',
        fontSize: 22,
    },
    placeholderText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'InterDisplay-Medium',
        fontWeight: '500',
    },
    recommendedText: {
        color: '#F5F5F5',
        opacity: 0.7,
        fontSize: 12,
        fontFamily: 'InterDisplay-Regular',
        marginTop: 4,
    },
});
