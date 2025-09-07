import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useCashFlowForecast, simulateCashFlow, formatCurrency, type CashFlowForecast } from "../services/dataService";

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
};

interface CashFlowSimulatorProps {
  onSimulate?: (forecast: CashFlowForecast[]) => void;
}

export default function CashFlowSimulator({ onSimulate }: CashFlowSimulatorProps) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<CashFlowForecast[] | null>(null);
  const { forecast, loading } = useCashFlowForecast();

  const handleSimulate = () => {
    if (!amount || !category) {
      Alert.alert("Missing Information", "Please enter both amount and category.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive number.");
      return;
    }

    setIsSimulating(true);
    
    // Simulate the impact
    const result = simulateCashFlow(numAmount, category);
    setSimulationResult(result);
    
    if (onSimulate) {
      onSimulate(result);
    }
    
    setIsSimulating(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return COLORS.red;
      case "medium": return COLORS.orange;
      case "low": return COLORS.green;
      default: return COLORS.mute;
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return "⚠️";
      case "medium": return "⚡";
      case "low": return "✅";
      default: return "❓";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cash Flow Simulator</Text>
        <Text style={styles.subtitle}>Loading forecast data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cash Flow Simulator</Text>
      <Text style={styles.subtitle}>
        See how additional spending affects your future balance
      </Text>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Amount ($)</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="200"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholderTextColor={COLORS.mute}
          />
        </View>
        
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Category</Text>
          <TextInput
            style={styles.categoryInput}
            placeholder="Shopping, Food, etc."
            value={category}
            onChangeText={setCategory}
            placeholderTextColor={COLORS.mute}
          />
        </View>

        <TouchableOpacity
          style={[styles.simulateButton, isSimulating && styles.simulateButtonDisabled]}
          onPress={handleSimulate}
          disabled={isSimulating}
        >
          <Text style={styles.simulateButtonText}>
            {isSimulating ? "Simulating..." : "Simulate Impact"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simulation Results */}
      {simulationResult && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Simulation Results</Text>
          <Text style={styles.resultsSubtitle}>
            Impact of {formatCurrency(parseFloat(amount))} on {category}
          </Text>

          <View style={styles.forecastList}>
            {simulationResult.map((item, index) => (
              <View key={index} style={styles.forecastItem}>
                <View style={styles.forecastHeader}>
                  <Text style={styles.forecastDate}>{item.date}</Text>
                  <View style={[
                    styles.riskBadge,
                    { backgroundColor: getRiskColor(item.risk) + "20" }
                  ]}>
                    <Text style={[
                      styles.riskText,
                      { color: getRiskColor(item.risk) }
                    ]}>
                      {getRiskIcon(item.risk)} {item.risk.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.forecastDetails}>
                  <View style={styles.forecastRow}>
                    <Text style={styles.forecastLabel}>Projected Balance:</Text>
                    <Text style={[
                      styles.forecastValue,
                      { color: item.projectedBalance < 1000 ? COLORS.red : COLORS.text }
                    ]}>
                      {formatCurrency(item.projectedBalance)}
                    </Text>
                  </View>
                  
                  <View style={styles.forecastRow}>
                    <Text style={styles.forecastLabel}>Income:</Text>
                    <Text style={[styles.forecastValue, { color: COLORS.green }]}>
                      {formatCurrency(item.income)}
                    </Text>
                  </View>
                  
                  <View style={styles.forecastRow}>
                    <Text style={styles.forecastLabel}>Expenses:</Text>
                    <Text style={[styles.forecastValue, { color: COLORS.red }]}>
                      {formatCurrency(item.expenses)}
                    </Text>
                  </View>
                </View>

                {item.warnings.length > 0 && (
                  <View style={styles.warningsContainer}>
                    {item.warnings.map((warning, warningIndex) => (
                      <Text key={warningIndex} style={styles.warningText}>
                        ⚠️ {warning}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>
              Adding {formatCurrency(parseFloat(amount))} in {category} spending will impact your cash flow over the next 30 days.
              {simulationResult.some(item => item.risk === "high") && 
                " Consider delaying this purchase or reducing spending in other categories."
              }
            </Text>
          </View>
        </View>
      )}

      {/* Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>💰</Text>
          <Text style={styles.tipText}>Keep at least £800 buffer for unexpected expenses</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>📅</Text>
          <Text style={styles.tipText}>Plan major purchases around payday for better cash flow</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>🎯</Text>
          <Text style={styles.tipText}>Use this simulator before making purchases over £75</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
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
  simulateButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  simulateButtonDisabled: {
    backgroundColor: COLORS.mute,
  },
  simulateButtonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: "600",
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 16,
  },
  forecastList: {
    gap: 16,
  },
  forecastItem: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  forecastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 11,
    fontWeight: "600",
  },
  forecastDetails: {
    marginBottom: 12,
  },
  forecastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  forecastLabel: {
    fontSize: 14,
    color: COLORS.mute,
  },
  forecastValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  warningsContainer: {
    backgroundColor: COLORS.orange + "10",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.orange + "20",
  },
  warningText: {
    fontSize: 12,
    color: COLORS.orange,
    marginBottom: 4,
    lineHeight: 16,
  },
  summaryCard: {
    backgroundColor: COLORS.blue + "10",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.blue + "20",
    marginTop: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.blue,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  tipsSection: {
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    flex: 1,
  },
});
