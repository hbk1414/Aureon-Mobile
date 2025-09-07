import * as SecureStore from 'expo-secure-store';
import { TRUELAYER_CONFIG } from './truelayerConfig';

// TrueLayer API Response Types
export interface TrueLayerAccount {
  account_id: string;
  account_type: 'TRANSACTION' | 'SAVINGS' | 'CREDIT_CARD';
  currency: string;
  display_name: string;
  account_number?: string;
  sort_code?: string;
  provider: {
    display_name: string;
    provider_id: string;
    logo_uri?: string;
  };
}

export interface TrueLayerBalance {
  account_id?: string;
  current: number;
  available: number;
  overdraft?: number;
  limit?: number;
  currency: string;
  update_timestamp: string;
}

interface TrueLayerBalanceResponse {
  results: TrueLayerBalance[];
  status: string;
}

export interface TrueLayerTransaction {
  transaction_id: string;
  timestamp: string;
  description: string;
  transaction_type: 'DEBIT' | 'CREDIT';
  transaction_category: string;
  transaction_classification: string[];
  amount: number;
  currency: string;
  merchant_name?: string;
  running_balance?: {
    amount: number;
    currency: string;
  };
  meta?: {
    bank_transaction_id?: string;
    provider_transaction_id?: string;
  };
}

export interface TrueLayerTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface TrueLayerError {
  error: string;
  error_description?: string;
  trace_id?: string;
}

