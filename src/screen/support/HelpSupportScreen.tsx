import React, { useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Search,
  CalendarMinus2,
  Star,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  MessageSquareText,
  Mail,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import UsersAddIcon from '../../components/svg/UsersAddIcon';
import styles from './style';
import WalletIcon from '../../components/svg/WalletIcon';

const HelpSupportScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const commonTopics = [
    {
      id: '1',
      title: 'Finding Shifts',
      icon: CalendarMinus2,
      image: require('../../../assets/images/2beea3565fc00c52e5ae8103f1d60533b212f778.jpg'),
    },
    {
      id: '2',
      title: 'Getting Paid',
      icon: WalletIcon,
      image: require('../../../assets/images/021c47215cda0d6a4d27cccc7ae58617385bf192.jpg'),
    },
    {
      id: '3',
      title: 'Employee Ratings',
      icon: Star,
      iconFill: '#FFD900',
      image: require('../../../assets/images/75dab9d7643a97eb08def32ee971c9d635b2f13b.jpg'),
    },
    {
      id: '4',
      title: 'Profile & Account',
      icon: UsersAddIcon,
      image: require('../../../assets/images/e22d7cf6e1cd02298794d578fc720a99d9f77d39.jpg'),
    },
  ];

  const faqs = [
    {
      id: '1',
      question: 'How Do I Update My Availability?',
      answer:
        'To update your availability, go to your Profile, tap on Availability Settings, and select your preferred dates and times. Make sure to save your changes.',
    },
    {
      id: '2',
      question: 'How Do I Update My Availability?',
      answer:
        'To update your availability, go to your Profile, tap on Availability Settings, and select your preferred dates and times. Make sure to save your changes.',
    },
    {
      id: '3',
      question: 'How Do I Update My Availability?',
      answer:
        'To update your availability, go to your Profile, tap on Availability Settings, and select your preferred dates and times. Make sure to save your changes.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Help And Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search width={24} height={24} color="white" />
          <TextInput
            placeholder="Search Answer..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Common Topics */}
        <Text style={styles.sectionTitle}>Common Topics</Text>
        <View style={styles.topicsGrid}>
          {commonTopics.map(topic => {
            const IconComponent = topic.icon;
            return (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicCard}
                activeOpacity={0.7}
              >
                <ImageBackground
                  source={topic.image}
                  style={styles.topicCardBg}
                  imageStyle={styles.topicCardImage}
                >
                  <View style={styles.topicCardContent}>
                    <IconComponent width={24} height={24} color="#FFD900" fill={topic.iconFill || 'none'} />
                    <Text style={styles.topicCardTitle}>{topic.title}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Frequently Asked */}
        <Text style={styles.sectionTitle}>Frequently Asked</Text>
        <View style={styles.faqSection}>
          {faqs.map(faq => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              activeOpacity={0.7}
              onPress={() => toggleFAQ(faq.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedFAQ === faq.id ? (
                  <ChevronUp width={20} height={20} color="#FFFFFF" />
                ) : (
                  <ChevronDown width={20} height={20} color="#FFFFFF" />
                )}
              </View>
              {expandedFAQ === faq.id && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All FAQs</Text>
          <ArrowRight width={20} height={20} color="#FFD900" />
        </TouchableOpacity>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Still Need Help</Text>
          <Text style={styles.supportSubtext}>
            Our Support Team Is Available 24/7
          </Text>
          <Text style={styles.supportSubtext}>
            To Resolve Your Issue Quickly.
          </Text>

          <View style={styles.supportButtons}>
            <TouchableOpacity
              style={styles.liveChatBtn}
              activeOpacity={0.7}
            >
              <MessageSquareText width={20} height={20} color="#1F2937" />
              <Text style={styles.liveChatText}>Live Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.emailBtn}
              activeOpacity={0.7}
            >
              <Mail width={20} height={20} color="#ffffff" />
              <Text style={styles.emailText}>Email Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpSupportScreen;