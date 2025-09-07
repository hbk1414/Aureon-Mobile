import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  useTrueLayerDataSync,
  useTrueLayerConnection,
  useCurrencyFormatter,
  useDateFormatter,
} from '../hooks/useTrueLayerData';
import { dataSyncService } from '../services/dataSyncService';

const COLORS = {
  bg: "#F7F8FB",
  card: "#FFFFFF",
  border: "#EAECEF",
  text: "#0F172A",
  mute: "#6B7280",
  blue: "#007AFF",
  green: "#30D158",
  red: "#FF3B30",
  orange: "#FF9F0A",
  purple: "#5856D6",
  violet: "#AF52DE",
};

export default function BankingDashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showSyncSettings, setShowSyncSettings] = useState(false);
  
  const {
    accounts,
    balances,
    transactions,
    loading,
    error,
    lastSync,
    syncAllData,
  } = useTrueLayerDataSync();
  
  const { isConnected, disconnect } = useTrueLayerConnection();
  const formatCurrency = useCurrencyFormatter();
  const formatDate = useDateFormatter();

  useEffect(() => {
    // Start periodic sync when component mounts
    if (isConnected) {
      dataSyncService.startPeriodicSync();
    }
    
    return () => {
      dataSyncService.stopPeriodicSync();
    };
  }, [isConnected]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await syncAllData();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Bank',
      'Are you sure you want to disconnect your bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await disconnect();
            dataSyncService.stopPeriodicSync();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  };

  const getAccountBalance = (accountId: string): TrueLayerBalance | undefined => {
    return balances.find(balance => balance.account_id === accountId);
  };

  const getTotalBalance = (): number => {
    return balances.reduce((total, balance) => total + balance.current, 0);
  };

  const getRecentTransactions = (accountId: string, limit: number = 5): TrueLayerTransaction[] => {
    return transactions[accountId]?.slice(0, limit) || [];
  };

  if (!isConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Bank Connected</Text>
          <Text style={styles.emptyStateSubtitle}>
            Connect your bank account to view your financial data
          </Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => {
              // Navigate to bank connection screen
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Text style={styles.connectButtonText}>Connect Bank</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && accounts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blue} />
          <Text style={styles.loadingText}>Loading your accounts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Banking Dashboard</Text>
            <Text style={styles.subtitle}>
              {lastSync ? `Last updated: ${formatDate(lastSync.toISOString())}` : 'Never synced'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSyncSettings(!showSyncSettings)}
          >
            <Text style={styles.settingsButtonText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Error State */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Sync Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Total Balance Card */}
        <View style={styles.totalBalanceCard}>
          <Text style={styles.totalBalanceLabel}>Total Balance</Text>
          <Text style={styles.totalBalanceAmount}>
            {formatCurrency(getTotalBalance())}
          </Text>
          <Text style={styles.totalBalanceSubtext}>
            Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Accounts List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          {accounts.map((account) => {
            const balance = getAccountBalance(account.account_id);
            const recentTransactions = getRecentTransactions(account.account_id);
            
            return (
              <View key={account.account_id} style={styles.accountCard}>
                <View style={styles.accountHeader}>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>{account.display_name}</Text>
                    <Text style={styles.accountType}>
                      {account.account_type} • {account.provider.display_name}
                    </Text>
                  </View>
                  <View style={styles.accountBalance}>
                    <Text style={styles.balanceAmount}>
                      {balance ? formatCurrency(balance.current) : '--'}
                    </Text>
                    {balance && balance.available !== balance.current && (
                      <Text style={styles.availableBalance}>
                        Available: {formatCurrency(balance.available)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Recent Transactions */}
                {recentTransactions.length > 0 && (
                  <View style={styles.recentTransactions}>
                    <Text style={styles.recentTransactionsTitle}>Recent Activity</Text>
                    {recentTransactions.map((transaction) => (
                      <View key={transaction.transaction_id} style={styles.transactionRow}>
                        <View style={styles.transactionInfo}>
                          <Text style={styles.transactionDescription}>
                            {transaction.description}
                          </Text>
                          <Text style={styles.transactionDate}>
                            {formatDate(transaction.timestamp)}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.transactionAmount,
                            {
                              color: transaction.transaction_type === 'CREDIT' 
                                ? COLORS.green 
                                : COLORS.text,
                            },
                          ]}
                        >
                          {transaction.transaction_type === 'CREDIT' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Sync Settings */}
        {showSyncSettings && (
          <View style={styles.syncSettingsCard}>
            <Text style={styles.syncSettingsTitle}>Sync Settings</Text>
            <Text style={styles.syncSettingsText}>
              Automatic sync every 15 minutes
            </Text>
            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={handleDisconnect}
            >
              <Text style={styles.disconnectButtonText}>Disconnect Bank</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mute,
  },
  settingsButton: {
    padding: 8,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.mute,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: COLORS.mute,
    textAlign: 'center',
    marginBottom: 32,
  },
  connectButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: COLORS.red + '10',
    borderRadius: 12,
    padding: 16,
    margin: 20,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: COLORS.red + '20',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.red,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.red,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  totalBalanceCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    marginBottom: 0,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  totalBalanceLabel: {
    fontSize: 16,
    color: COLORS.mute,
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  totalBalanceSubtext: {
    fontSize: 14,
    color: COLORS.mute,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  accountCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  accountType: {
    fontSize: 14,
    color: COLORS.mute,
  },
  accountBalance: {
    alignItems: 'flex-end',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  availableBalance: {
    fontSize: 12,
    color: COLORS.mute,
    marginTop: 2,
  },
  recentTransactions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  recentTransactionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: COLORS.mute,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  syncSettingsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    margin: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  syncSettingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  syncSettingsText: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 16,
  },
  disconnectButton: {
    backgroundColor: COLORS.red + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.red + '20',
  },
  disconnectButtonText: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
