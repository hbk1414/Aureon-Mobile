// InsightCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, radii, spacing } from "../theme";

export function InsightCard({ title, body, tone="blue" }:{ 
  title:string; body:string; tone?: "blue" | "green";
}) {
  const c = tone === "blue"
    ? { border: colors.iosLightBlue, dot: colors.iosBlue }
    : { border: colors.iosGreen, dot: colors.iosGreen };
  return (
    <View style={[styles.wrap, { borderLeftColor: c.border }]}>
      <View style={[styles.iconDot, { backgroundColor: c.dot }]} />
      <View style={{ flex:1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row", 
    gap: 12,
    borderLeftWidth: 6, 
    borderLeftColor: colors.iosLightBlue,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: colors.border,
    padding: 16,
  },
  iconDot: { width: 22, height: 22, borderRadius: 11 },
  title: { fontSize: 18, fontWeight: "700", color: colors.text },
  body: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
});
