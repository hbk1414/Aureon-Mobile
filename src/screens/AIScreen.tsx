import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { useAIInsights, formatCurrency, type AIInsight } from "../services/dataService";
import { AIInsightSkeleton } from "../components/SkeletonLoader";
import { NoAIInsightsEmptyState } from "../components/EmptyState";
import CashFlowSimulator from "../components/CashFlowSimulator";
import AIChatbot from "../components/AIChatbot";

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

export default function AIScreen() {
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseCategory, setPurchaseCategory] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const { aiInsights, loading, error } = useAIInsights();

  const analyzePurchase = () => {
    if (!purchaseAmount || !purchaseCategory) return;

    const amount = parseFloat(purchaseAmount);
    const monthlyIncome = 2800; // Mock monthly income in pounds
    const monthlyExpenses = 1850; // Mock monthly expenses in pounds
    const availableFunds = monthlyIncome - monthlyExpenses;
    const percentageOfIncome = (amount / monthlyIncome) * 100;
    const percentageOfAvailable = (amount / availableFunds) * 100;

    let recommendation = "";
    let canAfford = true;
    let risk = "low";

    if (percentageOfIncome > 20) {
      recommendation = "This purchase represents a significant portion of your income. Consider saving for it over time.";
      canAfford = false;
      risk = "high";
    } else if (percentageOfAvailable > 50) {
      recommendation = "This purchase uses a large portion of your available funds. Ensure you have emergency savings.";
      risk = "medium";
    } else {
      recommendation = "This purchase fits well within your budget. You can afford it comfortably.";
    }

    setAnalysisResult({
      amount,
      percentageOfIncome,
      percentageOfAvailable,
      recommendation,
      canAfford,
      risk,
    });
  };

  const handleInsightAction = (insight: AIInsight) => {
    if (insight.action) {
      switch (insight.action.type) {
        case "navigate":
          // TODO: Navigate to target screen
          console.log(`Navigate to: ${insight.action.target}`);
          break;
        case "modal":
          // TODO: Open modal
          console.log(`Open modal: ${insight.action.target}`);
          break;
        case "external":
          // TODO: Open external link
          console.log(`Open external: ${insight.action.target}`);
          break;
      }
    }
  };

  const handleWhyClick = (insight: AIInsight) => {
    // TODO: Show detailed explanation modal
    console.log(`Why: ${insight.why}`);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return COLORS.red;
      case "medium": return COLORS.orange;
      case "low": return COLORS.green;
      default: return COLORS.mute;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return COLORS.red;
      case "medium": return COLORS.orange;
      case "low": return COLORS.green;
      default: return COLORS.mute;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Financial Coach</Text>
          <Text style={styles.subtitle}>Intelligent insights and analysis</Text>
          
          {/* AI Chatbot Button */}
          <TouchableOpacity
            style={styles.chatbotButton}
            onPress={() => setShowChatbot(true)}
          >
            <Text style={styles.chatbotButtonText}>💬 Ask AI Assistant</Text>
          </TouchableOpacity>
        </View>

        {/* Purchase Impact Analyzer */}
        <View style={styles.analyzerCard}>
          <Text style={styles.cardTitle}>Purchase Impact Analyzer</Text>
          <Text style={styles.cardSubtitle}>"Can I afford it?"</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter purchase amount ($)"
              value={purchaseAmount}
              onChangeText={setPurchaseAmount}
              keyboardType="numeric"
              placeholderTextColor={COLORS.mute}
            />

            <TextInput
              style={styles.categoryInput}
              placeholder="Purchase category (e.g., Electronics, Clothing)"
              value={purchaseCategory}
              onChangeText={setPurchaseCategory}
              placeholderTextColor={COLORS.mute}
            />

            <TouchableOpacity
              style={styles.analyzeButton}
              onPress={analyzePurchase}
            >
              <Text style={styles.analyzeButtonText}>Analyze Purchase</Text>
            </TouchableOpacity>
          </View>

          {analysisResult && (
            <View style={styles.analysisResult}>
              <Text style={styles.resultTitle}>Analysis Result</Text>

              <View style={styles.resultStats}>
                <View style={styles.resultStat}>
                  <Text style={styles.resultLabel}>Amount</Text>
                  <Text style={styles.resultValue}>{formatCurrency(analysisResult.amount)}</Text>
                </View>
                <View style={styles.resultStat}>
                  <Text style={styles.resultLabel}>% of Income</Text>
                  <Text style={styles.resultValue}>{analysisResult.percentageOfIncome.toFixed(1)}%</Text>
                </View>
                <View style={styles.resultStat}>
                  <Text style={styles.resultLabel}>% of Available</Text>
                  <Text style={styles.resultValue}>{analysisResult.percentageOfAvailable.toFixed(1)}%</Text>
                </View>
              </View>

              <View style={[
                styles.affordabilityBadge,
                { backgroundColor: analysisResult.canAfford ? COLORS.green + "20" : COLORS.red + "20" }
              ]}>
                <Text style={[
                  styles.affordabilityText,
                  { color: analysisResult.canAfford ? COLORS.green : COLORS.red }
                ]}>
                  {analysisResult.canAfford ? "✅ Can Afford" : "❌ Cannot Afford"}
                </Text>
              </View>

              <View style={[
                styles.riskBadge,
                { backgroundColor: getRiskColor(analysisResult.risk) + "20" }
              ]}>
                <Text style={[
                  styles.riskText,
                  { color: getRiskColor(analysisResult.risk) }
                ]}>
                  Risk Level: {analysisResult.risk.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.recommendationText}>{analysisResult.recommendation}</Text>
            </View>
          )}
        </View>

        {/* Cash Flow Simulator */}
        <View style={styles.simulatorCard}>
          <CashFlowSimulator />
        </View>

        {/* AI Insights */}
        <View style={styles.insightsCard}>
          <Text style={styles.cardTitle}>AI Insights</Text>
          <Text style={styles.cardSubtitle}>Smart analysis of your financial patterns</Text>

          {loading ? (
            <View style={styles.insightsList}>
              {[1, 2, 3, 4].map((item) => (
                <AIInsightSkeleton key={item} />
              ))}
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Failed to Load</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : aiInsights.length > 0 ? (
            <View style={styles.insightsList}>
              {aiInsights.map((insight) => (
                <View key={insight.id} style={styles.insightItem}>
                  <View style={styles.insightHeader}>
                    <Text style={styles.insightIcon}>{insight.icon}</Text>
                    <View style={styles.insightInfo}>
                      <Text style={styles.insightTitle}>{insight.title}</Text>
                      <View style={[
                        styles.impactBadge,
                        { backgroundColor: getImpactColor(insight.impact) + "20" }
                      ]}>
                        <Text style={[
                          styles.impactText,
                          { color: getImpactColor(insight.impact) }
                        ]}>
                          {insight.impact.toUpperCase()} IMPACT
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Text style={styles.insightDescription}>{insight.description}</Text>
                  <Text style={styles.insightRecommendation}>
                    <Text style={styles.recommendationLabel}>Recommendation: </Text>
                    {insight.recommendation}
                  </Text>

                  <View style={styles.insightActions}>
                    {insight.action && (
                      <TouchableOpacity
                        style={styles.insightAction}
                        onPress={() => handleInsightAction(insight)}
                      >
                        <Text style={styles.insightActionText}>{insight.action.label}</Text>
                      </TouchableOpacity>
                    )}
                    {insight.why && (
                      <TouchableOpacity
                        style={styles.whyButton}
                        onPress={() => handleWhyClick(insight)}
                      >
                        <Text style={styles.whyButtonText}>Why?</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <NoAIInsightsEmptyState />
          )}
        </View>

        {/* Financial Health Score */}
        <View style={styles.healthCard}>
          <Text style={styles.cardTitle}>Financial Health Score</Text>
          <Text style={styles.cardSubtitle}>AI-powered assessment of your financial wellness</Text>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>78</Text>
              <Text style={styles.scoreLabel}>/100</Text>
            </View>
            <View style={styles.scoreDetails}>
              <Text style={styles.scoreTitle}>Good Financial Health</Text>
              <Text style={styles.scoreDescription}>
                You're managing your finances well with room for improvement in savings and investment areas.
              </Text>
            </View>
          </View>

          <View style={styles.healthMetrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Savings Rate</Text>
              <Text style={styles.metricValue}>15%</Text>
              <Text style={styles.metricStatus}>Good</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Debt Ratio</Text>
              <Text style={styles.metricValue}>12%</Text>
              <Text style={styles.metricStatus}>Excellent</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Emergency Fund</Text>
              <Text style={styles.metricValue}>6 months</Text>
              <Text style={styles.metricStatus}>Good</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* AI Chatbot Modal */}
      <Modal
        visible={showChatbot}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIChatbot onClose={() => setShowChatbot(false)} />
      </Modal>
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
  analyzerCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 20,
  },
  inputContainer: {
    gap: 16,
  },
  amountInput: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryInput: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  analyzeButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  analyzeButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: "600",
  },
  analysisResult: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  resultStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  resultStat: {
    alignItems: "center",
    flex: 1,
  },
  resultLabel: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  affordabilityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  affordabilityText: {
    fontSize: 14,
    fontWeight: "600",
  },
  riskBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  riskText: {
    fontSize: 14,
    fontWeight: "600",
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    textAlign: "center",
  },
  simulatorCard: {
    marginHorizontal: 20,
    marginBottom: 20,
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
  insightsList: {
    gap: 16,
  },
  insightItem: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  impactText: {
    fontSize: 10,
    fontWeight: "600",
  },
  insightDescription: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  insightRecommendation: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  recommendationLabel: {
    fontWeight: "600",
  },
  insightActions: {
    flexDirection: "row",
    gap: 12,
  },
  insightAction: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  insightActionText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: "600",
  },
  whyButton: {
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    alignItems: "center",
  },
  whyButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  healthCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.blue + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.blue,
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.blue,
    fontWeight: "600",
  },
  scoreDetails: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  scoreDescription: {
    fontSize: 14,
    color: COLORS.mute,
    lineHeight: 20,
  },
  healthMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metric: {
    alignItems: "center",
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  metricStatus: {
    fontSize: 10,
    color: COLORS.green,
    fontWeight: "600",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.mute,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  chatbotButton: {
    backgroundColor: COLORS.purple,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  chatbotButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: "600",
  },
});
