"use client"

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { GlassmorphismCard } from "../components/GlassmorphismCard"
import { visionProColors } from "../../App"

const { width } = Dimensions.get("window")

export default function AIFeaturesScreen() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState([
    { type: "ai", message: "Hi! I'm your AI Financial Coach. How can I help you today?" },
    { type: "user", message: "How can I save more money this month?" },
    {
      type: "ai",
      message:
        "Based on your spending patterns, I recommend reducing dining out by 2 times per week. This could save you $120 monthly!",
    },
  ])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI Financial Assistant</Text>
          <Text style={styles.headerSubtitle}>Powered by advanced AI to optimize your finances</Text>
        </View>

        {/* AI Financial Coach */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setActiveFeature("coach")}>
            <GlassmorphismCard style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <LinearGradient
                  colors={[visionProColors.primary, visionProColors.lightBlue]}
                  style={styles.featureIcon}
                >
                  <Ionicons name="chatbubbles" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>AI Financial Coach</Text>
                  <Text style={styles.featureSubtitle}>Get personalized financial advice</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>

              <View style={styles.chatPreview}>
                <View style={styles.chatBubble}>
                  <Text style={styles.chatText}>
                    💡 Tip: You can save $120 this month by cooking at home 2 more times per week!
                  </Text>
                </View>
              </View>

              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>Chat with AI Coach</Text>
                <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        </View>

        {/* Predictive Cash Flow */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setActiveFeature("cashflow")}>
            <GlassmorphismCard style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <LinearGradient colors={[visionProColors.purple, visionProColors.violet]} style={styles.featureIcon}>
                  <Ionicons name="analytics" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Predictive Cash Flow</Text>
                  <Text style={styles.featureSubtitle}>AI-powered spending predictions</Text>
                </View>
                <View style={[styles.statusBadge, styles.warningBadge]}>
                  <Text style={styles.statusText}>Alert</Text>
                </View>
              </View>

              <View style={styles.predictionContainer}>
                <View style={styles.predictionItem}>
                  <Text style={styles.predictionLabel}>Next Week</Text>
                  <Text style={styles.predictionValue}>$340 spending predicted</Text>
                </View>
                <View style={styles.predictionItem}>
                  <Text style={styles.predictionLabel}>Month End</Text>
                  <Text style={[styles.predictionValue, styles.warningText]}>Low balance warning</Text>
                </View>
              </View>

              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>View Full Forecast</Text>
                <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        </View>

        {/* Receipt Scanner */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setActiveFeature("scanner")}>
            <GlassmorphismCard style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <LinearGradient colors={[visionProColors.green, visionProColors.yellow]} style={styles.featureIcon}>
                  <Ionicons name="camera" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Smart Receipt Scanner</Text>
                  <Text style={styles.featureSubtitle}>AI expense categorization</Text>
                </View>
                <TouchableOpacity style={styles.scanButton}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.scannerPreview}>
                <View style={styles.recentScan}>
                  <Ionicons name="receipt" size={16} color={visionProColors.green} />
                  <Text style={styles.scanText}>Starbucks - $5.67 (Food & Dining)</Text>
                </View>
                <View style={styles.recentScan}>
                  <Ionicons name="receipt" size={16} color={visionProColors.purple} />
                  <Text style={styles.scanText}>Uber - $12.34 (Transportation)</Text>
                </View>
              </View>

              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>Scan New Receipt</Text>
                <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        </View>

        {/* Bill Optimization */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setActiveFeature("bills")}>
            <GlassmorphismCard style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <LinearGradient colors={[visionProColors.orange, visionProColors.red]} style={styles.featureIcon}>
                  <Ionicons name="receipt" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Bill Optimization</Text>
                  <Text style={styles.featureSubtitle}>Find better deals automatically</Text>
                </View>
                <View style={[styles.statusBadge, styles.successBadge]}>
                  <Text style={styles.statusText}>Saved $45</Text>
                </View>
              </View>

              <View style={styles.billsContainer}>
                <View style={styles.billItem}>
                  <Text style={styles.billName}>Netflix</Text>
                  <Text style={styles.billAmount}>$15.99/mo</Text>
                  <Text style={styles.billStatus}>✓ Optimized</Text>
                </View>
                <View style={styles.billItem}>
                  <Text style={styles.billName}>Phone Plan</Text>
                  <Text style={styles.billAmount}>$65.00/mo</Text>
                  <Text style={[styles.billStatus, styles.warningText]}>⚠ Can save $20</Text>
                </View>
              </View>

              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>Optimize All Bills</Text>
                <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        </View>

        {/* Behavioral Insights */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setActiveFeature("insights")}>
            <GlassmorphismCard style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <LinearGradient colors={[visionProColors.magenta, visionProColors.pink]} style={styles.featureIcon}>
                  <Ionicons name="psychology" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Behavioral Insights</Text>
                  <Text style={styles.featureSubtitle}>Understand your spending psychology</Text>
                </View>
              </View>

              <View style={styles.insightsContainer}>
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Spending Trigger</Text>
                  <Text style={styles.insightValue}>Weekend evenings</Text>
                </View>
                <View style={styles.insightItem}>
                  <Text style={styles.insightLabel}>Mood Impact</Text>
                  <Text style={styles.insightValue}>+23% when stressed</Text>
                </View>
              </View>

              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>View Full Analysis</Text>
                <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        </View>

        {/* Investment Opportunities */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setActiveFeature("investments")}>
            <GlassmorphismCard style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <LinearGradient colors={[visionProColors.violet, visionProColors.magenta]} style={styles.featureIcon}>
                  <Ionicons name="trending-up" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Investment Opportunities</Text>
                  <Text style={styles.featureSubtitle}>AI-powered market analysis</Text>
                </View>
                <View style={[styles.statusBadge, styles.successBadge]}>
                  <Text style={styles.statusText}>3 New</Text>
                </View>
              </View>

              <View style={styles.investmentContainer}>
                <View style={styles.investmentItem}>
                  <Text style={styles.investmentName}>Tech Growth ETF</Text>
                  <Text style={styles.investmentReturn}>+12.5% potential</Text>
                </View>
                <View style={styles.investmentItem}>
                  <Text style={styles.investmentName}>Green Energy Fund</Text>
                  <Text style={styles.investmentReturn}>+8.3% potential</Text>
                </View>
              </View>

              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>Explore Opportunities</Text>
                <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        </View>

        {/* Purchase Impact Analyzer */}
        <View style={styles.section}>
          <TouchableOpacity onPress={() => setActiveFeature("purchase")}>
            <GlassmorphismCard style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <LinearGradient
                  colors={[visionProColors.lightBlue, visionProColors.primary]}
                  style={styles.featureIcon}
                >
                  <Ionicons name="calculator" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>Purchase Impact Analyzer</Text>
                  <Text style={styles.featureSubtitle}>See how purchases affect your budget</Text>
                </View>
                <TouchableOpacity style={styles.scanButton}>
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.purchasePreview}>
                <Text style={styles.purchaseText}>Last Analysis: iPhone 15 Pro</Text>
                <Text style={styles.purchaseImpact}>Impact: 23% of monthly budget</Text>
              </View>

              <View style={styles.featureFooter}>
                <Text style={styles.featureAction}>Analyze New Purchase</Text>
                <Ionicons name="chevron-forward" size={16} color={visionProColors.primary} />
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
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
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  featureCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  statusBadge: {
    backgroundColor: `${visionProColors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${visionProColors.primary}40`,
  },
  warningBadge: {
    backgroundColor: `${visionProColors.orange}20`,
    borderColor: `${visionProColors.orange}40`,
  },
  successBadge: {
    backgroundColor: `${visionProColors.green}20`,
    borderColor: `${visionProColors.green}40`,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  scanButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${visionProColors.primary}40`,
    justifyContent: "center",
    alignItems: "center",
  },
  chatPreview: {
    marginBottom: 16,
  },
  chatBubble: {
    backgroundColor: `${visionProColors.primary}20`,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${visionProColors.primary}30`,
  },
  chatText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
  },
  predictionContainer: {
    marginBottom: 16,
  },
  predictionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  predictionLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  predictionValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  warningText: {
    color: visionProColors.orange,
  },
  scannerPreview: {
    marginBottom: 16,
  },
  recentScan: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  scanText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 8,
  },
  billsContainer: {
    marginBottom: 16,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  billName: {
    fontSize: 14,
    color: "#FFFFFF",
    flex: 1,
  },
  billAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginHorizontal: 12,
  },
  billStatus: {
    fontSize: 12,
    color: visionProColors.green,
  },
  insightsContainer: {
    marginBottom: 16,
  },
  insightItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  insightLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  insightValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  investmentContainer: {
    marginBottom: 16,
  },
  investmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  investmentName: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  investmentReturn: {
    fontSize: 14,
    fontWeight: "500",
    color: visionProColors.green,
  },
  purchasePreview: {
    marginBottom: 16,
  },
  purchaseText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  purchaseImpact: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  featureFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featureAction: {
    fontSize: 14,
    color: visionProColors.primary,
    fontWeight: "500",
  },
})
