// BudgetProgress.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../theme";

export function BudgetProgress({ spent, limit }:{ spent:number; limit:number }) {
  const used = Math.min(1, spent / limit);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>Budget Progress</Text>
        <View style={styles.pill}><Text style={styles.pillText}>{(used*100).toFixed(1)}% used</Text></View>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${used*100}%` }]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.muted}>Spent: ${spent.toLocaleString()}</Text>
        <Text style={styles.muted}>Left: ${Math.max(0, (limit-spent)).toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(99,102,241,0.06)",
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: { flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom: spacing.md },
  pill: { backgroundColor:"rgba(0,0,0,0.06)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  pillText: { fontWeight:"600", color: colors.text },
  track: { height: 10, borderRadius: 999, backgroundColor: "#D1D5DB", overflow: "hidden" },
  fill: { height: "100%", backgroundColor: colors.iosGreen },
  row: { marginTop: spacing.md, flexDirection:"row", justifyContent:"space-between" },
  muted: { color: colors.textMuted, fontSize: 14 },
});
