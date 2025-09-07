import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTrueLayerDataSync, useCurrencyFormatter } from '../hooks/useTrueLayerData';
import { useEffect } from 'react';
import { trueLayerDataService } from '../services/truelayerDataService';

// Example component showing how to use the TrueLayer data hooks
export function BankingSummaryCard() {
  const { accounts, balances, loading, syncAllData } = useTrueLayerDataSync();
  const formatCurrency = useCurrencyFormatter();

  // Debug logging
  console.log('[BankingSummaryCard] Accounts:', accounts.length);
  console.log('[BankingSummaryCard] Balances:', balances.length);
  console.log('[BankingSummaryCard] Balance data:', JSON.stringify(balances, null, 2));

  const totalBalance = balances.reduce((total, balance) => total + balance.current, 0);
  const accountCount = accounts.length;

  // Determine data source
  const isUsingMockData = totalBalance === 0 && accountCount > 0;
  const dataSource = isUsingMockData ? 'Mock Data' : 'TrueLayer API';
  
  console.log(`[BankingSummaryCard] Data Source: ${dataSource}`);

  // Use actual cached balance data
  const displayBalance = totalBalance;

  // Trigger sync when component mounts
  useEffect(() => {
    console.log('[BankingSummaryCard] Component mounted, triggering sync...');
    syncAllData();
  }, []);

  const testAPIConnection = async () => {
    try {
      const result = await trueLayerDataService.testAPIConnection();
      if (result.connected) {
        Alert.alert(
          'API Connection Test',
          `✅ Connected successfully!\n\nAccounts: ${result.details?.accountsCount}\nFirst Account: ${result.details?.firstAccount}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'API Connection Test',
          `❌ Connection failed!\n\nError: ${result.error}`,
          [
            { text: 'OK' },
            { 
              text: 'Reconnect', 
              onPress: () => {
                // Clear tokens and navigate to bank connection
                trueLayerDataService.disconnect();
                // Navigate to bank connection screen
                // You might need to adjust this navigation based on your app structure
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'API Connection Test',
        `❌ Test failed!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };

  const switchToMockData = async () => {
    try {
      await trueLayerDataService.useMockData();
      Alert.alert(
        'Mock Data Mode',
        '✅ Switched to comprehensive mock data!\n\nThis includes realistic monthly salary and expenses for testing.',
        [{ text: 'OK', onPress: () => syncAllData() }]
      );
    } catch (error) {
      Alert.alert(
        'Mock Data Error',
        `❌ Failed to switch to mock data!\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>Loading banking data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Banking Summary</Text>
        <View style={styles.headerRight}>
          <Text style={[styles.dataSourceIndicator, { color: isUsingMockData ? '#FF9F0A' : '#30D158' }]}>
            {isUsingMockData ? '📊 Mock' : '🌐 Live'}
          </Text>
          <TouchableOpacity onPress={testAPIConnection} style={styles.testButton}>
            <Text style={styles.testButtonText}>🧪</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={syncAllData} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(displayBalance)}</Text>
      </View>
      
      <View style={styles.accountRow}>
        <Text style={styles.accountLabel}>Connected Accounts</Text>
        <Text style={styles.accountCount}>{accountCount}</Text>
      </View>
      
      {accounts.slice(0, 3).map((account) => {
        const balance = balances.find(b => b.account_id === account.account_id);
        const accountBalance = balance ? balance.current : 0;
        return (
          <View key={account.account_id} style={styles.accountItem}>
            <Text style={styles.accountName}>{account.display_name}</Text>
            <Text style={styles.accountBalance}>
              {formatCurrency(accountBalance)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#EAECEF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dataSourceIndicator: {
    fontSize: 12,
    fontWeight: '600',
  },
  testButton: {
    padding: 4,
  },
  testButtonText: {
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  refreshButton: {
    padding: 4,
  },
  refreshButtonText: {
    fontSize: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  accountCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#EAECEF',
  },
  accountName: {
    fontSize: 14,
    color: '#0F172A',
    flex: 1,
  },
  accountBalance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    padding: 20,
  },
});
