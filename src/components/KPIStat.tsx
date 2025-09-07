// KPIStat.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fonts } from "../theme";
import { Chip } from "./ui";

export function KPIStat({ label, value, delta, deltaPositive }:{
  label:string; value:string; delta?:string; deltaPositive?:boolean
}) {
  return (
    <View style={styles.wrap}>
      <Text style={fonts.kpi}>{value}</Text>
      {delta ? <Chip label={delta} tone={deltaPositive ? "green":"red"} /> : null}
      <Text style={[fonts.body, { marginTop: 4 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs, alignItems: "flex-start" },
});
