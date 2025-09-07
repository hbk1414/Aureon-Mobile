import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { createVerifier, createChallenge } from '../utils/pkce';
import { trueLayerDataService } from '../services/truelayerDataService';

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
};

// Bulletproof token exchange function
async function exchangeCodeForTokens(code: string, verifier: string, redirectUri: string) {
  const CLIENT_ID = 'sandbox-aureon-52c96f';
  const CLIENT_SECRET = process.env.TRUELAYER_CLIENT_SECRET || '019bcc14-faad-4806-b6ef-abbd56034f30';
  const TOKEN_URL = 'https://auth.truelayer-sandbox.com/connect/token';
  
  console.log('[TL] token exchange', {
    redirect_uri: redirectUri,
    code_len: String(code || '').length,
    verifier_len: String(verifier || '').length,
    client_id: CLIENT_ID,
  });
  
  if (!code) throw new Error('Missing code');
  if (!verifier) throw new Error('Missing code_verifier');
  if (!redirectUri) throw new Error('Missing redirect_uri');
  
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: redirectUri,                // EXACT authorize redirect (not re-encoded)
    code,
    code_verifier: verifier,               // MUST be the original verifier
  }).toString();
  
  console.log('[TL] token request body:', body);
  
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  
  const text = await response.text();
  console.log('[TL] token response status:', response.status);
  console.log('[TL] token response:', text);
  
  if (!response.ok) {
    console.error('[TL] token error', response.status, text);
    // Add clearer hints:
    if (text.includes('invalid_grant')) {
      throw new Error('invalid_grant: code expired/used or PKCE mismatch');
    }
    if (text.includes('invalid_request')) {
      throw new Error('invalid_request: check redirect_uri exact match + form-encoding');
    }
    throw new Error(`Token exchange failed: ${response.status} ${text}`);
  }
  
  const json = JSON.parse(text);
  console.log('[TL] token ok scopes:', json.scope);
  console.log('[TL] token response keys:', Object.keys(json));
  console.log('[TL] has refresh_token:', !!json.refresh_token);
  console.log('[TL] refresh_token length:', json.refresh_token?.length || 0);
  
  // Store tokens in the data service
  await trueLayerDataService.storeTokens(json);
  
  return json;
}

interface TrueLayerProvider {
  id: string;
  name: string;
  logo: string;
  country: string;
}

interface BankConnectionScreenProps {
  navigation: any;
  route: any;
}

