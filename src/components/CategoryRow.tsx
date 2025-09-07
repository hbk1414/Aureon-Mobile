import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, space } from "../theme";

export function CategoryRow({ color, label, amount }:{
  color: string; label: string; amount: number;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>${amount.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: space.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: space.md },
  label: { flex: 1, fontSize: 18, fontWeight: "600", color: colors.text },
  amount: { fontSize: 18, fontWeight: "700", color: colors.text },
});
