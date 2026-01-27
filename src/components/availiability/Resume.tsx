import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import styles from '../../screen/SeosonalAvailabilityCreation/style';
import {
    X,
    File
} from 'lucide-react-native';
const Resume = () => {
    return (
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
    )
}

export default Resume