import React, { useState, useMemo } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  BriefcaseBusiness,
  Users,
  Clock,
  FileText,
  CreditCard,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/RootNavigator';
import { useTranslation } from 'react-i18next';
import styles from './style';

// ─── Types ───────────────────────────────────────────────────────────────────

type ContentItem =
  | { kind: 'step'; textKey: string }
  | { kind: 'bullet'; textKey: string }
  | { kind: 'subheading'; textKey: string }
  | { kind: 'note'; textKey: string };

type GuideSection = {
  id: string;
  titleKey: string;
  Icon: React.ComponentType<{ width: number; height: number; color: string }>;
  content: ContentItem[];
};

// ─── Guide Sections — all text stored as i18n keys ───────────────────────────

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'posting',
    titleKey: 'help.section_posting_title',
    Icon: BriefcaseBusiness,
    content: [
      { kind: 'subheading', textKey: 'help.posting_sub_create' },
      { kind: 'step', textKey: 'help.posting_step1' },
      { kind: 'step', textKey: 'help.posting_step2' },
      { kind: 'step', textKey: 'help.posting_step3' },
      { kind: 'step', textKey: 'help.posting_step4' },
      { kind: 'subheading', textKey: 'help.posting_sub_fulltime' },
      { kind: 'note', textKey: 'help.posting_note_fulltime' },
      { kind: 'subheading', textKey: 'help.posting_sub_seasonal' },
      { kind: 'note', textKey: 'help.posting_note_seasonal' },
      { kind: 'subheading', textKey: 'help.posting_sub_daily' },
      { kind: 'note', textKey: 'help.posting_note_daily' },
      { kind: 'step', textKey: 'help.posting_step5' },
      { kind: 'step', textKey: 'help.posting_step6' },
    ],
  },
  {
    id: 'engaging',
    titleKey: 'help.section_engaging_title',
    Icon: Users,
    content: [
      { kind: 'step', textKey: 'help.engaging_step1' },
      { kind: 'subheading', textKey: 'help.engaging_sub_seasonal' },
      { kind: 'bullet', textKey: 'help.engaging_bullet1' },
      { kind: 'bullet', textKey: 'help.engaging_bullet2' },
      { kind: 'bullet', textKey: 'help.engaging_bullet3' },
      { kind: 'bullet', textKey: 'help.engaging_bullet4' },
      { kind: 'bullet', textKey: 'help.engaging_bullet5' },
      { kind: 'subheading', textKey: 'help.engaging_sub_after_seasonal' },
      { kind: 'bullet', textKey: 'help.engaging_after1' },
      { kind: 'bullet', textKey: 'help.engaging_after2' },
      { kind: 'bullet', textKey: 'help.engaging_after3' },
      { kind: 'bullet', textKey: 'help.engaging_after4' },
      { kind: 'subheading', textKey: 'help.engaging_sub_daily' },
      { kind: 'bullet', textKey: 'help.engaging_daily1' },
      { kind: 'bullet', textKey: 'help.engaging_daily2' },
      { kind: 'bullet', textKey: 'help.engaging_daily3' },
      { kind: 'bullet', textKey: 'help.engaging_daily4' },
      { kind: 'bullet', textKey: 'help.engaging_daily5' },
      { kind: 'bullet', textKey: 'help.engaging_daily6' },
      { kind: 'subheading', textKey: 'help.engaging_sub_after_daily' },
      { kind: 'bullet', textKey: 'help.engaging_daily_after1' },
      { kind: 'bullet', textKey: 'help.engaging_daily_after2' },
      { kind: 'bullet', textKey: 'help.engaging_daily_after3' },
    ],
  },
  {
    id: 'fulltime',
    titleKey: 'help.section_fulltime_title',
    Icon: Clock,
    content: [
      { kind: 'step', textKey: 'help.fulltime_step1' },
      { kind: 'subheading', textKey: 'help.fulltime_sub_employers' },
      { kind: 'bullet', textKey: 'help.fulltime_emp1' },
      { kind: 'bullet', textKey: 'help.fulltime_emp2' },
      { kind: 'subheading', textKey: 'help.fulltime_sub_workers' },
      { kind: 'bullet', textKey: 'help.fulltime_work1' },
      { kind: 'bullet', textKey: 'help.fulltime_work2' },
      { kind: 'bullet', textKey: 'help.fulltime_work3' },
      { kind: 'bullet', textKey: 'help.fulltime_work4' },
      { kind: 'bullet', textKey: 'help.fulltime_work5' },
    ],
  },
  {
    id: 'applications',
    titleKey: 'help.section_applications_title',
    Icon: FileText,
    content: [
      { kind: 'step', textKey: 'help.applications_step1' },
      { kind: 'subheading', textKey: 'help.applications_sub_can' },
      { kind: 'bullet', textKey: 'help.applications_can1' },
      { kind: 'bullet', textKey: 'help.applications_can2' },
      { kind: 'subheading', textKey: 'help.applications_sub_hired' },
      { kind: 'bullet', textKey: 'help.applications_hired1' },
    ],
  },
  {
    id: 'credits',
    titleKey: 'help.section_credits_title',
    Icon: CreditCard,
    content: [
      { kind: 'bullet', textKey: 'help.credits_rule1' },
      { kind: 'bullet', textKey: 'help.credits_rule2' },
      { kind: 'bullet', textKey: 'help.credits_rule3' },
      { kind: 'bullet', textKey: 'help.credits_rule4' },
    ],
  },
];

