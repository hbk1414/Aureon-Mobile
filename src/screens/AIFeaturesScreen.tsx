import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, spacing, shadow, fonts } from '../theme';
import { Card, Chip, Button, SectionHeader } from '../components/ui';
import { KPIStat } from '../components/KPIStat';
import { BudgetProgress } from '../components/BudgetProgress';
import { TransactionRow } from '../components/TransactionRow';
import { InsightCard } from '../components/InsightCard';

const aiFeatures = [
  {
    id: 1,
    title: 'Smart Budgeting',
    description: 'AI-powered budget recommendations based on your spending patterns',
    icon: 'trending-up',
    color: colors.iosBlue,
    gradient: [colors.iosBlue, colors.iosPurple] as [string, string],
  },
  {
    id: 2,
    title: 'Expense Categorization',
    description: 'Automatically categorize transactions with 95% accuracy',
    icon: 'card',
    color: colors.iosViolet,
    gradient: [colors.iosViolet, colors.iosPink] as [string, string],
  },
  {
    id: 3,
    title: 'Investment Insights',
    description: 'Get personalized investment recommendations and market analysis',
    icon: 'analytics',
    color: colors.iosRed,
    gradient: [colors.iosRed, colors.iosOrange] as [string, string],
  },
  {
    id: 4,
    title: 'Fraud Detection',
    description: 'Advanced AI algorithms detect suspicious transactions in real-time',
    icon: 'shield-checkmark',
    color: colors.iosYellow,
    gradient: [colors.iosYellow, colors.iosGreen] as [string, string],
  },
  {
    id: 5,
    title: 'Predictive Analytics',
    description: 'Forecast future expenses and cash flow with machine learning',
    icon: 'bulb',
    color: colors.iosLightBlue,
    gradient: [colors.iosLightBlue, colors.iosPurple] as [string, string],
  },
  {
    id: 6,
    title: 'Smart Notifications',
    description: 'Intelligent alerts for unusual spending and budget milestones',
    icon: 'notifications',
    color: colors.iosBlue,
    gradient: [colors.iosBlue, colors.iosViolet] as [string, string],
  },
];

const mockChatHistory = [
  {
    id: 1,
    type: 'ai',
    message: 'Hello! I\'m your AI financial assistant. How can I help you today?',
    timestamp: '2 minutes ago',
  },
  {
    id: 2,
    type: 'user',
    message: 'Can you help me create a budget for next month?',
    timestamp: '1 minute ago',
  },
  {
    id: 3,
    type: 'ai',
    message: 'Of course! Based on your spending patterns, I recommend allocating:\n\n• 50% for essentials (rent, utilities, food)\n• 30% for discretionary spending\n• 20% for savings and investments\n\nWould you like me to create a detailed breakdown?',
    timestamp: 'Just now',
  },
];

