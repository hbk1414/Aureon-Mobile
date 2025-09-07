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
      {/* Chart Header */}
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Monthly Trends</Text>
        <Text style={styles.chartSubtitle}>Income vs Expenses</Text>
      </View>

      {/* Chart Container */}
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <G>
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
              const value = ratio * maxValue;
              return (
                <G key={`grid-${index}`}>
                  <Line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - padding}
                    y2={y}
                    stroke={COLORS.border}
                    strokeWidth={1}
                    strokeOpacity={0.3}
                  />
                  <SvgText
                    x={padding - 10}
                    y={y + 4}
                    fontSize="10"
                    fill={COLORS.mute}
                    textAnchor="end"
                  >
                    £{Math.round(value / 100) * 100}
                  </SvgText>
                </G>
              );
            })}

            {/* Month labels */}
            {data.map((item, index) => {
              const x = monthToX(index);
              return (
                <SvgText
                  key={`month-${index}`}
                  x={x}
                  y={chartHeight - 10}
                  fontSize="10"
                  fill={COLORS.mute}
                  textAnchor="middle"
                >
                  {item.month}
                </SvgText>
              );
            })}

            {/* Savings area (background) */}
            <Path
              d={savingsPath}
              fill={COLORS.green + "20"}
              stroke="none"
            />

            {/* Income line */}
            <Path
              d={incomePath}
              stroke={COLORS.green}
              strokeWidth={3}
              fill="none"
            />

            {/* Expenses line */}
            <Path
              d={expensesPath}
              stroke={COLORS.red}
              strokeWidth={3}
              fill="none"
            />

            {/* Data points */}
            {data.map((item, index) => {
              const x = monthToX(index);
              const incomeY = valueToY(item.income);
              const expensesY = valueToY(item.expenses);
              
              return (
                <G key={`point-${index}`}>
                  <Circle
                    cx={x}
                    cy={incomeY}
                    r={4}
                    fill={COLORS.green}
                  />
                  <Circle
                    cx={x}
                    cy={expensesY}
                    r={4}
                    fill={COLORS.red}
                  />
                </G>
              );
            })}
          </G>
        </Svg>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.green }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.red }]} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.green + "40" }]} />
          <Text style={styles.legendText}>Savings</Text>
        </View>
      </View>

      {/* Safe-to-Spend Widget */}
      <View style={styles.safeToSpendWidget}>
        <Text style={styles.widgetTitle}>Safe to Spend</Text>
        <View style={styles.widgetContent}>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>£{currentBalance.toLocaleString()}</Text>
          </View>
          <View style={styles.deductionRow}>
            <Text style={styles.deductionLabel}>- Upcoming Bills</Text>
            <Text style={styles.deductionValue}>£{upcomingBills.toLocaleString()}</Text>
          </View>
          <View style={styles.deductionRow}>
            <Text style={styles.deductionLabel}>- Savings Goals</Text>
            <Text style={styles.deductionValue}>£{savingsGoals.toLocaleString()}</Text>
          </View>
          <View style={[
            styles.safeAmountRow,
            { borderTopColor: COLORS.border }
          ]}>
            <Text style={styles.safeAmountLabel}>Safe to Spend</Text>
            <Text style={[
              styles.safeAmountValue,
              { color: isSafe ? COLORS.green : COLORS.red }
            ]}>
              £{Math.abs(safeToSpend).toLocaleString()}
            </Text>
          </View>
        </View>
        
        {!isSafe && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              ⚠️ You're over budget. Consider reducing spending or adjusting goals.
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
    marginHorizontal: 0, // Remove side margins
  },
  chartHeader: {
    marginBottom: 20,
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
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 24,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },
  safeToSpendWidget: {
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  widgetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },
  widgetContent: {
    gap: 12,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  deductionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deductionLabel: {
    fontSize: 14,
    color: COLORS.mute,
  },
  deductionValue: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: "600",
  },
  safeAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  safeAmountLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  safeAmountValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  warningContainer: {
    backgroundColor: COLORS.red + "20",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.red + "30",
  },
  warningText: {
    fontSize: 12,
    color: COLORS.red,
    textAlign: "center",
    lineHeight: 16,
  },
});
