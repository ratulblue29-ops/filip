import React from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { fetchCreditTransactions } from '../../services/credit';
import styles from './creditHistoryStyle';
import { RootStackParamList } from '../../navigator/RootNavigator';

// Format Firestore Timestamp or Date to readable string
const formatDate = (ts: any): string => {
  if (!ts) return '';
  const date = ts?.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const CreditHistoryScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['creditTransactions'],
    queryFn: fetchCreditTransactions,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Credit History</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#FFD900"
            style={styles.loader}
          />
        ) : transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubText}>
              Your credit activity will appear here
            </Text>
          </View>
        ) : (
          transactions.map((tx: any) => {
            const isDeduction = tx.type === 'deduction';

            return (
              <View key={tx.id} style={styles.txCard}>
                {/* Icon */}
                <View
                  style={[
                    styles.iconWrapper,
                    isDeduction
                      ? styles.iconWrapperDeduction
                      : styles.iconWrapperRefund,
                  ]}
                >
                  {isDeduction ? (
                    <TrendingDown width={20} height={20} color="#EF4444" />
                  ) : (
                    <TrendingUp width={20} height={20} color="#22C55E" />
                  )}
                </View>

                {/* Info */}
                <View style={styles.txInfo}>
                  <Text style={styles.txReason}>{tx.reason}</Text>
                  <Text style={styles.txDate}>{formatDate(tx.createdAt)}</Text>
                </View>

                {/* Amount */}
                <Text
                  style={[
                    styles.txAmount,
                    isDeduction ? styles.amountDeduction : styles.amountRefund,
                  ]}
                >
                  {isDeduction ? '-1' : '+1'}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreditHistoryScreen;
