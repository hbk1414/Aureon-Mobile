import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { colors, radii, spacing, shadow, fonts } from '../theme';
import { Card, Chip, SectionHeader } from '../components/ui';
import { KPIStat } from '../components/KPIStat';
import { BudgetProgress } from '../components/BudgetProgress';
import { TransactionRow } from '../components/TransactionRow';
import { InsightCard } from '../components/InsightCard';

// Import components
import PurchaseImpactAnalyzer from '../../components/PurchaseImpactAnalyzer';

const { width } = Dimensions.get('window');

const spendingData = [
  { name: 'Food & Dining', value: 850, color: colors.iosBlue },
  { name: 'Transportation', value: 420, color: colors.iosPurple },
  { name: 'Shopping', value: 680, color: colors.iosViolet },
  { name: 'Entertainment', value: 320, color: colors.iosPink },
  { name: 'Bills & Utilities', value: 1200, color: colors.iosRed },
];

const recentTransactions = [
  { id: 1, description: 'Starbucks Coffee', amount: -12.5, category: 'Food & Dining', date: '2 hours ago' },
  { id: 2, description: 'Salary Deposit', amount: 3500.0, category: 'Income', date: '1 day ago' },
  { id: 3, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: '2 days ago' },
  { id: 4, description: 'Uber Ride', amount: -18.75, category: 'Transportation', date: '3 days ago' },
];

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const totalSpent = spendingData.reduce((sum, item) => sum + item.value, 0);
  const monthlyBudget = 4000;
  const remainingBudget = monthlyBudget - totalSpent;
  const budgetProgress = (totalSpent / monthlyBudget) * 100;

  const chartData = spendingData.map((item, index) => ({
    name: item.name,
    population: item.value,
    color: item.color,
    legendFontColor: colors.text,
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: colors.bg,
    backgroundGradientTo: colors.bg,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.logoContainer, { backgroundColor: `${colors.iosBlue}20` }]}>
            <Ionicons name="wallet" size={20} color={colors.iosBlue} />
          </View>
          <Text style={styles.logoText}>Aureon</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Card style={styles.welcomeSection}>
          <LinearGradient
            colors={[`${colors.iosBlue}20`, `${colors.iosPurple}20`, `${colors.iosViolet}20`]}
            style={styles.welcomeGradient}
          />
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>Welcome back, Alex!</Text>
            <Text style={styles.welcomeSubtitle}>Your financial overview for May 2024</Text>
            
            {/* Total Balance */}
            <View style={styles.balanceContainer}>
              <View style={[styles.balanceIcon, { backgroundColor: `${colors.iosBlue}15` }]}>
                <Ionicons name="cash" size={24} color={colors.iosBlue} />
              </View>
              <KPIStat 
                label="Total Balance"
                value="$12,450"
                delta="+2.5%"
                deltaPositive={true}
              />
            </View>

            {/* Spending and Savings */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.iosRed}15` }]}>
                  <Ionicons name="card" size={20} color={colors.iosRed} />
                </View>
                <KPIStat 
                  label="Monthly Spending"
                  value={`$${totalSpent.toLocaleString()}`}
                  delta="+8.2%"
                  deltaPositive={false}
                />
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: `${colors.iosGreen}15` }]}>
                  <Ionicons name="wallet" size={20} color={colors.iosGreen} />
                </View>
                <KPIStat 
                  label="Savings Goal"
                  value="$8,200"
                  delta="+15.3%"
                  deltaPositive={true}
                />
              </View>
            </View>
          </View>
        </Card>

        {/* Spending Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Breakdown</Text>
          <Text style={styles.sectionSubtitle}>Your spending across different categories</Text>
          
          {/* Pie Chart */}
          <View style={styles.chartContainer}>
            <PieChart
              data={chartData}
              width={width - 40}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            <View style={styles.chartCenter}>
              <KPIStat 
                label="Total Spent"
                value={`$${totalSpent.toLocaleString()}`}
                delta={`${budgetProgress.toFixed(1)}% of budget`}
                deltaPositive={budgetProgress < 80}
              />
            </View>
          </View>

          {/* Budget Progress */}
          <BudgetProgress spent={totalSpent} limit={monthlyBudget} />

          {/* Category Breakdown */}
          <View style={styles.categoriesContainer}>
            {spendingData.map((item, index) => (
              <Card key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: item.color }]} />
                  <Text style={styles.categoryName}>{item.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>${item.value}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <SectionHeader title="Recent Activity" action="View All" onPress={() => console.log('View all transactions')} />
        
        <View style={styles.transactionsContainer}>
          {recentTransactions.slice(0, 4).map((transaction) => (
            <TransactionRow
              key={transaction.id}
              name={transaction.description}
              time={transaction.date}
              amount={`${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}`}
              positive={transaction.amount > 0}
            />
          ))}
        </View>

        {/* AI Insights */}
        <SectionHeader title="AI Insights" />
        
        <View style={styles.insightsContainer}>
          <InsightCard
            title="Great Progress!"
            body="You're 18% under budget this month."
            tone="blue"
          />
          
          <InsightCard
            title="Savings Tip"
            body="Save $120/month by reducing dining out by 30%."
            tone="green"
          />
        </View>

        {/* AI-Powered Features */}
        <SectionHeader title="AI-Powered Features" />

        <View style={styles.insightsContainer}>
          <PurchaseImpactAnalyzer />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: radii.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    margin: spacing.xl,
  },
  welcomeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    ...fonts.h2,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    ...fonts.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  balanceAmount: {
    ...fonts.kpi,
    marginBottom: spacing.xs,
  },
  balanceLabel: {
    ...fonts.body,
    marginBottom: spacing.xs,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  balanceChangeText: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...fonts.body,
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
  viewAllButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  chartCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartCenterAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  chartCenterLabel: {
    ...fonts.body,
  },
  budgetProgress: {
    marginBottom: spacing.xl,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  budgetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 6,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetDetail: {
    ...fonts.body,
    fontSize: 12,
  },
  categoriesContainer: {
    gap: spacing.xs,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  transactionsContainer: {
    gap: spacing.xs,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  transactionDate: {
    ...fonts.body,
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  insightsContainer: {
    gap: spacing.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderLeftWidth: 4,
  },
  insightIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.iosBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  insightText: {
    fontSize: 12,
  },
});
