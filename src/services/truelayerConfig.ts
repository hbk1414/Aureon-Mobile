import { 
  TRUELAYER_CLIENT_ID, 
  TRUELAYER_CLIENT_SECRET, 
  TRUELAYER_REDIRECT_URI 
} from '@env';

// TrueLayer Configuration for Sandbox/Testing Environment
export const TRUELAYER_CONFIG = {
  // Sandbox Environment
  environment: 'sandbox' as const,
  
  // Your TrueLayer Sandbox Credentials
  // Get these from https://console.truelayer.com/
  clientId: TRUELAYER_CLIENT_ID,
  clientSecret: TRUELAYER_CLIENT_SECRET,
  
  // Debug logging
  debug: {
    clientIdLoaded: !!TRUELAYER_CLIENT_ID,
    clientSecretLoaded: !!TRUELAYER_CLIENT_SECRET,
    redirectUriLoaded: !!TRUELAYER_REDIRECT_URI,
  },
  
  // Redirect URI for OAuth flow
  redirectUri: TRUELAYER_REDIRECT_URI,
  
  // Scopes for data access (matching Data product)
  scopes: [
    'info',
    'accounts',
    'balance',
    'transactions'
  ],
  
  // Sandbox Bank Providers
  providers: {
    // UK Banks available in sandbox
    uk: [
      {
        id: 'mock',
        name: 'Mock Bank',
        logo: '🏦', // Use emoji instead of failing CDN URL
        country: 'GB'
      },
      {
        id: 'santander',
        name: 'Santander',
        logo: '🏛️', // Use emoji instead of failing CDN URL
        country: 'GB'
      },
      {
        id: 'barclays',
        name: 'Barclays',
        logo: '🏢', // Use emoji instead of failing CDN URL
        country: 'GB'
      },
      {
        id: 'hsbc',
        name: 'HSBC',
        logo: '🏪', // Use emoji instead of failing CDN URL
        country: 'GB'
      }
    ]
  },
  
  // Mock Account Data for testing
  mockAccounts: [
    {
      accountId: 'mock-account-1',
      accountType: 'TRANSACTION' as const,
      currency: 'GBP',
      displayName: 'Mock Current Account',
      accountNumber: '12345678',
      sortCode: '12-34-56',
      balance: {
        available: 2500.00,
        current: 2500.00,
        overdraft: 500.00,
        limit: 500.00
      }
    },
    {
      accountId: 'mock-account-2',
      accountType: 'SAVINGS' as const,
      currency: 'GBP',
      displayName: 'Mock Savings Account',
      accountNumber: '87654321',
      sortCode: '65-43-21',
      balance: {
        available: 8750.00,
        current: 8750.00,
        overdraft: 0.00,
        limit: 0.00
      }
    }
  ],
  
  // Mock Transaction Data
  mockTransactions: [
    {
      transactionId: 'mock-tx-1',
      accountId: 'mock-account-1',
      amount: -45.67,
      currency: 'GBP',
      description: 'TESCO STORES 3294',
      transactionType: 'DEBIT' as const,
      status: 'POSTED' as const,
      timestamp: '2024-01-15T10:30:00Z',
      category: 'Food & Drink',
      merchantName: 'Tesco'
    },
    {
      transactionId: 'mock-tx-2',
      accountId: 'mock-account-1',
      amount: -12.50,
      currency: 'GBP',
      description: 'STARBUCKS COFFEE',
      transactionType: 'DEBIT' as const,
      status: 'POSTED' as const,
      timestamp: '2024-01-15T08:15:00Z',
      category: 'Food & Drink',
      merchantName: 'Starbucks'
    },
    {
      transactionId: 'mock-tx-3',
      accountId: 'mock-account-1',
      amount: 2500.00,
      currency: 'GBP',
      description: 'SALARY PAYMENT',
      transactionType: 'CREDIT' as const,
      status: 'POSTED' as const,
      timestamp: '2024-01-14T09:00:00Z',
      category: 'Income',
      merchantName: 'Employer Ltd'
    },
    {
      transactionId: 'mock-tx-4',
      accountId: 'mock-account-1',
      amount: -89.99,
      currency: 'GBP',
      description: 'AMAZON UK',
      transactionType: 'DEBIT' as const,
      status: 'POSTED' as const,
      timestamp: '2024-01-13T14:22:00Z',
      category: 'Shopping',
      merchantName: 'Amazon'
    },
    {
      transactionId: 'mock-tx-5',
      accountId: 'mock-account-1',
      amount: -23.45,
      currency: 'GBP',
      description: 'UBER TRIP',
      transactionType: 'DEBIT' as const,
      status: 'POSTED' as const,
      timestamp: '2024-01-12T19:30:00Z',
      category: 'Transport',
      merchantName: 'Uber'
    }
  ]
};

// TrueLayer API Endpoints
export const TRUELAYER_ENDPOINTS = {
  sandbox: {
    auth: 'https://auth.truelayer-sandbox.com', // Sandbox authorize URL
    token: 'https://auth.truelayer-sandbox.com/connect/token', // Sandbox token exchange
    api: 'https://api.truelayer-sandbox.com',
    data: 'https://data.truelayer-sandbox.com'
  },
  live: {
    auth: 'https://auth.truelayer.com',
    token: 'https://auth.truelayer.com/connect/token',
    api: 'https://api.truelayer.com',
    data: 'https://data.truelayer.com'
  }
};

// Helper function to get current environment endpoints
export const getEndpoints = () => {
  return TRUELAYER_ENDPOINTS[TRUELAYER_CONFIG.environment];
};
