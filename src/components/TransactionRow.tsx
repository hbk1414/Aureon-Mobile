// TransactionRow.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../theme";

export function TransactionRow({ name, time, amount, positive }:{ 
  name:string; time:string; amount:string; positive?:boolean
}) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={[styles.dot, { backgroundColor: positive ? "rgba(48,209,88,0.15)":"rgba(255,59,48,0.15)" }]}>
          <Text style={{ color: positive ? colors.iosGreen : colors.iosRed }}>↗</Text>
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: positive ? colors.iosGreen : colors.text }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "rgba(0,0,0,0.04)",
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 14, paddingHorizontal: 16,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  left: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  dot: { height: 36, width: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 16, fontWeight: "600", color: colors.text },
  time: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "700" },
});
