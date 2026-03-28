import { View, Text, TextInput } from 'react-native'
import React from 'react'
import styles from '../../screen/SeosonalAvailabilityCreation/style';
import { BriefcaseBusiness, CircleCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
const AvailiablityHeading = ({ setTitle }: { setTitle: (title: string) => void }) => {
    const { t } = useTranslation();
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('availability_heading.job_details')}</Text>
            <Text style={styles.subsectionTitle}>{t('availability_heading.target_position')}</Text>
            <View style={styles.jobCard}>
                <BriefcaseBusiness width={24} height={24} color="hsla(220, 13%, 91%, 0.85)" />
                <TextInput
                    style={styles.jobText}
                    placeholder={t('availability_heading.job_title_placeholder')}
                    placeholderTextColor='hsla(220, 13%, 91%, 0.85)'
                    onChangeText={setTitle}
                />
                <CircleCheck width={24} height={24} color="#FFD900" />
            </View>
        </View>
    )
}

export default AvailiablityHeading