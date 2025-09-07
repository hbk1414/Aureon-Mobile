# TrueLayer Banking Integration

This implementation provides a complete TrueLayer banking integration with OAuth authentication, data fetching, and automatic synchronization.

## 🚀 Features Implemented

### ✅ OAuth Authentication
- **Robust PKCE Implementation**: RFC 7636 compliant code verifier/challenge generation
- **Secure Token Storage**: Using `expo-secure-store` for encrypted token storage
- **Automatic Token Refresh**: Handles token expiration and refresh seamlessly
- **Platform-Specific Redirect URIs**: Works on both web and mobile platforms

### ✅ Data Fetching
- **Account Information**: Retrieve all connected bank accounts
- **Real-Time Balances**: Get current and available balances for each account
- **Transaction History**: Fetch transaction data with date filtering
- **Offline Support**: Cached data available when offline

### ✅ Data Synchronization
- **Periodic Sync**: Automatic data refresh every 15 minutes
- **App State Awareness**: Syncs when app becomes active
- **Retry Logic**: Exponential backoff for failed syncs
- **Manual Refresh**: Pull-to-refresh and manual sync options

### ✅ React Hooks
- **useTrueLayerAccounts**: Manage account data
- **useTrueLayerBalances**: Handle balance information
- **useTrueLayerTransactions**: Access transaction history
- **useTrueLayerDataSync**: Complete data synchronization
- **useTrueLayerConnection**: Connection status management

## 📁 File Structure

```
src/
├── services/
│   ├── truelayerDataService.ts    # Core TrueLayer API service
│   ├── dataSyncService.ts          # Periodic sync management
│   └── truelayerConfig.ts         # Configuration and endpoints
├── hooks/
│   └── useTrueLayerData.ts        # React hooks for data access
├── utils/
│   └── pkce.ts                    # PKCE implementation
├── screens/
│   ├── BankConnectionScreen.tsx   # OAuth flow
│   └── BankingDashboardScreen.tsx # Complete banking dashboard
└── components/
    └── BankingSummaryCard.tsx     # Example usage component
```

## 🔧 Usage Examples

### Basic Data Fetching

```typescript
import { useTrueLayerDataSync } from '../hooks/useTrueLayerData';

function MyComponent() {
  const { accounts, balances, transactions, loading, syncAllData } = useTrueLayerDataSync();
  
  const totalBalance = balances.reduce((total, balance) => total + balance.current, 0);
  
  return (
    <View>
      <Text>Total Balance: £{totalBalance.toFixed(2)}</Text>
      <Text>Accounts: {accounts.length}</Text>
      <Button title="Refresh" onPress={syncAllData} />
    </View>
  );
}
```

### Individual Data Hooks

```typescript
import { useTrueLayerAccounts, useTrueLayerBalances } from '../hooks/useTrueLayerData';

function AccountList() {
  const { accounts, loading, fetchAccounts } = useTrueLayerAccounts();
  const { balances } = useTrueLayerBalances();
  
  return (
    <View>
      {accounts.map(account => {
        const balance = balances.find(b => b.account_id === account.account_id);
        return (
          <View key={account.account_id}>
            <Text>{account.display_name}</Text>
            <Text>£{balance?.current || 0}</Text>
          </View>
        );
      })}
    </View>
  );
}
```

### Transaction History

```typescript
import { useTrueLayerTransactions } from '../hooks/useTrueLayerData';

function TransactionList({ accountId }: { accountId: string }) {
  const { transactions, loading, fetchTransactions } = useTrueLayerTransactions(accountId);
  
  // Get last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  useEffect(() => {
    fetchTransactions(thirtyDaysAgo.toISOString().split('T')[0]);
  }, [accountId]);
  
  return (
    <View>
      {transactions.map(transaction => (
        <View key={transaction.transaction_id}>
          <Text>{transaction.description}</Text>
          <Text>£{transaction.amount}</Text>
        </View>
      ))}
    </View>
  );
}
```

## 🔐 Security Features

### Token Management
- **Secure Storage**: All tokens stored using `expo-secure-store`
- **Automatic Refresh**: Tokens refreshed before expiration
- **Cleanup**: All data cleared on disconnect

### PKCE Implementation
- **RFC 7636 Compliant**: Proper code verifier/challenge generation
- **Cryptographically Secure**: Uses `expo-crypto` for random generation
- **Cross-Platform**: Works on web and mobile

## 📊 Data Sync Configuration

### Automatic Sync
```typescript
import { dataSyncService } from '../services/dataSyncService';

// Start periodic sync (every 15 minutes)
dataSyncService.startPeriodicSync();

// Update sync interval
dataSyncService.updateConfig({
  intervalMinutes: 30, // Sync every 30 minutes
  syncOnAppForeground: true,
  syncOnAppBackground: false,
});

// Manual sync
await dataSyncService.syncAllData();
```

### Sync Status
```typescript
const status = dataSyncService.getStatus();
console.log('Sync running:', status.isRunning);
console.log('Currently syncing:', status.isSyncing);
console.log('Retry count:', status.retryCount);
```

## 🎨 UI Components

### Banking Dashboard
The `BankingDashboardScreen` provides a complete banking interface with:
- Total balance overview
- Account list with balances
- Recent transaction history
- Pull-to-refresh functionality
- Sync settings and disconnect options

### Summary Card
The `BankingSummaryCard` is a reusable component for displaying:
- Total balance
- Account count
- Top 3 accounts with balances
- Manual refresh button

## 🔄 Data Flow

1. **OAuth Flow**: User connects bank via `BankConnectionScreen`
2. **Token Storage**: Access/refresh tokens stored securely
3. **Initial Sync**: First data fetch after connection
4. **Periodic Sync**: Automatic updates every 15 minutes
5. **Manual Refresh**: User-triggered data updates
6. **Offline Access**: Cached data available when offline

## 🚨 Error Handling

### Connection Errors
- **Authentication Failed**: Automatic token refresh attempt
- **Network Errors**: Graceful fallback to cached data
- **API Errors**: Clear error messages with retry options

### Sync Errors
- **Retry Logic**: Exponential backoff for failed syncs
- **Max Retries**: Prevents infinite retry loops
- **User Notification**: Clear error messages and retry buttons

## 📱 Platform Support

### Mobile (iOS/Android)
- **Custom Scheme**: `aureonmobile://oauth/callback`
- **Deep Linking**: Proper OAuth callback handling
- **Secure Storage**: Native secure storage for tokens

### Web
- **Expo Proxy**: `https://auth.expo.io/@anonymous/aureon-mobile`
- **Browser Storage**: Secure token storage in browser
- **Cross-Origin**: Proper CORS handling

## 🔧 Configuration

### Environment Variables
```env
TRUELAYER_CLIENT_ID=sandbox-aureon-52c96f
TRUELAYER_CLIENT_SECRET=your-secret-here
TRUELAYER_REDIRECT_URI=aureonmobile://oauth/callback
```

### TrueLayer Console Setup
Add these redirect URIs to your TrueLayer console:
- `aureonmobile://oauth/callback` (mobile)
- `https://auth.expo.io/@anonymous/aureon-mobile` (web)

## 🎯 Next Steps

1. **Production Setup**: Switch from sandbox to live TrueLayer
2. **Real Banks**: Connect to actual UK banks
3. **Enhanced UI**: Add charts, categories, and insights
4. **Notifications**: Push notifications for transactions
5. **Analytics**: Track user behavior and app usage

## 📚 API Reference

### TrueLayerDataService
- `getAccounts()`: Fetch all connected accounts
- `getAccountBalances(accountIds?)`: Get account balances
- `getTransactions(accountId, fromDate?, toDate?)`: Get transaction history
- `syncAllData()`: Complete data synchronization
- `isConnected()`: Check connection status
- `disconnect()`: Clear all stored data

### Data Sync Service
- `startPeriodicSync()`: Start automatic sync
- `stopPeriodicSync()`: Stop automatic sync
- `syncData()`: Manual data sync
- `updateConfig(config)`: Update sync settings
- `getStatus()`: Get current sync status

This implementation provides a robust, secure, and user-friendly banking integration that handles all the complexities of OAuth, data fetching, and synchronization automatically.