export default function AIFeaturesScreen() {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(mockChatHistory);

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatHistory.length + 1,
        type: 'user' as const,
        message: chatMessage.trim(),
        timestamp: 'Just now',
      };
      
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: chatHistory.length + 2,
          type: 'ai' as const,
          message: 'I understand your question. Let me analyze your financial data and provide you with personalized insights. This might take a moment...',
          timestamp: 'Just now',
        };
        setChatHistory(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Features</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={20} color={colors.text} />
        </TouchableOpacity>
        </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* AI Features Grid */}
        <SectionHeader title="AI-Powered Features" />
        <View style={styles.featuresGrid}>
          {aiFeatures.map((feature) => (
            <TouchableOpacity key={feature.id} style={styles.featureCard}>
                <LinearGradient
                colors={feature.gradient}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.featureContent}>
                <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
                  <Ionicons name={feature.icon as any} size={24} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Chat Section */}
        <SectionHeader title="AI Financial Assistant" action="Online" />
          
        <View style={styles.chatContainer}>
          <ScrollView style={styles.chatHistory} showsVerticalScrollIndicator={false}>
            {chatHistory.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.type === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    message.type === 'user' ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.type === 'user' ? styles.userMessageText : styles.aiMessageText,
                    ]}
                  >
                    {message.message}
                  </Text>
                  <Text
                    style={[
                      styles.messageTimestamp,
                      message.type === 'user' ? styles.userTimestamp : styles.aiTimestamp,
                    ]}
                  >
                    {message.timestamp}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Chat Input */}
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatInputContainer}
          >
            <View style={styles.chatInput}>
              <TextInput
                style={styles.input}
                placeholder="Ask me anything about your finances..."
                placeholderTextColor={colors.textMuted}
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  { backgroundColor: chatMessage.trim() ? colors.iosBlue : 'rgba(0, 0, 0, 0.2)' },
                ]}
                onPress={sendMessage}
                disabled={!chatMessage.trim()}
              >
                <Ionicons
                  name="send"
                  size={16}
                  color={chatMessage.trim() ? '#FFFFFF' : colors.textMuted}
                />
          </TouchableOpacity>
        </View>
          </KeyboardAvoidingView>
        </View>

        {/* AI Insights */}
        <SectionHeader title="AI Insights" />
        
        <View style={styles.insightsContainer}>
          <InsightCard
            title="Spending Pattern Detected"
            body="Your entertainment spending is 25% higher than last month. Consider setting a budget limit."
            tone="blue"
          />
          
          <InsightCard
            title="Investment Opportunity"
            body="Based on your savings rate, you could invest $500/month for 8% annual returns."
            tone="green"
          />
          
          <InsightCard
            title="Fraud Alert"
            body="Unusual transaction detected in your account. Review recent activity."
            tone="blue"
          />
        </View>

        {/* AI-Detected Transactions */}
        <SectionHeader title="AI-Detected Transactions" />
        
        <View style={styles.aiTransactionsContainer}>
          <TransactionRow
            name="Starbucks Coffee"
            time="2 hours ago"
            amount="-$12.50"
            positive={false}
          />
          <TransactionRow
            name="Salary Deposit"
            time="1 day ago"
            amount="+$3,500.00"
            positive={true}
          />
          <TransactionRow
            name="Netflix Subscription"
            time="2 days ago"
            amount="-$15.99"
            positive={false}
          />
          <TransactionRow
            name="Freelance Payment"
            time="3 days ago"
            amount="+$800.00"
            positive={true}
          />
        </View>

        {/* AI Budget Insights */}
        <SectionHeader title="AI Budget Insights" />
        
        <View style={styles.budgetInsightsContainer}>
          <Card style={styles.budgetInsightCard}>
            <View style={styles.budgetInsightHeader}>
              <View style={[styles.budgetInsightIcon, { backgroundColor: `${colors.iosBlue}20` }]}>
                <Ionicons name="trending-up" size={20} color={colors.iosBlue} />
              </View>
              <Text style={styles.budgetInsightTitle}>Monthly Budget</Text>
            </View>
            <BudgetProgress spent={2800} limit={4000} />
          </Card>
          
          <Card style={styles.budgetInsightCard}>
            <View style={styles.budgetInsightHeader}>
              <View style={[styles.budgetInsightIcon, { backgroundColor: `${colors.iosGreen}20` }]}>
                <Ionicons name="wallet" size={20} color={colors.iosGreen} />
              </View>
              <Text style={styles.budgetInsightTitle}>Savings Goal</Text>
              </View>
            <BudgetProgress spent={1200} limit={2000} />
          </Card>
        </View>

        {/* AI Insights Overview */}
        <SectionHeader title="AI Insights Overview" />
        
        <View style={styles.insightsGrid}>
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: `${colors.iosBlue}20` }]}>
                <Ionicons name="trending-up" size={20} color={colors.iosBlue} />
              </View>
              <Text style={styles.insightTitle}>Spending Trend</Text>
                </View>
            <KPIStat 
              label="This Month vs Last"
              value="+12.5%"
              delta="Improving"
              deltaPositive={true}
            />
          </Card>
          
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: `${colors.iosGreen}20` }]}>
                <Ionicons name="wallet" size={20} color={colors.iosGreen} />
              </View>
              <Text style={styles.insightTitle}>Savings Rate</Text>
        </View>
            <KPIStat 
              label="Monthly Goal Progress"
              value="78%"
              delta="On Track"
              deltaPositive={true}
            />
          </Card>
          
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: `${colors.iosPurple}20` }]}>
                <Ionicons name="bulb" size={20} color={colors.iosPurple} />
              </View>
              <Text style={styles.insightTitle}>AI Score</Text>
            </View>
            <KPIStat 
              label="Financial Health"
              value="A+"
              delta="Excellent"
              deltaPositive={true}
            />
          </Card>
          
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: `${colors.iosOrange}20` }]}>
                <Ionicons name="flash" size={20} color={colors.iosOrange} />
              </View>
              <Text style={styles.insightTitle}>Risk Level</Text>
              </View>
            <KPIStat 
              label="Investment Profile"
              value="Low"
              delta="Conservative"
              deltaPositive={true}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    ...fonts.title,
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    ...fonts.h2,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  sectionSubtitle: {
    ...fonts.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.iosGreen,
  },
  statusText: {
    fontSize: 12,
    color: colors.iosGreen,
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  featureGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  featureContent: {
    padding: spacing.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  chatContainer: {
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...shadow.card,
  },
  chatHistory: {
    maxHeight: 300,
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: spacing.sm,
    borderRadius: radii.lg,
  },
  userBubble: {
    backgroundColor: colors.iosBlue,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: colors.text,
  },
  messageTimestamp: {
    fontSize: 10,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: colors.textMuted,
  },
  chatInputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetInsightsContainer: {
    gap: spacing.md,
  },
  budgetInsightCard: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadow.card,
  },
  budgetInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  budgetInsightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetInsightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  insightsContainer: {
    gap: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  insightButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  insightCard: {
    width: '48%',
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: spacing.md,
    padding: spacing.md,
    ...shadow.card,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiTransactionsContainer: {
    gap: spacing.md,
  },
});
