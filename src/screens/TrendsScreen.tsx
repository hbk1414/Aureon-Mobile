import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { 
  useMonthlyTrends,
  formatCurrency
} from "../services/dataService";
import MonthlyTrendChart from "../components/MonthlyTrendChart";

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

const RANGES = ['3 Months', '6 Months', '12 Months', 'YTD', 'Custom'] as const;
type RangeKey = typeof RANGES[number];

const COMPARISONS = ['vs Last Month', 'vs 3-Month Avg', 'vs Last Year'] as const;
type ComparisonKey = typeof COMPARISONS[number];

export default function TrendsScreen() {
  const [selectedRange, setSelectedRange] = useState<RangeKey>('6 Months');
  const [selectedComparison, setSelectedComparison] = useState<ComparisonKey>('vs Last Month');
  const { monthlyTrends, loading } = useMonthlyTrends();
  
  // Mock data for extended ranges
  const currentBalance = 8750;
  const totalUpcomingBills = 1200;
  const totalSavingsGoals = 2000;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Trends & Analysis</Text>
            <Text style={styles.subtitle}>Deep dive into your financial patterns</Text>
          </View>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading trends...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trends & Analysis</Text>
          <Text style={styles.subtitle}>Deep dive into your financial patterns</Text>
        </View>

        {/* Range Selector */}
        <View style={styles.rangeContainer}>
          {RANGES.map((range) => (
            <TouchableOpacity
              key={range}
              style={[
                styles.rangeChip,
                selectedRange === range && styles.rangeChipActive
              ]}
              onPress={() => setSelectedRange(range)}
            >
              <Text style={[
                styles.rangeChipText,
                selectedRange === range && styles.rangeChipTextActive
              ]}>
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Income vs Expenses</Text>
            <Text style={styles.chartSubtitle}>Detailed financial trends</Text>
          </View>
          
          <View style={styles.fullChartContainer}>
            <MonthlyTrendChart
              data={monthlyTrends}
              currentBalance={currentBalance}
              upcomingBills={totalUpcomingBills}
              savingsGoals={totalSavingsGoals}
            />
          </View>
        </View>

        {/* Comparison Selector */}
        <View style={styles.comparisonContainer}>
          <Text style={styles.comparisonTitle}>Compare with:</Text>
          <View style={styles.comparisonChips}>
            {COMPARISONS.map((comparison) => (
              <TouchableOpacity
                key={comparison}
                style={[
                  styles.comparisonChip,
                  selectedComparison === comparison && styles.comparisonChipActive
                ]}
                onPress={() => setSelectedComparison(comparison)}
              >
                <Text style={[
                  styles.comparisonChipText,
                  selectedComparison === comparison && styles.comparisonChipTextActive
                ]}>
                  {comparison}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Key Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.insightsTitle}>Key Insights</Text>
          
          <View style={styles.insightItem}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>📈</Text>
              <Text style={styles.insightTitle}>Spending Trend</Text>
            </View>
            <Text style={styles.insightText}>
              Your expenses have decreased by 12% compared to last month, primarily due to reduced entertainment spending.
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>💰</Text>
              <Text style={styles.insightTitle}>Savings Rate</Text>
            </View>
            <Text style={styles.insightText}>
              You're saving 23% of your income, which is above the recommended 20% target.
            </Text>
          </View>

          <View style={styles.insightItem}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightIcon}>🎯</Text>
              <Text style={styles.insightTitle}>Budget Performance</Text>
            </View>
            <Text style={styles.insightText}>
              You're under budget in 4 out of 6 categories this month.
            </Text>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.exportCard}>
          <Text style={styles.exportTitle}>Export & Share</Text>
          <View style={styles.exportButtons}>
            <Pressable style={styles.exportButton}>
              <Text style={styles.exportButtonText}>📊 Export PDF</Text>
            </Pressable>
            <Pressable style={styles.exportButton}>
              <Text style={styles.exportButtonText}>📈 Share Chart</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mute,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.mute,
  },
  rangeContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  rangeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rangeChipActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  rangeChipText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  rangeChipTextActive: {
    color: COLORS.card,
    fontWeight: "600",
  },
  chartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
  },
  fullChartContainer: {
    minHeight: 320,
  },
  comparisonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  comparisonChips: {
    flexDirection: "row",
    gap: 8,
  },
  comparisonChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  comparisonChipActive: {
    backgroundColor: COLORS.blue + "12",
    borderColor: COLORS.blue,
  },
  comparisonChipText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },
  comparisonChipTextActive: {
    color: COLORS.blue,
    fontWeight: "600",
  },
  insightsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  insightText: {
    fontSize: 14,
    color: COLORS.mute,
    lineHeight: 20,
  },
  exportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  exportButtons: {
    flexDirection: "row",
    gap: 12,
  },
  exportButton: {
    flex: 1,
    backgroundColor: COLORS.blue + "12",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.blue + "20",
    alignItems: "center",
  },
  exportButtonText: {
    fontSize: 14,
    color: COLORS.blue,
    fontWeight: "600",
  },
});
