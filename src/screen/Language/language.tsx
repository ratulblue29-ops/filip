import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, CircleCheck, Circle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n, {
  saveLanguage,
  screenCodeToLocale,
  localeToScreenCode,
} from '../../i18n';
import styles from './style';

type Language = {
  code: string;
  name: string;
  flag: any;
  isDefault?: boolean;
};

const LANGUAGES: Language[] = [
  { code: 'RS', name: 'Srpski', flag: require('../../../assets/images/rs.png') },
  { code: 'HR', name: 'Hrvatski', flag: require('../../../assets/images/hr.png') },
  { code: 'GB', name: 'English', flag: require('../../../assets/images/gb.png'), isDefault: true },
  { code: 'FR', name: 'Français', flag: require('../../../assets/images/fr.png') },
  { code: 'DE', name: 'Deutsch', flag: require('../../../assets/images/de.png') },
  { code: 'PL', name: 'Polski', flag: require('../../../assets/images/pl.png') },
  { code: 'TR', name: 'Türkçe', flag: require('../../../assets/images/tr.png') },
  { code: 'IT', name: 'Italiano', flag: require('../../../assets/images/it.png') },
  { code: 'ES', name: 'Español', flag: require('../../../assets/images/es.png') },
  { code: 'PT', name: 'Português', flag: require('../../../assets/images/pt.png') },
  { code: 'RU', name: 'Русский', flag: require('../../../assets/images/ru.png') },
];

const LanguageScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  // Init selected from current i18n locale → screen code
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    localeToScreenCode[i18n.language] ?? 'GB',
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSaveChanges = async () => {
    const locale = screenCodeToLocale[selectedLanguage] ?? 'en';
    // Switch i18n language in-memory — all screens using useTranslation() re-render
    await i18n.changeLanguage(locale);
    // Persist so next app launch restores the choice
    await saveLanguage(locale);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.cancelText}>{t('language.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('language.screen_title')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.searchContainer}>
          <Search width={25} height={25} color="#ffffff" />
          <TextInput
            placeholder={t('language.search_placeholder')}
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredLanguages.map(language => {
            const isSelected = selectedLanguage === language.code;
            return (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  isSelected && styles.languageItemSelected,
                ]}
                onPress={() => setSelectedLanguage(language.code)}
                activeOpacity={0.7}
              >
                <View style={styles.languageLeft}>
                  <Image source={language.flag} style={styles.flagIcon} />
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageName}>{language.name}</Text>
                    {language.isDefault && isSelected && (
                      <Text style={styles.defaultText}>
                        {t('language.default')}
                      </Text>
                    )}
                  </View>
                </View>
                {isSelected ? (
                  <CircleCheck width={28} height={28} fill="#FFD900" />
                ) : (
                  <Circle width={24} height={24} color="#FFD900" />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveChanges}
          activeOpacity={0.7}
        >
          <CircleCheck width={28} height={28} color="#FFD900" fill="#1F2937" />
          <Text style={styles.saveButtonText}>{t('language.save_changes')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguageScreen;