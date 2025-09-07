# TrueLayer Sandbox Setup Guide

## The Issue
You're getting an `invalid_clientid` error because the current credentials in your `.env` file are placeholder values, not real TrueLayer sandbox credentials.

## How to Fix This

### Step 1: Get TrueLayer Sandbox Credentials

1. **Go to TrueLayer Console**: https://console.truelayer.com/
2. **Sign up/Login** to your TrueLayer account
3. **Create a new app** or use an existing one
4. **Make sure you're in Sandbox mode** (not Live)
5. **Copy your credentials**:
   - Client ID (starts with `sandbox-` for sandbox environment)
   - Client Secret (long string)

### Step 2: Update Your .env File

Replace the placeholder values in your `.env` file:

```env
# Replace these placeholder values with your real TrueLayer credentials
TRUELAYER_CLIENT_ID=your-actual-sandbox-client-id
TRUELAYER_CLIENT_SECRET=your-actual-sandbox-client-secret
TRUELAYER_REDIRECT_URI=aureonmobile://oauth/callback
```

### Step 3: Configure Redirect URI

In the TrueLayer Console:
1. Go to **App Settings**
2. Add `aureonmobile://oauth/callback` to your **Redirect URIs**
3. Save the changes

### Step 4: Test the Connection

Once you have real credentials:
1. Update your `.env` file
2. Restart the Expo server (`npm start`)
3. Try connecting to Mock Bank again

## Important Notes

- **Sandbox vs Live**: Make sure you're using sandbox credentials for testing
- **Client ID Format**: Sandbox client IDs start with `sandbox-`
- **Redirect URI**: Must match exactly what you configure in TrueLayer Console
- **Keep Credentials Secret**: Never commit real credentials to version control

## If You Don't Have TrueLayer Account

If you don't have a TrueLayer account yet:
1. Go to https://console.truelayer.com/
2. Sign up for a free account
3. Create a new app in sandbox mode
4. Follow the steps above

## Testing Without Real Credentials (Alternative)

If you want to test the UI without real bank connection, I can modify the app to show a mock success flow instead of making real API calls.
