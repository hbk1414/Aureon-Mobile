import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { G, Path, Line, Text as SvgText, Circle } from "react-native-svg";

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
  purple: "#5856D6",
  violet: "#AF52DE",
};

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

interface MonthlyTrendChartProps {
  data: MonthlyData[];
  currentBalance: number;
  upcomingBills: number;
  savingsGoals: number;
}

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = screenWidth - 80; // Account for padding
const chartHeight = 200;
const padding = 40;

export default function MonthlyTrendChart({ 
  data, 
  currentBalance, 
  upcomingBills, 
  savingsGoals 
}: MonthlyTrendChartProps) {
  
  const safeToSpend = currentBalance - upcomingBills - savingsGoals;
  const isSafe = safeToSpend > 0;
  
  // Calculate current month data and trends
  const currentMonth = data[data.length - 1] || { income: 0, expenses: 0, savings: 0, month: "Current" };
  const previousMonth = data[data.length - 2] || { income: 0, expenses: 0, savings: 0, month: "Previous" };
  
  const netFlow = currentMonth.income - currentMonth.expenses;
  const expenseRatio = currentMonth.income > 0 ? (currentMonth.expenses / currentMonth.income) * 100 : 0;
  
  // Calculate trends
  const incomeChange = previousMonth.income > 0 ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100 : 0;
  const expenseChange = previousMonth.expenses > 0 ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100 : 0;
  
  // Financial health scoring
  const getFinancialHealth = () => {
    if (expenseRatio > 90) return { status: 'danger', color: COLORS.red, message: 'High spending risk' };
    if (expenseRatio > 70) return { status: 'warning', color: COLORS.orange, message: 'Monitor spending' };
    return { status: 'good', color: COLORS.green, message: 'Healthy finances' };
  };
  
  const healthStatus = getFinancialHealth();
  
  // Calculate chart scales
  const maxValue = useMemo(() => {
    const maxIncome = Math.max(...data.map(d => d.income));
    const maxExpenses = Math.max(...data.map(d => d.expenses));
    return Math.max(maxIncome, maxExpenses) * 1.1;
  }, [data]);

  const minValue = 0;
  const valueRange = maxValue - minValue;

  // Helper function to convert value to chart coordinates
  const valueToY = (value: number) => {
    return chartHeight - padding - ((value - minValue) / valueRange) * (chartHeight - 2 * padding);
  };

  // Helper function to convert month index to X coordinate
  const monthToX = (index: number) => {
    return padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
  };

  // Generate income line path
  const incomePath = useMemo(() => {
    if (data.length < 2) return "";
    
    const points = data.map((item, index) => {
      const x = monthToX(index);
      const y = valueToY(item.income);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return points;
  }, [data, maxValue]);

  // Generate expenses line path
  const expensesPath = useMemo(() => {
    if (data.length < 2) return "";
    
    const points = data.map((item, index) => {
      const x = monthToX(index);
      const y = valueToY(item.expenses);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return points;
  }, [data, maxValue]);

  // Generate savings area path
  const savingsPath = useMemo(() => {
    if (data.length < 2) return "";
    
    const points = data.map((item, index) => {
      const x = monthToX(index);
      const y = valueToY(item.savings);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    // Close the path to create an area
    const lastPoint = data[data.length - 1];
    const lastX = monthToX(data.length - 1);
    const lastY = valueToY(lastPoint.savings);
    
    return `${points} L ${lastX} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`;
  }, [data, maxValue]);

  return (
    <View style={styles.container}>
      {/* Header with Health Indicator */}
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <Text style={styles.chartTitle}>Financial Overview</Text>
          <View style={[styles.healthBadge, { backgroundColor: healthStatus.color + "20", borderColor: healthStatus.color }]}>
            <View style={[styles.healthDot, { backgroundColor: healthStatus.color }]} />
            <Text style={[styles.healthText, { color: healthStatus.color }]}>
              {healthStatus.message}
            </Text>
          </View>
        </View>
      </View>

      {/* Key Metrics Grid */}
      <View style={styles.metricsGrid}>
        {/* Income Card */}
        <View style={[styles.metricCard, styles.incomeCard]}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Monthly Income</Text>
            <View style={styles.trendContainer}>
              <Text style={[
                styles.trendText, 
                { color: incomeChange >= 0 ? COLORS.green : COLORS.red }
              ]}>
                {incomeChange >= 0 ? '↗' : '↘'} {Math.abs(incomeChange).toFixed(1)}%
              </Text>
            </View>
          </View>
          <Text style={[styles.metricValue, { color: COLORS.green }]}>
            £{currentMonth.income.toLocaleString()}
          </Text>
        </View>

        {/* Expenses Card */}
        <View style={[styles.metricCard, styles.expenseCard]}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>Monthly Expenses</Text>
            <View style={styles.trendContainer}>
              <Text style={[
                styles.trendText, 
                { color: expenseChange <= 0 ? COLORS.green : COLORS.red }
              ]}>
                {expenseChange >= 0 ? '↗' : '↘'} {Math.abs(expenseChange).toFixed(1)}%
              </Text>
            </View>
          </View>
          <Text style={[styles.metricValue, { color: COLORS.red }]}>
            £{currentMonth.expenses.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Net Flow Indicator */}
      <View style={[
        styles.netFlowCard,
        { backgroundColor: netFlow >= 0 ? COLORS.green + "10" : COLORS.red + "10" }
      ]}>
        <View style={styles.netFlowHeader}>
          <Text style={styles.netFlowLabel}>Net Cash Flow</Text>
          <View style={[styles.flowArrow, { backgroundColor: netFlow >= 0 ? COLORS.green : COLORS.red }]}>
            <Text style={styles.flowArrowText}>
              {netFlow >= 0 ? '↑' : '↓'}
            </Text>
          </View>
        </View>
        <Text style={[
          styles.netFlowValue,
          { color: netFlow >= 0 ? COLORS.green : COLORS.red }
        ]}>
          {netFlow >= 0 ? '+' : ''}£{Math.abs(netFlow).toLocaleString()}
        </Text>
        <Text style={styles.netFlowSubtext}>
          You're {netFlow >= 0 ? 'saving' : 'overspending'} this month
        </Text>
      </View>

      {/* Expense Ratio Indicator */}
      <View style={styles.ratioSection}>
        <View style={styles.ratioHeader}>
          <Text style={styles.ratioLabel}>Expense Ratio</Text>
          <Text style={[styles.ratioPercentage, { color: healthStatus.color }]}>
            {expenseRatio.toFixed(0)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(expenseRatio, 100)}%`,
                backgroundColor: healthStatus.color
              }
            ]} 
          />
        </View>
        <Text style={styles.ratioSubtext}>
          of income spent on expenses
        </Text>
      </View>

      {/* Safe-to-Spend Summary */}
      <View style={styles.safeToSpendSummary}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Available to Spend</Text>
          <Text style={[
            styles.summaryAmount,
            { color: isSafe ? COLORS.green : COLORS.red }
          ]}>
            £{Math.abs(safeToSpend).toLocaleString()}
          </Text>
        </View>
        
        {!isSafe && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningBannerText}>
              ⚠️ Overspending detected
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 0,
  },
  
  // Header Section
  headerSection: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },
  healthBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  healthText: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.green,
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.mute,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  trendContainer: {
    backgroundColor: COLORS.card,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: "700",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "800",
  },

  // Net Flow Card
  netFlowCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  netFlowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  netFlowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  flowArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  flowArrowText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: "800",
  },
  netFlowValue: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
  },
  netFlowSubtext: {
    fontSize: 12,
    color: COLORS.mute,
  },

  // Expense Ratio Section
  ratioSection: {
    marginBottom: 20,
  },
  ratioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratioLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  ratioPercentage: {
    fontSize: 18,
    fontWeight: "800",
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  ratioSubtext: {
    fontSize: 12,
    color: COLORS.mute,
    textAlign: "center",
  },

  // Safe to Spend Summary
  safeToSpendSummary: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "900",
  },
  warningBanner: {
    backgroundColor: COLORS.red + "20",
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.red + "40",
  },
  warningBannerText: {
    fontSize: 12,
    color: COLORS.red,
    fontWeight: "600",
    textAlign: "center",
  },
});