const SUPPORT_EMAIL = 'goldshift.app@gmail.com';
const SUPPORT_PHONE = '+1234567890';

// ─── Component ───────────────────────────────────────────────────────────────

const HelpSupportScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  // Filter sections by translated title when user types
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GUIDE_SECTIONS;
    return GUIDE_SECTIONS.filter(s =>
      t(s.titleKey).toLowerCase().includes(q),
    );
  }, [searchQuery, t]);

  // ─── Content item renderer ─────────────────────────────────────────────────

  const renderContentItem = (item: ContentItem, index: number) => {
    switch (item.kind) {
      case 'subheading':
        return (
          <Text key={index} style={styles.guideSubheading}>
            {t(item.textKey)}
          </Text>
        );
      case 'step':
        return (
          <View key={index} style={styles.guideStepRow}>
            <Text style={styles.guideStepNumber}>{'\u2022'}</Text>
            <Text style={styles.guideStepText}>{t(item.textKey)}</Text>
          </View>
        );
      case 'bullet':
        return (
          <View key={index} style={styles.guideBulletRow}>
            <Text style={styles.guideBulletDot}>{'\u2013'}</Text>
            <Text style={styles.guideBulletText}>{t(item.textKey)}</Text>
          </View>
        );
      case 'note':
        return (
          <Text key={index} style={styles.guideNote}>
            {t(item.textKey)}
          </Text>
        );
      default:
        return null;
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('help.title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search width={24} height={24} color="white" />
          <TextInput
            placeholder={t('help.search_placeholder')}
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Guide Sections */}
        <Text style={styles.sectionTitle}>{t('help.guide_title')}</Text>
        <View style={styles.faqSection}>
          {filteredSections.map(section => {
            const isOpen = expandedSection === section.id;
            const { Icon } = section;
            return (
              <TouchableOpacity
                key={section.id}
                style={styles.faqCard}
                activeOpacity={0.7}
                onPress={() => toggleSection(section.id)}
              >
                {/* Card header row */}
                <View style={styles.faqHeader}>
                  <View style={styles.guideSectionIconTitle}>
                    <Icon width={18} height={18} color="#FFD900" />
                    <Text style={styles.faqQuestion}>{t(section.titleKey)}</Text>
                  </View>
                  {isOpen
                    ? <ChevronUp width={20} height={20} color="#FFFFFF" />
                    : <ChevronDown width={20} height={20} color="#FFFFFF" />
                  }
                </View>

                {/* Expanded content */}
                {isOpen && (
                  <View style={styles.guideContentBody}>
                    {section.content.map((item, i) => renderContentItem(item, i))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {filteredSections.length === 0 && (
            <Text style={styles.guideEmptyText}>{t('help.empty_search')}</Text>
          )}
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>{t('help.still_need_help')}</Text>
          <Text style={styles.supportSubtext}>{t('help.support_sub_1')}</Text>
          <Text style={styles.supportSubtext}>{t('help.support_sub_2')}</Text>

          <View style={styles.supportButtons}>
            {/* <TouchableOpacity
              style={styles.liveChatBtn}
              activeOpacity={0.7}
              onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE}`)}
            >
              <Phone width={20} height={20} color="#1F2937" />
              <Text style={styles.liveChatText}>{t('help.live_chat')}</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.liveChatBtn}
              activeOpacity={0.7}
              onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
            >
              <Mail width={20} height={20} color="#1F2937" />
              <Text style={styles.emailText}>{t('help.email_support')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;