import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { useTranslation } from 'react-i18next';

const TermsConditionsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAccept = () => {
    if (isChecked) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('terms.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('terms.section_1_title')}</Text>
          <Text style={styles.bodyText}>
            {t('terms.section_1_body')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('terms.section_2_title')}</Text>
          <Text style={styles.bodyText}>
            {t('terms.section_2_body')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('terms.section_3_title')}</Text>
          <Text style={styles.bodyText}>
            {t('terms.section_3_body')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('terms.section_4_title')}</Text>
          <Text style={styles.bodyText}>
            {t('terms.section_4_body')}
          </Text>
          <Text style={styles.bulletText}>
            {t('terms.bullet_1')}
          </Text>
          <Text style={styles.bulletText}>
            {t('terms.bullet_2')}
          </Text>
          <Text style={styles.bulletText}>
            {t('terms.bullet_3')}
          </Text>
          <Text style={styles.bulletText}>
            {t('terms.bullet_4')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('terms.section_5_title')}</Text>
          <Text style={styles.bodyText}>
            {t('terms.section_5_body')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <View style={styles.checkboxInner} /> && (
              <Check width={20} />
            )}
          </View>
          <Text style={styles.checkboxText}>
            {t('terms.checkbox_text')}
            <Text style={styles.linkText}>{t('terms.checkbox_tos')}</Text>
            {t('terms.checkbox_and')}
            <Text style={styles.linkText}>{t('terms.checkbox_privacy')}</Text>
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isChecked && styles.buttonDisabled]}
          onPress={handleAccept}
          activeOpacity={0.7}
          disabled={!isChecked}
        >
          <Text
            style={[styles.buttonText, !isChecked && styles.buttonTextDisabled]}
          >
            {t('terms.accept_btn')}
          </Text>
          <ArrowRight width={20} height={20} color="#111827" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditionsScreen;
