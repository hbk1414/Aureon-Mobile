import { useState, useEffect, useCallback } from 'react';
import { trueLayerDataService, TrueLayerAccount, TrueLayerBalance, TrueLayerTransaction } from '../services/truelayerDataService';

// Hook for managing TrueLayer accounts
export function useTrueLayerAccounts() {
  const [accounts, setAccounts] = useState<TrueLayerAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAccounts = await trueLayerDataService.getAccounts();
      setAccounts(fetchedAccounts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch accounts';
      setError(errorMessage);
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCachedAccounts = useCallback(async () => {
    try {
      const cachedAccounts = await trueLayerDataService.getCachedAccounts();
      setAccounts(cachedAccounts);
    } catch (err) {
      console.error('Error loading cached accounts:', err);
    }
  }, []);

  useEffect(() => {
    loadCachedAccounts();
  }, [loadCachedAccounts]);

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    refresh: fetchAccounts,
  };
}

// Hook for managing TrueLayer balances
export function useTrueLayerBalances(accountIds?: string[]) {
  const [balances, setBalances] = useState<TrueLayerBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBalances = await trueLayerDataService.getAccountBalances(accountIds);
      setBalances(fetchedBalances);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balances';
      setError(errorMessage);
      console.error('Error fetching balances:', err);
    } finally {
      setLoading(false);
    }
  }, [accountIds]);

  const loadCachedBalances = useCallback(async () => {
    try {
      const cachedBalances = await trueLayerDataService.getCachedBalances();
      setBalances(cachedBalances);
    } catch (err) {
      console.error('Error loading cached balances:', err);
    }
  }, []);

  useEffect(() => {
    loadCachedBalances();
  }, [loadCachedBalances]);

  return {
    balances,
    loading,
    error,
    fetchBalances,
    refresh: fetchBalances,
  };
}

// Hook for managing TrueLayer transactions
export function useTrueLayerTransactions(accountId: string, fromDate?: string, toDate?: string) {
  const [transactions, setTransactions] = useState<TrueLayerTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!accountId) return;
    
    try {
      setLoading(true);
      setError(null);
      const fetchedTransactions = await trueLayerDataService.getTransactions(accountId, fromDate, toDate);
      setTransactions(fetchedTransactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
      setError(errorMessage);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [accountId, fromDate, toDate]);

  const loadCachedTransactions = useCallback(async () => {
    if (!accountId) return;
    
    try {
      const cachedTransactions = await trueLayerDataService.getCachedTransactions(accountId);
      setTransactions(cachedTransactions);
    } catch (err) {
      console.error('Error loading cached transactions:', err);
    }
  }, [accountId]);

  useEffect(() => {
    loadCachedTransactions();
  }, [loadCachedTransactions]);

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    refresh: fetchTransactions,
  };
}

// Hook for managing full data sync
export function useTrueLayerDataSync() {
  const [accounts, setAccounts] = useState<TrueLayerAccount[]>([]);
  const [balances, setBalances] = useState<TrueLayerBalance[]>([]);
  const [transactions, setTransactions] = useState<{ [accountId: string]: TrueLayerTransaction[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const syncAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const syncData = await trueLayerDataService.syncAllData();
      
      setAccounts(syncData.accounts);
      setBalances(syncData.balances);
      setTransactions(syncData.transactions);
      setLastSync(new Date());
      
      console.log('[TL] Data sync completed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sync data';
      setError(errorMessage);
      console.error('Error syncing data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCachedData = useCallback(async () => {
    try {
      const cachedAccounts = await trueLayerDataService.getCachedAccounts();
      const cachedBalances = await trueLayerDataService.getCachedBalances();
      
      setAccounts(cachedAccounts);
      setBalances(cachedBalances);
      
      // Load cached transactions for each account
      const cachedTransactions: { [accountId: string]: TrueLayerTransaction[] } = {};
      for (const account of cachedAccounts) {
        try {
          cachedTransactions[account.account_id] = await trueLayerDataService.getCachedTransactions(account.account_id);
        } catch (err) {
          console.error(`Error loading cached transactions for ${account.account_id}:`, err);
          cachedTransactions[account.account_id] = [];
        }
      }
      setTransactions(cachedTransactions);
    } catch (err) {
      console.error('Error loading cached data:', err);
    }
  }, []);

  useEffect(() => {
    loadCachedData();
  }, [loadCachedData]);

  return {
    accounts,
    balances,
    transactions,
    loading,
    error,
    lastSync,
    syncAllData,
    refresh: syncAllData,
  };
}

// Hook for checking connection status
export function useTrueLayerConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [checking, setChecking] = useState(false);

  const checkConnection = useCallback(async () => {
    try {
      setChecking(true);
      const connected = await trueLayerDataService.isConnected();
      setIsConnected(connected);
    } catch (err) {
      console.error('Error checking connection:', err);
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await trueLayerDataService.disconnect();
      setIsConnected(false);
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    checking,
    checkConnection,
    disconnect,
  };
}

// Utility hook for formatting currency
export function useCurrencyFormatter(currency: string = 'GBP') {
  return useCallback((amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, [currency]);
}

// Utility hook for formatting dates
export function useDateFormatter() {
  return useCallback((dateString: string, options?: Intl.DateTimeFormatOptions) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    });
  }, []);
}
