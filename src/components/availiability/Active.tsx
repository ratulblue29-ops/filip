import { View, Text, Switch } from 'react-native'
import React from 'react'
import styles from '../../screen/SeosonalAvailabilityCreation/style';
import { Eye } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
const Active = ({ isActive, setIsActive }: any) => {
    const { t } = useTranslation();
    return (
        <View style={styles.section}>
            <View style={styles.toggleCard}>
                <View style={styles.toggleLeft}>
                    <View style={styles.fileIcon}>
                        <Eye width={24} height={24} color="#fff" />
                    </View>
                    <View>
                        <Text style={styles.toggleTitle}>{t('active_post.title')}</Text>
                        <Text style={styles.toggleSubtext}>{t('active_post.subtitle')}</Text>
                    </View>
                </View>
                <Switch
                    value={isActive}
                    onValueChange={setIsActive}
                    trackColor={{ false: '#2A2A2A', true: '#FFD900' }}
                />
            </View>
        </View>
    )
}

export default Active