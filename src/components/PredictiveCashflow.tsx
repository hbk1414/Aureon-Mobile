import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { AureonTheme } from "../theme";
import { Apple } from "../palettes";

const T = AureonTheme("blue");

type Point = { label: string; balance: number };

export function PredictiveCashflow({ 
  todayBalance, 
  weeks, 
  day30Balance, 
  threshold 
}: {
  todayBalance: number; 
  weeks: Point[]; 
  day30Balance: number; 
  threshold: number;
}) {
  const points: Point[] = [
    { label: "Today", balance: todayBalance }, 
    ...weeks, 
    { label: "30 Days", balance: day30Balance }
  ];
  const crossIdx = points.findIndex(p => p.balance < threshold);

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Predictive Cash Flow</Text>
      <Text style={s.muted}>Next 30 days forecast</Text>

      {/* Apple gradient track */}
      <View style={s.track}>
        <LinearGradient
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 0 }}
          colors={[Apple.green, Apple.yellow, Apple.orange, Apple.red]}
          style={s.fill}
        />
      </View>

      {/* Amount labels */}
      <View style={s.ticks}>
        {points.map((p, i) => (
          <View key={i} style={s.tick}>
            <Text style={[
              s.amount, 
              (crossIdx !== -1 && i >= crossIdx) 
                ? { color: Apple.red } 
                : { color: Apple.green }
            ]}>
              £{p.balance.toLocaleString()}
            </Text>
            <Text style={s.tickLabel}>{p.label}</Text>
          </View>
        ))}
      </View>

      {/* Threshold note */}
      {crossIdx !== -1 ? (
        <Text style={{ color: Apple.red, marginTop: 8, fontWeight: "600" }}>
          Drops below £{threshold.toLocaleString()} around {points[crossIdx].label}.
        </Text>
      ) : (
        <Text style={{ color: Apple.green, marginTop: 8, fontWeight: "600" }}>
          Stays above £{threshold.toLocaleString()} all month.
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { gap: 8 },
  title: { fontSize: 18, fontWeight: "700", color: T.text },
  muted: { color: T.muted, fontSize: 13 },
  track: { 
    height: 10, 
    borderRadius: 999, 
    backgroundColor: "#E9EAF2", 
    overflow: "hidden", 
    marginTop: 8 
  },
  fill: { flex: 1 },
  ticks: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 10 
  },
  tick: { 
    width: `${100 / 5}%`, 
    alignItems: "center" 
  },
  amount: { fontWeight: "700" },
  tickLabel: { color: T.muted, fontSize: 12 },
});
