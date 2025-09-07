# Aureon Mobile App

A modern, AI-powered financial management application built with React Native and Expo.

## Features

### 🏠 **Dashboard**
- Financial overview with spending breakdown
- Interactive charts and visualizations
- Budget progress tracking
- AI-generated insights and recommendations

### 💳 **Transactions**
- Comprehensive transaction history
- Smart categorization and filtering
- Search and analytics
- Income vs. expense tracking

### 🤖 **AI Features**
- AI Financial Assistant chat
- Purchase Impact Analyzer
- Smart budgeting recommendations
- Fraud detection alerts
- Predictive cash flow analysis

### 👤 **Profile & Settings**
- User profile management
- Security and privacy settings
- Financial preferences
- Connected accounts management

## Tech Stack

- **Framework**: React Native 0.79.5
- **Development Platform**: Expo SDK 53
- **Navigation**: React Navigation v6
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: React Native StyleSheet
- **Language**: TypeScript

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aureon-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go
   - **Web**: Press `w` in the terminal

### Alternative Start Script

Use the provided shell script to avoid file descriptor limits:

```bash
chmod +x start-mobile.sh
./start-mobile.sh
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── PurchaseImpactAnalyzer.tsx
├── screens/            # Main app screens
│   ├── DashboardScreen.tsx
│   ├── TransactionsScreen.tsx
│   ├── AIFeaturesScreen.tsx
│   └── ProfileScreen.tsx
App.tsx                 # Main app component with navigation
```

## Key Components

### DashboardScreen
- Financial overview with charts
- Budget progress tracking
- Recent transactions
- AI insights

### TransactionsScreen
- Transaction history with filters
- Category-based organization
- Search functionality
- Financial summaries

### AIFeaturesScreen
- AI-powered tools showcase
- Interactive chat with AI assistant
- Feature demonstrations
- Personalized recommendations

### ProfileScreen
- User profile management
- Settings and preferences
- Account information
- App configuration

## Configuration

### App Configuration (`app.json`)
- App name: Aureon
- Bundle identifier: com.aureon.mobile
- SDK version: 53.0.0
- User interface style: Light

### Metro Configuration (`metro.config.js`)
- Optimized file watching
- Reduced file descriptor usage
- Enhanced bundling performance

## Development

### Available Scripts
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

### Code Style
- TypeScript for type safety
- Consistent component structure
- Modern React Native patterns
- Responsive design principles

## Troubleshooting

### Common Issues

1. **File descriptor limits (EMFILE error)**
   - Use `./start-mobile.sh` script
   - Increase system limits: `ulimit -n 65536`

2. **Metro bundler issues**
   - Clear cache: `npx expo start --clear`
   - Restart development server

3. **SDK compatibility**
   - Ensure Expo Go app version matches project SDK
   - Update dependencies to compatible versions

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new components
3. Maintain consistent styling patterns
4. Test on both iOS and Android platforms

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ using React Native and Expo
