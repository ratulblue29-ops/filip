import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
} from 'react-native';
import { Globe, X } from 'lucide-react-native';
import i18n, {
    saveLanguage,
    screenCodeToLocale,
    localeToScreenCode,
} from '../i18n';

type Language = {
    code: string;
    name: string;
    flag: any;
};

const LANGUAGES: Language[] = [
    { code: 'RS', name: 'Srpski', flag: require('../../assets/images/rs.png') },
    { code: 'HR', name: 'Hrvatski', flag: require('../../assets/images/hr.png') },
    { code: 'GB', name: 'English', flag: require('../../assets/images/gb.png') },
    { code: 'FR', name: 'Français', flag: require('../../assets/images/fr.png') },
    { code: 'DE', name: 'Deutsch', flag: require('../../assets/images/de.png') },
    { code: 'PL', name: 'Polski', flag: require('../../assets/images/pl.png') },
    { code: 'TR', name: 'Türkçe', flag: require('../../assets/images/tr.png') },
    { code: 'IT', name: 'Italiano', flag: require('../../assets/images/it.png') },
    { code: 'ES', name: 'Español', flag: require('../../assets/images/es.png') },
    { code: 'PT', name: 'Português', flag: require('../../assets/images/pt.png') },
    { code: 'RU', name: 'Русский', flag: require('../../assets/images/ru.png') },
];

const LanguagePicker = () => {
    const [visible, setVisible] = useState(false);

    // Derive current screen code from i18n — re-reads on every render after changeLanguage
    const currentCode = localeToScreenCode[i18n.language] ?? 'GB';
    const currentLang = LANGUAGES.find(l => l.code === currentCode);

    const handleSelect = async (code: string) => {
        const locale = screenCodeToLocale[code] ?? 'en';
        // Switch in-memory → all useTranslation() hooks re-render immediately
        await i18n.changeLanguage(locale);
        // Persist for next app launch
        await saveLanguage(locale);
        setVisible(false);
    };

    return (
        <>
            {/* Trigger button — top-right pill showing current flag + globe icon */}
            <TouchableOpacity
                style={styles.trigger}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                {currentLang && (
                    <Image source={currentLang.flag} style={styles.triggerFlag} />
                )}
                <Globe size={14} color="#FFD900" />
            </TouchableOpacity>

            {/* Bottom-sheet modal */}
            <Modal visible={visible} transparent animationType="slide">
                <View style={styles.overlay}>
                    <View style={styles.sheet}>
                        {/* Header */}
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Select Language</Text>
                            <TouchableOpacity onPress={() => setVisible(false)} activeOpacity={0.7}>
                                <X size={22} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Language list */}
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {LANGUAGES.map(lang => {
                                const isSelected = lang.code === currentCode;
                                return (
                                    <TouchableOpacity
                                        key={lang.code}
                                        style={[styles.item, isSelected && styles.itemSelected]}
                                        onPress={() => handleSelect(lang.code)}
                                        activeOpacity={0.7}
                                    >
                                        <Image source={lang.flag} style={styles.flag} />
                                        <Text style={styles.langName}>{lang.name}</Text>
                                        {/* Yellow dot marks current selection */}
                                        {isSelected && <View style={styles.dot} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 8,
    },
    triggerFlag: {
        width: 20,
        height: 14,
        borderRadius: 2,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        maxHeight: '70%',
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sheetTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'InterDisplaySemiBold',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 6,
        gap: 12,
        backgroundColor: '#222222',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    itemSelected: {
        backgroundColor: '#1F1F0F',
        borderColor: '#FFD900',
    },
    flag: {
        width: 32,
        height: 22,
        borderRadius: 2,
    },
    langName: {
        flex: 1,
        fontSize: 15,
        color: '#fff',
        fontFamily: 'InterDisplayMedium',
        fontWeight: '500',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFD900',
    },
});

export default LanguagePicker;