class TrueLayerDataService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private readonly TOKEN_STORE_KEY = 'truelayer_tokens';
  private readonly ACCOUNTS_STORE_KEY = 'truelayer_accounts';
  private readonly BALANCES_STORE_KEY = 'truelayer_balances';
  private readonly TRANSACTIONS_STORE_KEY = 'truelayer_transactions';

  constructor() {
    this.loadStoredTokens();
  }

  // Mock Data Generation Methods
  private generateMockBalances(accountIds?: string[]): TrueLayerBalance[] {
    const mockBalances: TrueLayerBalance[] = [
      {
        account_id: accountIds?.[0] || 'mock-account-1',
        current: 1000.00, // Changed to £1,000 for easy identification
        available: 1000.00,
        overdraft: 500.00,
        limit: 500.00,
        currency: 'GBP',
        update_timestamp: new Date().toISOString(),
      },
      {
        account_id: accountIds?.[1] || 'mock-account-2',
        current: 1000.00, // Changed to £1,000 for easy identification
        available: 1000.00,
        overdraft: 0.00,
        limit: 0.00,
        currency: 'GBP',
        update_timestamp: new Date().toISOString(),
      }
    ];

    // If specific account IDs are requested, filter and generate for those
    if (accountIds && accountIds.length > 0) {
      return accountIds.map((accountId, index) => ({
        account_id: accountId,
        current: 1000.00, // Always £1,000 for mock data
        available: 1000.00,
        overdraft: index === 0 ? 500.00 : 0.00,
        limit: index === 0 ? 500.00 : 0.00,
        currency: 'GBP',
        update_timestamp: new Date().toISOString(),
      }));
    }

    return mockBalances;
  }

  private generateMockTransactions(accountId: string): TrueLayerTransaction[] {
    return [
      {
        transaction_id: 'mock-tx-1',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        description: 'TESCO STORES 3294',
        transaction_type: 'DEBIT',
        transaction_category: 'Food & Drink',
        transaction_classification: ['Shopping', 'Food'],
        amount: -45.67,
        currency: 'GBP',
        merchant_name: 'Tesco',
        running_balance: {
          amount: 954.33,
          currency: 'GBP',
        },
      },
      {
        transaction_id: 'mock-tx-2',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        description: 'STARBUCKS COFFEE',
        transaction_type: 'DEBIT',
        transaction_category: 'Food & Drink',
        transaction_classification: ['Food', 'Coffee'],
        amount: -12.50,
        currency: 'GBP',
        merchant_name: 'Starbucks',
        running_balance: {
          amount: 941.83,
          currency: 'GBP',
        },
      },
      {
        transaction_id: 'mock-tx-3',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        description: 'SALARY PAYMENT',
        transaction_type: 'CREDIT',
        transaction_category: 'Income',
        transaction_classification: ['Salary', 'Income'],
        amount: 2500.00,
        currency: 'GBP',
        merchant_name: 'Employer Ltd',
        running_balance: {
          amount: 1000.00,
          currency: 'GBP',
        },
      },
      {
        transaction_id: 'mock-tx-4',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        description: 'AMAZON UK',
        transaction_type: 'DEBIT',
        transaction_category: 'Shopping',
        transaction_classification: ['Shopping', 'Online'],
        amount: -89.99,
        currency: 'GBP',
        merchant_name: 'Amazon',
        running_balance: {
          amount: 910.01,
          currency: 'GBP',
        },
      },
      {
        transaction_id: 'mock-tx-5',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
        description: 'UBER TRIP',
        transaction_type: 'DEBIT',
        transaction_category: 'Transport',
        transaction_classification: ['Transport', 'Taxi'],
        amount: -23.45,
        currency: 'GBP',
        merchant_name: 'Uber',
        running_balance: {
          amount: 886.56,
          currency: 'GBP',
        },
      },
    ];
  }

  // Token Management
  async storeTokens(tokenData: TrueLayerTokenResponse): Promise<void> {
    try {
      console.log('[TL] Storing tokens:', {
        hasAccessToken: !!tokenData.access_token,
        hasRefreshToken: !!tokenData.refresh_token,
        expiresIn: tokenData.expires_in,
        scope: tokenData.scope
      });
      
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = Date.now() + (tokenData.expires_in * 1000);

      const tokenStore = {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_in: tokenData.expires_in,
        token_type: tokenData.token_type,
        scope: tokenData.scope,
        expires_at: this.tokenExpiry,
      };

      await SecureStore.setItemAsync(this.TOKEN_STORE_KEY, JSON.stringify(tokenStore));
      console.log('[TL] Tokens stored successfully');
      console.log('[TL] Token expiry:', new Date(this.tokenExpiry).toISOString());
    } catch (error) {
      console.error('[TL] Failed to store tokens:', error);
    }
  }

  private async loadStoredTokens(): Promise<void> {
    try {
      const storedTokens = await SecureStore.getItemAsync(this.TOKEN_STORE_KEY);
      if (storedTokens) {
        const tokenData = JSON.parse(storedTokens);
        this.accessToken = tokenData.access_token;
        this.refreshToken = tokenData.refresh_token;
        this.tokenExpiry = tokenData.expires_at;
        console.log('[TL] Tokens loaded from storage');
        console.log('[TL] Loaded tokens:', {
          hasAccessToken: !!this.accessToken,
          hasRefreshToken: !!this.refreshToken,
          expiry: this.tokenExpiry ? new Date(this.tokenExpiry).toISOString() : 'none',
          isExpired: this.tokenExpiry ? Date.now() > this.tokenExpiry : true
        });
      } else {
        console.log('[TL] No stored tokens found');
      }
    } catch (error) {
      console.error('[TL] Failed to load stored tokens:', error);
    }
  }

  private async clearStoredTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_STORE_KEY);
      await SecureStore.deleteItemAsync(this.ACCOUNTS_STORE_KEY);
      await SecureStore.deleteItemAsync(this.BALANCES_STORE_KEY);
      await SecureStore.deleteItemAsync(this.TRANSACTIONS_STORE_KEY);
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;
      console.log('[TL] All stored data cleared');
    } catch (error) {
      console.error('[TL] Failed to clear stored data:', error);
    }
  }

  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry - 60000; // 1 minute buffer
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      console.error('[TL] No refresh token available');
      return false;
    }

    try {
      const response = await fetch('https://auth.truelayer-sandbox.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: TRUELAYER_CONFIG.clientId,
          client_secret: TRUELAYER_CONFIG.clientSecret,
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        console.error('[TL] Token refresh failed:', response.status);
        await this.clearStoredTokens();
        return false;
      }

      const tokenData: TrueLayerTokenResponse = await response.json();
      await this.storeTokens(tokenData);
      console.log('[TL] Access token refreshed successfully');
      return true;
    } catch (error) {
      console.error('[TL] Token refresh error:', error);
      await this.clearStoredTokens();
      return false;
    }
  }

  private async makeAuthenticatedRequest<T>(endpoint: string): Promise<T> {
    if (!this.isTokenValid()) {
      console.log('[TL] Token expired, attempting refresh...');
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        throw new Error('Authentication failed - please reconnect your bank');
      }
    }

    console.log(`[TL] Making request to: https://api.truelayer-sandbox.com${endpoint}`);
    
    const response = await fetch(`https://api.truelayer-sandbox.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`[TL] Response status: ${response.status}`);
    console.log(`[TL] Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData: TrueLayerError = await response.json();
      console.error('[TL] API request failed:', response.status, errorData);
      throw new Error(`API request failed: ${errorData.error_description || errorData.error}`);
    }

    // Check if response has content
    const responseText = await response.text();
    console.log(`[TL] Response text length: ${responseText.length}`);
    console.log(`[TL] Response text:`, responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));

    if (!responseText.trim()) {
      console.log('[TL] Empty response from API');
      throw new Error('Empty response from API');
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('[TL] JSON parse error:', parseError);
      console.error('[TL] Response text that failed to parse:', responseText);
      throw new Error(`JSON parse error: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  }

  // Account Management
  async getAccounts(): Promise<TrueLayerAccount[]> {
    try {
      console.log('[TL] Fetching accounts...');
      const response = await this.makeAuthenticatedRequest<{ results: TrueLayerAccount[] }>('/data/v1/accounts');
      
      // Limit to first account only as requested
      const accounts = response.results.slice(0, 1);
      
      // Store accounts for offline access
      await SecureStore.setItemAsync(this.ACCOUNTS_STORE_KEY, JSON.stringify(accounts));
      
      console.log(`[TL] Retrieved ${accounts.length} account(s) (limited to first account)`);
      return accounts;
    } catch (error) {
      console.error('[TL] Failed to fetch accounts:', error);
      
      // Try to return cached data if available
      try {
        const cachedAccounts = await SecureStore.getItemAsync(this.ACCOUNTS_STORE_KEY);
        if (cachedAccounts) {
          console.log('[TL] Returning cached accounts');
          return JSON.parse(cachedAccounts);
        }
      } catch (cacheError) {
        console.error('[TL] Failed to load cached accounts:', cacheError);
      }
      
      throw error;
    }
  }

  // Balance Management
  async getAccountBalances(accountIds?: string[]): Promise<TrueLayerBalance[]> {
    try {
      console.log('[TL] Fetching account balances...');
      
      // Try the correct TrueLayer balance endpoint
      let endpoint = '/data/v1/balances';
      if (accountIds && accountIds.length > 0) {
        endpoint += `?account_ids=${accountIds.join(',')}`;
      }
      
      console.log(`[TL] Balance endpoint: ${endpoint}`);
      
      const response = await this.makeAuthenticatedRequest<{ results: TrueLayerBalanceResponse[] }>(endpoint);
      
      console.log('[TL] Balance API response:', JSON.stringify(response.results, null, 2));
      
      // Extract the actual balance data from the response structure
      let balances = response.results;
      if (balances && balances.length > 0 && balances[0].results) {
        // If the response has a nested structure, extract the actual balance data
        balances = balances.map(balance => {
          if (balance.results && balance.results.length > 0) {
            return balance.results[0];
          }
          return balance;
        });
      }
      
      // Check if balances are empty or zero, use mock data as fallback
      if (balances.length === 0 || balances.every(b => b.current === 0)) {
        console.log('[TL] No balance data from API, using mock data');
        balances = this.generateMockBalances(accountIds);
        console.log('[TL] Generated mock balances:', JSON.stringify(balances, null, 2));
      }
      
      // Store balances for offline access
      await SecureStore.setItemAsync(this.BALANCES_STORE_KEY, JSON.stringify(balances));
      
      console.log(`[TL] Retrieved ${balances.length} account balances`);
      return balances;
    } catch (error) {
      console.error('[TL] Failed to fetch balances:', error);
      
      // Try individual account balance endpoints as fallback
      if (accountIds && accountIds.length > 0) {
        console.log('[TL] Trying individual account balance endpoints...');
        try {
          const individualBalances: TrueLayerBalanceResponse[] = [];
          for (const accountId of accountIds) {
            try {
              const individualResponse = await this.makeAuthenticatedRequest<TrueLayerBalanceResponse>(`/data/v1/accounts/${accountId}/balance`);
              individualBalances.push(individualResponse);
              console.log(`[TL] Got balance for account ${accountId}:`, individualResponse);
            } catch (individualError) {
              console.error(`[TL] Failed to get balance for account ${accountId}:`, individualError);
            }
          }
          
          if (individualBalances.length > 0) {
            console.log(`[TL] Retrieved ${individualBalances.length} individual balances`);
            // Extract the actual balance data from the response structure
            const extractedBalances = individualBalances.map(balance => {
              if (balance.results && balance.results.length > 0) {
                return balance.results[0];
              }
              return balance;
            });
            await SecureStore.setItemAsync(this.BALANCES_STORE_KEY, JSON.stringify(extractedBalances));
            return extractedBalances;
          }
        } catch (fallbackError) {
          console.error('[TL] Individual balance fallback also failed:', fallbackError);
        }
      }
      
      // Try to return cached data if available
      try {
        const cachedBalances = await SecureStore.getItemAsync(this.BALANCES_STORE_KEY);
        if (cachedBalances) {
          console.log('[TL] Returning cached balances');
          return JSON.parse(cachedBalances);
        }
      } catch (cacheError) {
        console.error('[TL] Failed to load cached balances:', cacheError);
      }
      
      // Fallback to mock data if all else fails
      console.log('[TL] Using mock balance data as fallback');
      return this.generateMockBalances(accountIds);
    }
  }

  // Transaction Management
  async getTransactions(accountId: string, fromDate?: string, toDate?: string): Promise<TrueLayerTransaction[]> {
    try {
      console.log(`[TL] Fetching transactions for account ${accountId}...`);
      
      let endpoint = `/data/v1/accounts/${accountId}/transactions`;
      const params = new URLSearchParams();
      
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }
      
      const response = await this.makeAuthenticatedRequest<{ results: TrueLayerTransaction[] }>(endpoint);
      
      // Check if transactions are empty, use mock data as fallback
      let transactions = response.results;
      if (transactions.length === 0) {
        console.log('[TL] No transaction data from API, using mock data');
        transactions = this.generateMockTransactions(accountId);
      }
      
      // Store transactions for offline access
      const cacheKey = `${this.TRANSACTIONS_STORE_KEY}_${accountId}`;
      await SecureStore.setItemAsync(cacheKey, JSON.stringify(transactions));
      
      console.log(`[TL] Retrieved ${transactions.length} transactions for account ${accountId}`);
      return transactions;
    } catch (error) {
      console.error('[TL] Failed to fetch transactions:', error);
      
      // Try to return cached data if available
      try {
        const cacheKey = `${this.TRANSACTIONS_STORE_KEY}_${accountId}`;
        const cachedTransactions = await SecureStore.getItemAsync(cacheKey);
        if (cachedTransactions) {
          console.log('[TL] Returning cached transactions');
          return JSON.parse(cachedTransactions);
        }
      } catch (cacheError) {
        console.error('[TL] Failed to load cached transactions:', cacheError);
      }
      
      // Fallback to mock data if all else fails
      console.log('[TL] Using mock transaction data as fallback');
      return this.generateMockTransactions(accountId);
    }
  }

  // Data Sync Management
  async syncAllData(): Promise<{
    accounts: TrueLayerAccount[];
    balances: TrueLayerBalance[];
    transactions: { [accountId: string]: TrueLayerTransaction[] };
  }> {
    try {
      console.log('[TL] Starting full data sync...');
      
      // Fetch accounts first
      const accounts = await this.getAccounts();
      
      // Fetch balances for all accounts
      const accountIds = accounts.map(acc => acc.account_id);
      const balances = await this.getAccountBalances(accountIds);
      
      // Fetch transactions for each account (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const fromDate = thirtyDaysAgo.toISOString().split('T')[0];
      
      const transactions: { [accountId: string]: TrueLayerTransaction[] } = {};
      
      for (const account of accounts) {
        try {
          transactions[account.account_id] = await this.getTransactions(account.account_id, fromDate);
        } catch (error) {
          console.error(`[TL] Failed to fetch transactions for account ${account.account_id}:`, error);
          transactions[account.account_id] = [];
        }
      }
      
      console.log('[TL] Full data sync completed successfully');
      
      return {
        accounts,
        balances,
        transactions,
      };
    } catch (error) {
      console.error('[TL] Full data sync failed:', error);
      throw error;
    }
  }

  // Test API connectivity
  async testAPIConnection(): Promise<{ connected: boolean; error?: string; details?: any }> {
    try {
      console.log('[TL] Testing API connection...');
      
      // Test with a simple accounts request
      const response = await this.makeAuthenticatedRequest<{ results: TrueLayerAccount[] }>('/data/v1/accounts');
      
      console.log('[TL] API connection test successful');
      return {
        connected: true,
        details: {
          accountsCount: response.results.length,
          firstAccount: response.results[0]?.display_name || 'No accounts'
        }
      };
    } catch (error) {
      console.error('[TL] API connection test failed:', error);
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Utility Methods
  async isConnected(): Promise<boolean> {
    try {
      await this.getAccounts();
      return true;
    } catch (error) {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    await this.clearStoredTokens();
    console.log('[TL] Disconnected from TrueLayer');
  }

  // Get cached data without API calls
  async getCachedAccounts(): Promise<TrueLayerAccount[]> {
    try {
      const cachedAccounts = await SecureStore.getItemAsync(this.ACCOUNTS_STORE_KEY);
      return cachedAccounts ? JSON.parse(cachedAccounts) : [];
    } catch (error) {
      console.error('[TL] Failed to get cached accounts:', error);
      return [];
    }
  }

  async getCachedBalances(): Promise<TrueLayerBalance[]> {
    try {
      const cachedBalances = await SecureStore.getItemAsync(this.BALANCES_STORE_KEY);
      return cachedBalances ? JSON.parse(cachedBalances) : [];
    } catch (error) {
      console.error('[TL] Failed to get cached balances:', error);
      return [];
    }
  }

  async getCachedTransactions(accountId: string): Promise<TrueLayerTransaction[]> {
    try {
      const cacheKey = `${this.TRANSACTIONS_STORE_KEY}_${accountId}`;
      const cachedTransactions = await SecureStore.getItemAsync(cacheKey);
      return cachedTransactions ? JSON.parse(cachedTransactions) : [];
    } catch (error) {
      console.error('[TL] Failed to get cached transactions:', error);
      return [];
    }
  }
}

// Export singleton instance
export const trueLayerDataService = new TrueLayerDataService();

// Export types for use in components
export type {
  TrueLayerAccount,
  TrueLayerBalance,
  TrueLayerTransaction,
  TrueLayerTokenResponse,
  TrueLayerError,
};
