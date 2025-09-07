# Overview

Aureon Mobile App is a modern AI-powered financial management application built with React Native and Expo. The app provides comprehensive financial tracking, budgeting, AI-powered insights, and banking integration capabilities. It focuses on delivering a polished user experience with real-time data synchronization, predictive analytics, and smart financial recommendations to help users manage their money effectively.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React Native 0.79.5 with Expo SDK 53 for cross-platform mobile development
- **Navigation**: React Navigation v6 with bottom tab navigation for main app sections
- **UI Components**: Custom component library with glassmorphism design patterns and Apple-inspired color palette
- **State Management**: React hooks pattern with custom data service hooks for API integration
- **Styling**: StyleSheet-based styling with a centralized theme system supporting multiple color schemes
- **Charts**: React Native Chart Kit and React Native Gifted Charts for data visualization
- **Platform Support**: iOS, Android, and Web with platform-specific optimizations

## Data Management
- **API Integration**: TrueLayer banking API for real-time financial data with OAuth 2.0 + PKCE authentication
- **Local Storage**: Expo SecureStore for sensitive data (tokens, credentials) and AsyncStorage for app preferences
- **Data Synchronization**: Automated background sync service with retry logic and offline support
- **Caching Strategy**: Local caching of API responses with periodic refresh and manual pull-to-refresh

## Security & Authentication
- **Banking Authentication**: OAuth 2.0 with PKCE (Proof Key for Code Exchange) for TrueLayer integration
- **Token Management**: Automatic token refresh with secure storage using Expo SecureStore
- **Environment Variables**: Secure credential management via react-native-dotenv
- **Redirect URI Handling**: Platform-specific deep linking for OAuth callbacks

## User Interface Design
- **Design System**: Apple-inspired design language with Vision Pro color palette
- **Glassmorphism**: Blur effects and translucent components using Expo Blur
- **Responsive Layout**: Adaptive design for different screen sizes and orientations
- **Haptic Feedback**: Native haptic feedback integration for enhanced user experience
- **Loading States**: Skeleton screens and loading indicators for smooth user experience

## AI Features Architecture
- **Predictive Analytics**: Cash flow forecasting and spending pattern analysis
- **Smart Categorization**: Automatic transaction categorization with machine learning
- **Chatbot Interface**: AI financial assistant with contextual recommendations
- **Purchase Impact Analysis**: Real-time spending impact assessment with budget recommendations

## Development & Build System
- **TypeScript**: Full TypeScript support for type safety and better development experience
- **Metro Bundler**: Optimized bundling configuration for performance
- **Babel Configuration**: Custom Babel setup with dotenv plugin for environment variable support
- **Cross-Platform Build**: Unified build system supporting iOS, Android, and Web deployments

# External Dependencies

## Banking & Financial Services
- **TrueLayer API**: Sandbox and production banking data integration for UK banks
- **Mock Bank Provider**: Testing environment with simulated banking data
- **OAuth Provider**: TrueLayer's authentication service for secure bank connections

## Development Services
- **Expo Services**: Development platform providing native API access and build services
- **Expo Web Browser**: In-app browser for OAuth flows
- **Expo Auth Session**: Secure authentication flow management

## UI & Media Libraries
- **Expo Google Fonts**: Poppins font family for consistent typography
- **Expo Vector Icons**: Ionicons icon set for UI elements
- **Expo Image Picker**: Camera and photo library access for receipt scanning
- **Expo Linear Gradient**: Native gradient support for UI enhancements
- **Expo Blur**: Native blur effects for glassmorphism design

## Data Visualization
- **React Native Chart Kit**: Chart components for financial data visualization
- **React Native Gifted Charts**: Advanced charting library for complex financial graphs
- **React Native SVG**: SVG support for custom charts and graphics

## Utility Libraries
- **Expo Crypto**: Cryptographic functions for PKCE implementation
- **Expo Haptics**: Native haptic feedback integration
- **Lottie React Native**: Animation library for micro-interactions
- **React Native Gesture Handler**: Enhanced gesture support for smooth interactions

## Development Tools
- **HTTP Proxy**: Development proxy server for Replit environment
- **React Native Dotenv**: Environment variable management
- **TypeScript**: Static type checking and enhanced development experience