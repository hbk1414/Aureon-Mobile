# TrueLayer Redirect URI Setup

## Issue: "invalid redirect uri"

The OAuth flow is failing because the redirect URI `aureonmobile://oauth/callback` is not registered in your TrueLayer console.

## Solution: Register the Redirect URI

1. **Go to your TrueLayer Console:**
   - Visit: https://console.truelayer.com/
   - Log in with your account

2. **Navigate to your app:**
   - Find your app: `sandbox-aureon-52c96f`
   - Click on it to open the app settings

3. **Add the Redirect URI:**
   - Go to the "Redirect URIs" section
   - Add this exact URI: `aureonmobile://oauth/callback`
   - Save the changes

4. **Verify the URI:**
   - Make sure there are no typos
   - The URI should be exactly: `aureonmobile://oauth/callback`
   - No trailing slashes or extra characters

## Alternative: Use Expo Proxy URI (Recommended)

Since you're not logged into Expo CLI, let's use the Expo proxy approach:

1. **In TrueLayer Console, add BOTH redirect URIs:**
   ```
   https://auth.expo.io/@anonymous/aureon-mobile
   aureonmobile://oauth/callback
   ```

2. **The code now uses different URIs for different platforms:**
   ```typescript
   const redirectUri = Platform.OS === 'web' 
     ? 'https://auth.expo.io/@anonymous/aureon-mobile'  // Web
     : 'aureonmobile://oauth/callback';                 // Mobile
   ```

3. **This handles both web and mobile platforms properly**

## Current Configuration

- **App Scheme:** `aureonmobile` (from app.json)
- **Redirect URI:** `aureonmobile://oauth/callback`
- **TrueLayer Client ID:** `sandbox-aureon-52c96f`

## Test the Fix

After adding the redirect URI to TrueLayer console:

1. Refresh your app
2. Try the OAuth flow again
3. The "invalid redirect uri" error should be resolved

## Need Help?

If you're still having issues:
1. Check the TrueLayer console for any error messages
2. Verify the redirect URI is exactly as specified
3. Make sure your app scheme matches in app.json
