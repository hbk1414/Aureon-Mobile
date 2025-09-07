# TrueLayer Integration Setup Guide

This guide will help you set up TrueLayer's sandbox environment to test bank account integration with your Aureon Mobile app.

## 🚀 Quick Start

### 1. Create TrueLayer Account

1. Go to [TrueLayer Console](https://console.truelayer.com/)
2. Sign up for a free account
3. Create a new application
4. Note down your **Client ID** and **Client Secret**

### 2. Configure Sandbox Environment

1. In the TrueLayer Console, ensure you're in **Sandbox** mode
2. Add your redirect URI: `aureonmobile://oauth/callback`
3. Enable the required scopes:
   - `accounts`
   - `balance`
   - `cards`
   - `direct_debits`
   - `standing_orders`
   - `transactions`
   - `offline_access`

### 3. Update Configuration

Edit `src/services/truelayerConfig.ts`:

```typescript
export const TRUELAYER_CONFIG = {
  environment: 'sandbox',
  clientId: 'your-sandbox-client-id', // Replace with your actual Client ID
  clientSecret: 'your-sandbox-client-secret', // Replace with your actual Client Secret
  redirectUri: 'aureonmobile://oauth/callback',
  // ... rest of config
};
```

### 4. Test with Mock Bank

1. In the TrueLayer Console, go to **Sandbox** → **Mock Bank**
2. Create test credentials:
   - Username: `sandbox`
   - Password: `sandbox`
3. These credentials will work with the Mock Bank provider

## 🔧 Deep Link Setup

### iOS (Expo)

Add to your `app.json`:

```json
{
  "expo": {
    "scheme": "aureonmobile",
    "ios": {
      "bundleIdentifier": "com.yourapp.aureonmobile"
    }
  }
}
```

### Android (Expo)

Add to your `app.json`:

```json
{
  "expo": {
    "scheme": "aureonmobile",
    "android": {
      "package": "com.yourapp.aureonmobile"
    }
  }
}
```

## 🏦 Available Sandbox Banks

The following banks are available in TrueLayer's sandbox environment:

### UK Banks
- **Mock Bank** - Test bank with full functionality
- **Santander** - Real bank simulation
- **Barclays** - Real bank simulation
- **HSBC** - Real bank simulation

### Test Credentials

For Mock Bank:
- Username: `sandbox`
- Password: `sandbox`

For other banks, use the credentials provided in the TrueLayer Console.

## 📱 Testing Flow

### 1. Connect Bank Account

1. Navigate to the **Bank Connection** screen
2. Select a bank provider (e.g., Mock Bank)
3. Complete the OAuth flow in your browser
4. Return to the app via deep link

### 2. View Real Data

Once connected, the app will:
- Display real account balances
- Show actual transactions
- Update spending categories
- Provide accurate financial insights

### 3. Test Features

Test the following features with real data:
- **Transactions**: Real transaction history
- **Balance**: Live account balances
- **Budgets**: Based on actual spending
- **Autosave**: Real transaction round-ups
- **AI Insights**: Based on real spending patterns

## 🔒 Security Considerations

### Production Setup

For production deployment:

1. **Use Secure Storage**: Replace mock storage with `expo-secure-store`
2. **Environment Variables**: Store credentials securely
3. **Token Management**: Implement proper token refresh
4. **Error Handling**: Add comprehensive error handling
5. **Logging**: Add proper logging for debugging

### Secure Storage Implementation

Install secure storage:

```bash
npm install expo-secure-store
```

Update the TrueLayer service:

```typescript
import * as SecureStore from 'expo-secure-store';

// Replace mock storage methods
private async getStoredToken(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

private async setStoredToken(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value);
}
```

## 🧪 Testing Scenarios

### 1. Basic Connection
- Connect to Mock Bank
- Verify account data loads
- Check transaction history

### 2. Multiple Accounts
- Connect bank with multiple accounts
- Test account switching
- Verify balance aggregation

### 3. Transaction Categories
- Test automatic categorization
- Verify merchant detection
- Check spending insights

### 4. Error Handling
- Test with invalid credentials
- Test network failures
- Test token expiration

## 📊 Mock Data Structure

The app includes comprehensive mock data for testing:

### Accounts
- Current Account: £2,500 available
- Savings Account: £8,750 available

### Transactions
- Various transaction types
- Different merchants
- Realistic amounts and dates
- Proper categorization

### Budgets
- Realistic spending limits
- Current spending amounts
- Alert thresholds

## 🔄 Data Flow

1. **User initiates connection** → Bank selection screen
2. **OAuth flow** → Browser opens for authentication
3. **Callback handling** → Deep link returns to app
4. **Token exchange** → Access token obtained
5. **Data fetching** → Real bank data loaded
6. **App updates** → UI reflects real data

## 🐛 Troubleshooting

### Common Issues

1. **Deep link not working**
   - Check scheme configuration
   - Verify redirect URI in TrueLayer Console
   - Test with `npx uri-scheme open aureonmobile://oauth/callback`

2. **Authentication fails**
   - Verify Client ID/Secret
   - Check scopes configuration
   - Ensure sandbox environment

3. **No data loading**
   - Check network connectivity
   - Verify token validity
   - Check API endpoints

4. **Token refresh issues**
   - Implement proper refresh logic
   - Handle token expiration
   - Add retry mechanisms

### Debug Mode

Enable debug logging:

```typescript
// In truelayerService.ts
const DEBUG = true;

if (DEBUG) {
  console.log('TrueLayer Debug:', {
    isAuthenticated: trueLayerService.isAuthenticated(),
    accounts: await trueLayerService.getAccounts(),
    // ... other debug info
  });
}
```

## 📚 Additional Resources

- [TrueLayer Documentation](https://docs.truelayer.com/)
- [Sandbox Guide](https://docs.truelayer.com/docs/sandbox)
- [OAuth Flow Guide](https://docs.truelayer.com/docs/oauth-flow)
- [API Reference](https://docs.truelayer.com/reference)

## 🎯 Next Steps

1. **Complete sandbox testing**
2. **Implement secure storage**
3. **Add error handling**
4. **Test with real banks**
5. **Prepare for production**

## 📞 Support

For TrueLayer-specific issues:
- [TrueLayer Support](https://support.truelayer.com/)
- [Developer Community](https://community.truelayer.com/)

For app integration issues:
- Check the troubleshooting section above
- Review the debug logs
- Test with mock data first
