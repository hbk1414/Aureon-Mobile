"use client"

import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { AnimatedCard } from "../components/AnimatedCard"
import { PullToRefresh } from "../components/PullToRefresh"
import { SpendingChart } from "../components/SpendingChart"
import { visionProColors } from "../../App"

const { width } = Dimensions.get("window")

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<PullToRefresh refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Hero Section */}
        <LinearGradient colors={[visionProColors.primary, visionProColors.purple]} style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroGreeting}>Good morning</Text>
              <Text style={styles.heroName}>Alex Johnson</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>$12,847.32</Text>
            <View style={styles.balanceChange}>
              <Ionicons name="trending-up" size={16} color={visionProColors.green} />
              <Text style={styles.balanceChangeText}>+2.5% from last month</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="card-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.statValue}>$2,340</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="wallet-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.statValue}>$890</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
              <Text style={styles.statValue}>$1,200</Text>
              <Text style={styles.statLabel}>Invested</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <AnimatedCard style={styles.actionCard} hapticType="medium">
              <LinearGradient colors={[visionProColors.primary, visionProColors.lightBlue]} style={styles.actionIcon}>
                <Ionicons name="send" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionTitle}>Send</Text>
              <Text style={styles.actionSubtitle}>Transfer money</Text>
            </AnimatedCard>

            <AnimatedCard style={styles.actionCard} hapticType="medium">
              <LinearGradient colors={[visionProColors.purple, visionProColors.violet]} style={styles.actionIcon}>
                <Ionicons name="card" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionTitle}>Pay</Text>
              <Text style={styles.actionSubtitle}>Bills & services</Text>
            </AnimatedCard>

            <AnimatedCard style={styles.actionCard} hapticType="medium">
              <LinearGradient colors={[visionProColors.green, visionProColors.yellow]} style={styles.actionIcon}>
                <Ionicons name="trending-up" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionTitle}>Invest</Text>
              <Text style={styles.actionSubtitle}>Grow wealth</Text>
            </AnimatedCard>

            <AnimatedCard style={styles.actionCard} hapticType="medium">
              <LinearGradient colors={[visionProColors.orange, visionProColors.red]} style={styles.actionIcon}>
                <Ionicons name="camera" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.actionTitle}>Scan</Text>
              <Text style={styles.actionSubtitle}>Receipt & QR</Text>
            </AnimatedCard>
          </View>
        </View>

        {/* Spending Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spending Overview</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <AnimatedCard hapticType="light">
            <SpendingChart />
            <View style={styles.spendingList}>
              <View style={styles.spendingItem}>
                <View style={styles.spendingCategory}>
                  <LinearGradient
                    colors={[visionProColors.primary, visionProColors.lightBlue]}
                    style={styles.categoryIcon}
                  >
                    <Ionicons name="restaurant" size={16} color="#FFFFFF" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.categoryName}>Food & Dining</Text>
                    <Text style={styles.categoryPercentage}>32% of budget</Text>
                  </View>
                </View>
                <Text style={styles.spendingAmount}>$456.78</Text>
              </View>

              <View style={styles.spendingItem}>
                <View style={styles.spendingCategory}>
                  <LinearGradient colors={[visionProColors.purple, visionProColors.violet]} style={styles.categoryIcon}>
                    <Ionicons name="car" size={16} color="#FFFFFF" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.categoryName}>Transportation</Text>
                    <Text style={styles.categoryPercentage}>18% of budget</Text>
                  </View>
                </View>
                <Text style={styles.spendingAmount}>$234.50</Text>
              </View>

              <View style={styles.spendingItem}>
                <View style={styles.spendingCategory}>
                  <LinearGradient colors={[visionProColors.green, visionProColors.yellow]} style={styles.categoryIcon}>
                    <Ionicons name="bag" size={16} color="#FFFFFF" />
                  </LinearGradient>
                  <View>
                    <Text style={styles.categoryName}>Shopping</Text>
                    <Text style={styles.categoryPercentage}>15% of budget</Text>
                  </View>
                </View>
                <Text style={styles.spendingAmount}>$189.23</Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>View All</Text>
            </TouchableOpacity>
          </View>

          <AnimatedCard hapticType="light">
            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <LinearGradient colors={[visionProColors.green, visionProColors.yellow]} style={styles.merchantIcon}>
                  <Ionicons name="cafe" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Starbucks Coffee</Text>
                  <Text style={styles.transactionDate}>Today, 2:30 PM</Text>
                  <Text style={styles.transactionCategory}>Food & Dining</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>-$5.67</Text>
                <View style={styles.roundUpBadge}>
                  <Text style={styles.roundUpText}>+$0.33</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <LinearGradient
                  colors={[visionProColors.primary, visionProColors.lightBlue]}
                  style={styles.merchantIcon}
                >
                  <Ionicons name="car" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Uber Ride</Text>
                  <Text style={styles.transactionDate}>Yesterday, 6:45 PM</Text>
                  <Text style={styles.transactionCategory}>Transportation</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionAmount}>-$12.34</Text>
                <View style={styles.roundUpBadge}>
                  <Text style={styles.roundUpText}>+$0.66</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <LinearGradient colors={[visionProColors.purple, visionProColors.violet]} style={styles.merchantIcon}>
                  <Ionicons name="business" size={20} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionTitle}>Salary Deposit</Text>
                  <Text style={styles.transactionDate}>Dec 1, 9:00 AM</Text>
                  <Text style={styles.transactionCategory}>Income</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text style={[styles.transactionAmount, styles.positiveAmount]}>+$3,500.00</Text>
              </View>
            </TouchableOpacity>
          </AnimatedCard>
        </View>

        {/* AI Insights Preview Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <AnimatedCard style={styles.aiInsightCard} hapticType="selection">
            <View style={styles.aiInsightHeader}>
              <LinearGradient colors={[visionProColors.magenta, visionProColors.pink]} style={styles.aiIcon}>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.aiInsightContent}>
                <Text style={styles.aiInsightTitle}>Smart Spending Tip</Text>
                <Text style={styles.aiInsightText}>
                  You're spending 15% more on dining this month. Consider cooking at home 2 more times per week to save
                  $120.
                </Text>
              </View>
            </View>
            <View style={styles.aiInsightFooter}>
              <Text style={styles.aiInsightAction}>View All Insights</Text>
              <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
            </View>
          </AnimatedCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  heroSection: {
    padding: 24,
    borderRadius: 20,
    margin: 16,
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  heroGreeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  heroName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  balanceChange: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  balanceChangeText: {
    fontSize: 14,
    color: visionProColors.green,
    marginLeft: 4,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllButton: {
    fontSize: 14,
    color: visionProColors.primary,
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    width: (width - 56) / 2,
  },
  actionCard: {
    flex: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  spendingList: {
    marginTop: 16,
  },
  spendingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  spendingCategory: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  categoryPercentage: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 2,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  transactionCategory: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  positiveAmount: {
    color: "#30D158",
  },
  roundUpBadge: {
    backgroundColor: "rgba(48, 209, 88, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  roundUpText: {
    fontSize: 10,
    color: visionProColors.green,
    fontWeight: "500",
  },
  aiInsightCard: {
    borderColor: `${visionProColors.magenta}40`,
    borderWidth: 1,
  },
  aiInsightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  aiInsightContent: {
    flex: 1,
  },
  aiInsightTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  aiInsightText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  aiInsightFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiInsightAction: {
    fontSize: 14,
    color: visionProColors.primary,
    fontWeight: "500",
  },
})
