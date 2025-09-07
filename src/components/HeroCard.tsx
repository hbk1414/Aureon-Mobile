import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, space } from "../theme";

export function HeroCard({ 
  amount, 
  change, 
  changePositive = true, 
  label 
}: {
  amount: string;
  change: string;
  changePositive?: boolean;
  label: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.balanceSection}>
        <Text style={styles.amount}>{amount}</Text>
        <View style={[
          styles.changePill, 
          { backgroundColor: changePositive ? "rgba(48,209,88,0.12)" : "rgba(255,59,48,0.12)" }
        ]}>
          <Text style={[
            styles.changeText, 
            { color: changePositive ? colors.iosGreen : colors.iosRed }
          ]}>
            {change}
          </Text>
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass,
    borderRadius: 24,
    padding: space.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.lg,
  },
  balanceSection: {
    marginTop: 10,
  },
  amount: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: -0.3,
  },
  changePill: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  changeText: {
    fontWeight: "700",
  },
  label: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 16,
  },
});
