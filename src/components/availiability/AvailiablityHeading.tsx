import { View, Text, TextInput } from 'react-native'
import React from 'react'
import styles from '../../screen/SeosonalAvailabilityCreation/style';
import { BriefcaseBusiness, CircleCheck } from 'lucide-react-native';
const AvailiablityHeading = ({ setTitle }: { setTitle: (title: string) => void }) => {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <Text style={styles.subsectionTitle}>Target Position</Text>
            <View style={styles.jobCard}>
                <BriefcaseBusiness width={24} height={24} color="hsla(220, 13%, 91%, 0.85)" />
                <TextInput
                    style={styles.jobText}
                    placeholder="Enter job title"
                    placeholderTextColor='hsla(220, 13%, 91%, 0.85)'
                    onChangeText={setTitle}
                />
                <CircleCheck width={24} height={24} color="#FFD900" />
            </View>
        </View>
    )
}

export default AvailiablityHeading