export default function BankConnectionScreen({ navigation, route }: BankConnectionScreenProps) {
  const [providers, setProviders] = useState<TrueLayerProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<TrueLayerProvider | null>(null);

  // Load available bank providers
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      
      // Mock providers for now - replace with actual API call
      const mockProviders: TrueLayerProvider[] = [
        {
          id: 'mock',
          name: 'Mock Bank',
          logo: '🏦',
          country: 'GB'
        }
      ];
      
      setProviders(mockProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      Alert.alert('Error', 'Failed to load bank providers');
    } finally {
      setLoading(false);
    }
  };

  const handleBankSelection = useCallback(async (provider: TrueLayerProvider) => {
    try {
      setConnecting(true);
      setSelectedProvider(provider);
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Use robust PKCE implementation
      const CLIENT_ID = 'sandbox-aureon-52c96f';
      const REDIRECT_URI = 'aureonmobile://oauth/callback'; // Must match exactly what's in TL console
      
      console.log('Starting OAuth flow for:', provider.name);
      
      // Generate PKCE parameters
      const verifier = await createVerifier();
      const challenge = await createChallenge(verifier);
      const state = Math.random().toString(36).slice(2);
      
      // Build authorization URL with exact parameters
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,            // EXACT string
        scope: 'info accounts balance transactions',
        state,
        provider_id: 'mock',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
      
      const authUrl = `https://auth.truelayer-sandbox.com/?${params.toString()}`;
      console.log('[TL] authorize URL:', authUrl);
      
      // Start OAuth session
      const result = await WebBrowser.openAuthSessionAsync(authUrl, REDIRECT_URI);
      
      console.log('OAuth result:', result);
      
      if (result.type !== 'success' || !result.url) {
        console.log('OAuth cancelled by user');
        Alert.alert('Connection Cancelled', 'Bank connection was cancelled');
        return;
      }
      
      // Extract code and verify state
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');
      
      if (!code) {
        console.error('No code returned');
        Alert.alert('Connection Failed', 'No authorization code received');
        return;
      }
      
      if (returnedState !== state) {
        console.error('State mismatch');
        Alert.alert('Connection Failed', 'Security validation failed');
        return;
      }
      
      console.log('OAuth code received, exchanging for tokens...');
      
      // Exchange code for tokens with EXACT redirect_uri + ORIGINAL verifier
      await exchangeCodeForTokens(code, verifier, REDIRECT_URI);
      
      Alert.alert(
        'Success!',
        `Successfully connected to ${provider.name}`,
        [
          {
            text: 'View Banking Data',
            onPress: () => {
              // Navigate to banking dashboard
              navigation.navigate('Banking' as never);
            }
          },
          {
            text: 'Continue',
            onPress: () => {
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error starting OAuth flow:', error);
      Alert.alert('Error', `Failed to connect to bank: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setConnecting(false);
    }
  }, [navigation]);

  // Note: Deep link handling is now handled by AuthSession automatically

  // Manual callback handler for when deep linking doesn't work
  const handleManualCallback = useCallback(() => {
    Alert.alert(
      'Manual Callback',
      'Copy the callback URL from the browser and paste it here. The URL should start with "aureonmobile://oauth/callback"',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'I have the URL', 
          onPress: () => {
            // For web, we can try to get the current URL
            if (Platform.OS === 'web') {
              const currentUrl = window.location.href;
              console.log('🔗 Current web URL:', currentUrl);
              
              if (currentUrl.includes('code=') || currentUrl.includes('aureonmobile://oauth/callback')) {
                Alert.alert(
                  'Processing URL',
                  'Found callback URL in browser. Processing...',
                  [
                    { text: 'OK', onPress: () => {
                      // AuthSession handles this automatically now
                      console.log('Callback URL found:', currentUrl);
                    }}
                  ]
                );
              } else {
                Alert.alert(
                  'No Callback Found',
                  'No callback URL found in current browser address. Please:\n\n1. Complete the OAuth flow\n2. Copy the callback URL from the address bar\n3. Try again'
                );
              }
            } else {
              Alert.alert(
                'Instructions',
                '1. Copy the callback URL from your browser\n2. The URL should contain "code=" and "state=" parameters\n3. Contact support if you need help processing it'
              );
            }
          }
        }
      ]
    );
  }, []);

  // Note: Deep link handling is now handled by AuthSession automatically

  const renderBankProvider = ({ item }: { item: TrueLayerProvider }) => (
    <TouchableOpacity
      style={styles.bankCard}
      onPress={() => handleBankSelection(item)}
      disabled={connecting}
    >
      <View style={styles.bankInfo}>
        <View style={styles.bankLogoContainer}>
          <Text style={styles.bankLogoEmoji}>{item.logo}</Text>
        </View>
        <View style={styles.bankDetails}>
          <Text style={styles.bankName}>{item.name}</Text>
          <Text style={styles.bankCountry}>{item.country}</Text>
        </View>
      </View>
      <View style={styles.connectButton}>
        <Text style={styles.connectButtonText}>
          {connecting && selectedProvider?.id === item.id ? 'Connecting...' : 'Connect'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.blue} />
          <Text style={styles.loadingText}>Loading banks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Connect Your Bank</Text>
        <TouchableOpacity
          style={styles.manualCallbackButton}
          onPress={handleManualCallback}
        >
          <Text style={styles.manualCallbackButtonText}>Manual</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Choose your bank to securely connect your accounts
        </Text>
        
        <FlatList
          data={providers}
          renderItem={renderBankProvider}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.bankList}
        />

        {connecting && (
          <View style={styles.connectingOverlay}>
            <ActivityIndicator size="large" color={COLORS.blue} />
            <Text style={styles.connectingText}>
              Connecting to {selectedProvider?.name}...
            </Text>
            <Text style={styles.connectingSubtext}>
              Please complete the authentication in your browser
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Your data is encrypted and secure. We use TrueLayer's secure API to access your bank data.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 17,
    color: COLORS.blue,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 60,
  },
  manualCallbackButton: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  manualCallbackButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mute,
    textAlign: 'center',
    marginBottom: 24,
  },
  bankList: {
    paddingBottom: 20,
  },
  bankCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bankLogoContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bankLogoEmoji: {
    fontSize: 24,
  },
  bankDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  bankCountry: {
    fontSize: 14,
    color: COLORS.mute,
  },
  connectButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.mute,
    marginTop: 16,
  },
  connectingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  connectingText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    textAlign: 'center',
  },
  connectingSubtext: {
    fontSize: 14,
    color: COLORS.mute,
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.mute,
    textAlign: 'center',
    lineHeight: 18,
  },
});
