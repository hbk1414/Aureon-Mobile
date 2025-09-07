import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  Card, 
  Chip, 
  Button, 
  SectionHeader, 
  CategoryRow, 
  HeroCard, 
  ScreenContainer, 
  ProgressBar, 
  StatPill, 
  PredictiveCashflow 
} from "../components/ui";
import { C, R, S, SHADOW, type } from "../theme";

export default function DashboardMaterio() {
  return (
    <ScreenContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <HeroCard
          title="Welcome back, Alex!"
          subtitle="Your financial health is looking great this month"
          icon="💰"
          trend="+12.5%"
          trendLabel="vs last month"
          trendPositive={true}
        />

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <StatPill value="$2,450" label="Monthly Budget" tone="blue" />
          <StatPill value="85%" label="Savings Rate" tone="green" />
          <StatPill value="12.5%" label="Growth" tone="purple" />
        </View>

        {/* Predictive Cash Flow */}
        <Card style={styles.section}>
          <PredictiveCashflow
            todayBalance={2500}
            weeks={[
              { label: "Week 1", balance: 2200 },
              { label: "Week 2", balance: 1800 },
              { label: "Week 3", balance: 1500 },
              { label: "Week 4", balance: 1200 }
            ]}
            day30Balance={800}
            threshold={1000}
          />
        </Card>

        {/* Budget Progress */}
        <Card style={styles.section}>
          <SectionHeader title="Budget Overview" />
          <ProgressBar label="Groceries" value={320} total={500} />
          <ProgressBar label="Entertainment" value={180} total={300} />
          <ProgressBar label="Transport" value={95} total={200} />
          <ProgressBar label="Shopping" value={420} total={400} />
        </Card>

        {/* Categories */}
        <Card style={styles.section}>
          <SectionHeader title="Top Categories" />
          <CategoryRow label="Food & Dining" amount={450} percentage={25} color={C.blue} />
          <CategoryRow label="Shopping" amount={380} percentage={21} color={C.purple} />
          <CategoryRow label="Transport" amount={280} percentage={16} color={C.green} />
          <CategoryRow label="Entertainment" amount={220} percentage={12} color={C.orange} />
        </Card>

        {/* Quick Actions */}
        <Card style={styles.section}>
          <SectionHeader title="Quick Actions" />
          <View style={styles.actionButtons}>
            <Button title="Scan Receipt" onPress={() => {}} style={styles.actionButton} />
            <Button title="Add Transaction" onPress={() => {}} style={styles.actionButton} />
            <Button title="Set Budget" onPress={() => {}} style={styles.actionButton} />
          </View>
        </Card>

        {/* AI Insights */}
        <Card style={styles.section}>
          <SectionHeader title="AI Insights" />
          <View style={styles.insight}>
            <Text style={styles.insightText}>
              💡 Your entertainment spending is 15% higher than usual this month. 
              Consider setting a weekly limit to stay on track.
            </Text>
          </View>
          <View style={styles.insight}>
            <Text style={styles.insightText}>
              🎯 Great job! You're saving 25% more than your goal. 
              This puts you ahead of schedule for your vacation fund.
            </Text>
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={styles.section}>
          <SectionHeader title="Recent Activity" />
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>🛒</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Grocery Store</Text>
              <Text style={styles.activitySubtitle}>Today • $45.20</Text>
            </View>
            <Chip text="Food" />
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityIconText}>🚗</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Gas Station</Text>
              <Text style={styles.activitySubtitle}>Yesterday • $32.50</Text>
            </View>
            <Chip text="Transport" />
          </View>
        </Card>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: S.lg,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: S.sm,
    marginBottom: S.lg,
  },
  section: {
    marginBottom: S.lg,
  },
  actionButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: S.sm,
  },
  actionButton: {
    flex: 1,
    minWidth: "30%",
  },
  insight: {
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: S.md,
    marginBottom: S.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  insightText: {
    ...type.body,
    lineHeight: 20,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: S.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: S.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  activityIconText: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...type.h2,
    marginBottom: 2,
  },
  activitySubtitle: {
    ...type.body,
    color: C.muted,
  },
  bottomSpacing: {
    height: S.xxl,
  },
});
