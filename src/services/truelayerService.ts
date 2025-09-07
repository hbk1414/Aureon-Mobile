import { TRUELAYER_CONFIG, getEndpoints } from './truelayerConfig';
import * as Crypto from 'expo-crypto';

// Types for TrueLayer API responses
export interface TrueLayerAccount {
  accountId: string;
  accountType: 'TRANSACTION' | 'SAVINGS' | 'CREDIT_CARD';
  currency: string;
  displayName: string;
  accountNumber?: string;
  sortCode?: string;
  balance: {
    available: number;
    current: number;
    overdraft: number;
    limit: number;
  };
}

export interface TrueLayerTransaction {
  transactionId: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  transactionType: 'DEBIT' | 'CREDIT';
  status: 'PENDING' | 'POSTED';
  timestamp: string;
  category?: string;
  merchantName?: string;
}

export interface TrueLayerProvider {
  id: string;
  name: string;
  logo: string;
  country: string;
}

export interface TrueLayerAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

class TrueLayerService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private codeVerifier: string | null = null;

  // Initialize with stored tokens (if any)
  constructor() {
    this.loadStoredTokens();
  }

  // Load tokens from secure storage
  private async loadStoredTokens() {
    try {
      // In a real app, you'd use secure storage like expo-secure-store
      const storedToken = await this.getStoredToken('truelayer_access_token');
      const storedRefresh = await this.getStoredToken('truelayer_refresh_token');
      const storedExpiry = await this.getStoredToken('truelayer_token_expiry');

      if (storedToken && storedRefresh && storedExpiry) {
        this.accessToken = storedToken;
        this.refreshToken = storedRefresh;
        this.tokenExpiry = parseInt(storedExpiry);
      }
    } catch (error) {
      console.log('No stored tokens found');
    }
  }

  // Store tokens securely
  private async storeTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    try {
      const expiryTime = Date.now() + (expiresIn * 1000);
      await this.setStoredToken('truelayer_access_token', accessToken);
      await this.setStoredToken('truelayer_refresh_token', refreshToken);
      await this.setStoredToken('truelayer_token_expiry', expiryTime.toString());
      
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.tokenExpiry = expiryTime;
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  // Mock secure storage methods (replace with expo-secure-store in production)
  private async getStoredToken(key: string): Promise<string | null> {
    // Mock implementation - replace with actual secure storage
    return null;
  }

  private async setStoredToken(key: string, value: string): Promise<void> {
    // Mock implementation - replace with actual secure storage
    console.log(`Storing ${key}: ${value}`);
  }

  // Check if token is valid
  private isTokenValid(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry - 60000; // 1 minute buffer
  }

  // Get authorization URL for OAuth flow
  async getAuthUrl(providerId: string, customRedirectUri?: string): Promise<string> {
    const endpoints = getEndpoints();
    
    // Generate PKCE parameters
    this.codeVerifier = await this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);
    
    const redirectUri = customRedirectUri || TRUELAYER_CONFIG.redirectUri;
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: TRUELAYER_CONFIG.clientId,
      redirect_uri: redirectUri,
      scope: TRUELAYER_CONFIG.scopes.join(' '),
      state: this.generateState(),
      provider_id: providerId, // Changed from 'providers' to 'provider_id'
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${endpoints.auth}/?${params.toString()}`;
    
    // Debug logging
    console.log('TrueLayer Config:', {
      clientId: TRUELAYER_CONFIG.clientId,
      redirectUri: redirectUri,
      environment: TRUELAYER_CONFIG.environment
    });
    console.log('Generated Auth URL:', authUrl);
    
    return authUrl;
  }

  // Generate random state for OAuth security
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  // Generate PKCE code verifier using expo-crypto
  private async generateCodeVerifier(): Promise<string> {
    const bytes = await Crypto.getRandomBytesAsync(64);
    return this.base64URLEncode(bytes);
  }

  // Generate PKCE code challenge using expo-crypto
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const hash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256, 
      verifier, 
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    
    // Convert base64 string to Uint8Array (web compatible)
    const binaryString = atob(hash);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return this.base64URLEncode(bytes);
  }

  // Base64 URL encoding (web and native compatible)
  private base64URLEncode(buffer: Uint8Array): string {
    // Convert Uint8Array to base64 string
    let binary = '';
    for (let i = 0; i < buffer.length; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }


  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string, redirectUri?: string): Promise<TrueLayerAuthResponse> {
    const endpoints = getEndpoints();
    
    if (!this.codeVerifier) {
      throw new Error('No code verifier available. Please restart the OAuth flow.');
    }
    
    // Use the same redirect URI that was used in the authorization request
    const actualRedirectUri = redirectUri || TRUELAYER_CONFIG.redirectUri;
    
    console.log('TrueLayer Config Debug:', TRUELAYER_CONFIG.debug);
    console.log('Exchanging code for tokens with:', {
      clientId: TRUELAYER_CONFIG.clientId,
      clientSecret: TRUELAYER_CONFIG.clientSecret ? '***' : 'MISSING',
      redirectUri: actualRedirectUri,
      code: code.substring(0, 10) + '...',
      hasCodeVerifier: !!this.codeVerifier,
      codeVerifierLength: this.codeVerifier?.length || 0,
      tokenEndpoint: endpoints.token
    });
    
    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: TRUELAYER_CONFIG.clientId,
      client_secret: TRUELAYER_CONFIG.clientSecret,
      redirect_uri: actualRedirectUri,
      code: code,
      code_verifier: this.codeVerifier, // Add PKCE code verifier
    });

    console.log('Token exchange request body:', requestBody.toString());

    const response = await fetch(`${endpoints.token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    console.log('Token exchange response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', response.status, errorText);
      throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    const tokenData: TrueLayerAuthResponse = await response.json();
    console.log('Token exchange successful');
    await this.storeTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
    
    return tokenData;
  }

  // Refresh access token
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const endpoints = getEndpoints();
    
    const response = await fetch(`${endpoints.auth}/connect/token`, {
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
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const tokenData: TrueLayerAuthResponse = await response.json();
    await this.storeTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
  }

  // Get valid access token (refresh if needed)
  private async getValidAccessToken(): Promise<string> {
    if (!this.isTokenValid()) {
      if (this.refreshToken) {
        await this.refreshAccessToken();
      } else {
        throw new Error('No valid access token available');
      }
    }
    
    return this.accessToken!;
  }

  // Get available bank providers
  async getProviders(): Promise<TrueLayerProvider[]> {
    // For now, return mock providers
    return TRUELAYER_CONFIG.providers.uk;
  }

  // Get user's accounts
  async getAccounts(): Promise<TrueLayerAccount[]> {
    if (!this.isTokenValid()) {
      // Return mock data for testing
      return TRUELAYER_CONFIG.mockAccounts;
    }

    try {
      const token = await this.getValidAccessToken();
      const endpoints = getEndpoints();
      
      const response = await fetch(`${endpoints.data}/data/v1/accounts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch accounts: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Fallback to mock data
      return TRUELAYER_CONFIG.mockAccounts;
    }
  }

  // Get transactions for an account
  async getTransactions(accountId: string, fromDate?: string, toDate?: string): Promise<TrueLayerTransaction[]> {
    if (!this.isTokenValid()) {
      // Return mock data for testing
      return TRUELAYER_CONFIG.mockTransactions.filter(tx => tx.accountId === accountId);
    }

    try {
      const token = await this.getValidAccessToken();
      const endpoints = getEndpoints();
      
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);
      
      const response = await fetch(`${endpoints.data}/data/v1/accounts/${accountId}/transactions?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback to mock data
      return TRUELAYER_CONFIG.mockTransactions.filter(tx => tx.accountId === accountId);
    }
  }

  // Get account balance
  async getAccountBalance(accountId: string): Promise<TrueLayerAccount['balance']> {
    if (!this.isTokenValid()) {
      // Return mock balance for testing
      const mockAccount = TRUELAYER_CONFIG.mockAccounts.find(acc => acc.accountId === accountId);
      return mockAccount?.balance || { available: 0, current: 0, overdraft: 0, limit: 0 };
    }

    try {
      const token = await this.getValidAccessToken();
      const endpoints = getEndpoints();
      
      const response = await fetch(`${endpoints.data}/data/v1/accounts/${accountId}/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results[0];
    } catch (error) {
      console.error('Error fetching balance:', error);
      // Fallback to mock balance
      const mockAccount = TRUELAYER_CONFIG.mockAccounts.find(acc => acc.accountId === accountId);
      return mockAccount?.balance || { available: 0, current: 0, overdraft: 0, limit: 0 };
    }
  }

  // Logout and clear tokens
  async logout(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    
    // Clear stored tokens
    try {
      await this.setStoredToken('truelayer_access_token', '');
      await this.setStoredToken('truelayer_refresh_token', '');
      await this.setStoredToken('truelayer_token_expiry', '');
    } catch (error) {
      console.error('Failed to clear stored tokens:', error);
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.isTokenValid();
  }
}

// Export singleton instance
export const trueLayerService = new TrueLayerService();
