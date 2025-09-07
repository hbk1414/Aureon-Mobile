import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AureonTheme } from "../theme";
import { Apple } from "../palettes";

const T = AureonTheme("purple");

export function StatPill({ value, label, tone="blue" }:{
  value: string; label: string; tone?: keyof typeof Apple;
}) {
  const c = Apple[tone];
  return (
    <View style={[s.pill,{ backgroundColor: T.tint(c, 0.16) }]}>
      <View style={[s.dot,{ backgroundColor: c }]} />
      <Text style={s.text}><Text style={s.value}>{value}</Text> {label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill:{ flexDirection:"row", alignItems:"center", paddingHorizontal:12, paddingVertical:6, borderRadius:999 },
  dot:{ width:10, height:10, borderRadius:5, marginRight:8 },
  text:{ color:"#475569", fontSize:13 },
  value:{ fontWeight:"700", color:"#0F172A" },
});
