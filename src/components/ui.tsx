// ui.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet, ViewStyle, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { C, S, SHADOW, T, type } from "../theme";

// Card styling constants
const CARD_BG = "rgba(255,255,255,0.78)";
const CARD_BORDER = "rgba(15,23,42,0.08)";
const R = 22;

// Conditional import for LinearGradient (mobile only)
let LinearGradient: any = null;
if (Platform.OS !== 'web') {
  try {
    LinearGradient = require("expo-linear-gradient").LinearGradient;
  } catch (e) {
    console.warn("LinearGradient not available:", e);
  }
}

// Conditional import for BlurView (mobile only)
let BlurView: any = null;
if (Platform.OS !== 'web') {
  try {
    BlurView = require("expo-blur").BlurView;
  } catch (e) {
    console.warn("BlurView not available");
  }
}

export function Card({ children, style }:{ children:React.ReactNode; style?:ViewStyle }) {
  if (BlurView) {
    return (
      <BlurView intensity={16} tint="light" style={[styles.glass, style]}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    );
  }
  
  // Fallback for web: regular View with glassmorphism styling
  return (
    <View style={[styles.glass, style]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

export function Section({ title, right }:{ title:string; right?:React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={{ fontSize: 24, fontWeight: "800", color: "#0F172A", letterSpacing: -0.2 }}>{title}</Text>
      {right}
    </View>
  );
}

export function Chip({ text }:{ text:string }) {
  return (
    <View style={styles.chip}><Text style={{ fontWeight:"600", color: C.text }}>{text}</Text></View>
  );
}

export function Button({ title, onPress, style, textStyle }:{
  title:string; onPress:()=>void; style?:ViewStyle; textStyle?:any
}) {
  return (
    <Pressable onPress={onPress} style={[styles.btn, style]}>
      <Text style={[styles.btnText, textStyle]}>{title}</Text>
    </Pressable>
  );
}

export function SectionHeader({ title, action, onPress }:{
  title: string; action?: string; onPress?: ()=>void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={{ fontSize: 24, fontWeight: "800", color: "#0F172A", letterSpacing: -0.2 }}>{title}</Text>
      {action ? (
        <Pressable onPress={onPress} style={styles.viewAll}>
          <Text style={styles.viewAllText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function CategoryRow({ color, label, amount }:{
  color: string; label: string; amount: number;
}) {
  return (
    <View style={styles.categoryRow}>
      <View style={[styles.categoryDot, { backgroundColor: color }]} />
      <Text style={styles.categoryLabel}>{label}</Text>
      <Text style={styles.categoryAmount}>${amount.toLocaleString()}</Text>
    </View>
  );
}

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
    <View style={styles.heroContainer}>
      <View style={styles.balanceSection}>
        <Text style={styles.heroAmount}>{amount}</Text>
        <View style={[
          styles.changePill, 
          { backgroundColor: changePositive ? "rgba(48,209,88,0.12)" : "rgba(255,59,48,0.12)" }
        ]}>
          <Text style={[
            styles.changeText, 
            { color: changePositive ? C.green : C.red }
          ]}>
            {change}
          </Text>
        </View>
        <Text style={styles.heroLabel}>{label}</Text>
      </View>
    </View>
  );
}

export function ScreenContainer({ children }:{ children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={styles.screenContent}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function ProgressBar({ label, value, total }:{ label:string; value:number; total:number }) {
  const pct = Math.min(1, value / total);
  return (
    <View>
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressPill}>{Math.round(pct * 100)}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct*100}%`, backgroundColor: C.blue }]} />
      </View>
      <View style={styles.progressSub}>
        <Text style={styles.progressMuted}>Used {value.toLocaleString()} / {total.toLocaleString()}</Text>
      </View>
    </View>
  );
}

export function StatPill({ value, label, tone="blue" }:{
  value: string; label: string; tone?: "blue" | "purple" | "violet" | "green" | "orange" | "red";
}) {
  // Get the color value, ensuring it's a string
  const colorMap: { [key: string]: string } = {
    blue: C.blue,
    purple: C.purple,
    violet: C.violet,
    green: C.green,
    orange: C.orange,
    red: C.red,
  };
  
  const c = colorMap[tone] || C.blue;
  
  // Create a simple tinted background for web compatibility
  const backgroundColor = Platform.OS === 'web' 
    ? `${c}22` // 22 hex = 13% opacity
    : `rgba(${parseInt(c.slice(1,3), 16)}, ${parseInt(c.slice(3,5), 16)}, ${parseInt(c.slice(5,7), 16)}, 0.16)`;
    
  return (
    <View style={[styles.statPill, { backgroundColor }]}>
      <View style={[styles.statDot, { backgroundColor: c }]} />
      <Text style={styles.statText}><Text style={styles.statValue}>{value}</Text> {label}</Text>
    </View>
  );
}

export function PredictiveCashflow({ 
  todayBalance, 
  weeks, 
  day30Balance, 
  threshold 
}: {
  todayBalance: number; 
  weeks: { label: string; balance: number }[]; 
  day30Balance: number; 
  threshold: number;
}) {
  const points = [
    { label: "Today", balance: todayBalance }, 
    ...weeks, 
    { label: "30 Days", balance: day30Balance }
  ];
  const crossIdx = points.findIndex(p => p.balance < threshold);

  return (
    <View style={styles.cashflowWrap}>
      <Text style={styles.cashflowTitle}>Predictive Cash Flow</Text>
      <Text style={styles.cashflowMuted}>Next 30 days forecast</Text>

      {/* Apple gradient track */}
      <View style={styles.cashflowTrack}>
        {LinearGradient ? (
          <LinearGradient
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 0 }}
            colors={[C.green, C.orange, C.red]}
            style={styles.cashflowFill}
          />
        ) : (
          // Fallback for web: solid color
          <View style={[styles.cashflowFill, { backgroundColor: C.green }]} />
        )}
      </View>

      {/* Amount labels */}
      <View style={styles.cashflowTicks}>
        {points.map((p, i) => (
          <View key={i} style={styles.cashflowTick}>
            <Text style={[
              styles.cashflowAmount, 
              (crossIdx !== -1 && i >= crossIdx) 
                ? { color: C.red } 
                : { color: C.green }
            ]}>
              £{p.balance.toLocaleString()}
            </Text>
            <Text style={styles.cashflowTickLabel}>{p.label}</Text>
          </View>
        ))}
      </View>

      {/* Threshold note */}
      {crossIdx !== -1 ? (
        <Text style={styles.cashflowAlert}>
          Drops below £{threshold.toLocaleString()} around {points[crossIdx].label}.
        </Text>
      ) : (
        <Text style={styles.cashflowSuccess}>
          Stays above £{threshold.toLocaleString()} all month.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: R,
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOpacity: 0.06, 
        shadowRadius: 18, 
        shadowOffset: { width: 0, height: 10 }
      },
      android: { elevation: 2 },
      web: {
        boxShadow: "0px 10px 18px rgba(0,0,0,0.06)",
      },
    }),
  },
  inner: {
    padding: 18,
  },
  sectionRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 18, 
    marginBottom: 12 
  },
  chip: { 
    backgroundColor: "rgba(15,23,42,0.06)", 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16 
  },
  btn: {
    backgroundColor: C.purple,
    paddingHorizontal: S.lg,
    paddingVertical: S.sm + 2,
    borderRadius: R,
    alignItems: 'center',
  },
  btnText: { 
    color: "white", 
    fontWeight: "600", 
    fontSize: 16 
  },
  viewAll: { backgroundColor: "rgba(0,0,0,0.06)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  viewAllText: { 
    fontWeight: "600", 
    color: "#0F172A" 
  },
  categoryRow: {
    flexDirection: "row", 
    alignItems: "center",
    paddingVertical: S.md,
    borderBottomWidth: 1, 
    borderBottomColor: C.border,
    flexWrap: "wrap", // Allow wrapping on small screens
  },
  categoryDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: S.md,
    flexShrink: 0, // Prevent dot from shrinking
  },
  categoryLabel: { 
    flex: 1, 
    fontSize: 18, 
    fontWeight: "600", 
    color: "#0F172A",
    marginRight: S.sm, // Add spacing from amount
    flexWrap: "wrap", // Allow text wrapping
  },
  categoryAmount: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#0F172A",
    flexShrink: 0, // Prevent amount from shrinking
    textAlign: "right", // Right-align the amount
  },
  heroContainer: {
    backgroundColor: CARD_BG,
    borderRadius: R,
    padding: S.xl,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginBottom: S.lg,
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOpacity: 0.06, 
        shadowRadius: 18, 
        shadowOffset: { width: 0, height: 10 }
      },
      android: { elevation: 2 },
      web: {
        boxShadow: "0px 10px 18px rgba(0,0,0,0.06)",
      },
    }),
  },
  balanceSection: {
    marginTop: 10,
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: "800",
    color: C.text,
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
  heroLabel: {
    marginTop: 6,
    color: "#667085",
    fontSize: 16,
  },
  screenContent: { 
    padding: 24, 
    gap: 18 
  },
  progressRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 10,
    alignItems: "center", // Ensure proper alignment
  },
  progressLabel: { 
    color: "#0F172A", 
    fontWeight: "700", 
    fontSize: 16,
    flex: 1, // Allow text to take available space
    marginRight: 8, // Add spacing from percentage
  },
  progressPill: { 
    backgroundColor: "#EEF0FF", 
    color: "#0F172A", 
    fontWeight: "700", 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 999,
    minWidth: 40, // Ensure minimum width for percentage
    textAlign: "center", // Center the percentage text
  },
  progressTrack: { height: 10, backgroundColor: "#E9EAF2", borderRadius: 999, overflow: "hidden" },
  progressFill: { height: "100%" },
  progressSub: { marginTop: 8 },
  progressMuted: { 
    color: "#667085", 
    fontSize: 13 
  },
  statPill: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 10,
  },
  statDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  statText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  statValue: {
    fontWeight: "700",
    color: "#0F172A",
  },
  cashflowWrap: {
    backgroundColor: CARD_BG,
    borderRadius: R,
    padding: S.lg,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    marginBottom: S.lg,
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOpacity: 0.06, 
        shadowRadius: 18, 
        shadowOffset: { width: 0, height: 10 }
      },
      android: { elevation: 2 },
      web: {
        boxShadow: "0px 10px 18px rgba(0,0,0,0.06)",
      },
    }),
  },
  cashflowTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  cashflowMuted: {
    fontSize: 14,
    color: "#667085",
    marginBottom: 10,
  },
  cashflowTrack: {
    height: 10,
    backgroundColor: "#E9EAF2",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },
  cashflowFill: {
    height: "100%",
  },
  cashflowTicks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap", // Allow wrapping on small screens
  },
  cashflowTick: {
    flex: 1, // Use flex instead of fixed width
    alignItems: "center",
    minWidth: 0, // Prevent text overflow
    marginBottom: 8, // Add spacing when wrapped
  },
  cashflowAmount: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    color: "#0F172A", // Add color specification
  },
  cashflowTickLabel: {
    fontSize: 12,
    color: "#667085",
  },
  cashflowAlert: {
    color: C.red,
    fontSize: 14,
    marginTop: 10,
  },
  cashflowSuccess: {
    color: C.green,
    fontSize: 14,
    marginTop: 10,
  },
  insight: {
    backgroundColor: CARD_BG,
    borderRadius: R,
    padding: S.md,
    marginBottom: S.sm,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOpacity: 0.06, 
        shadowRadius: 18, 
        shadowOffset: { width: 0, height: 10 }
      },
      android: { elevation: 2 },
      web: {
        boxShadow: "0px 10px 18px rgba(0,0,0,0.06)",
      },
    }),
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: R,
    backgroundColor: CARD_BG,
    alignItems: "center",
    justifyContent: "center",
    marginRight: S.md,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOpacity: 0.06, 
        shadowRadius: 18, 
        shadowOffset: { width: 0, height: 10 }
      },
      android: { elevation: 2 },
      web: {
        boxShadow: "0px 10px 18px rgba(0,0,0,0.06)",
      },
    }),
  },
  txCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: R,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap", // Allow wrapping on small screens
    ...Platform.select({
      ios: { 
        shadowColor: "#000", 
        shadowOpacity: 0.06, 
        shadowRadius: 18, 
        shadowOffset: { width: 0, height: 10 }
      },
      android: { elevation: 2 },
      web: {
        boxShadow: "0px 10px 18px rgba(0,0,0,0.06)",
      },
    }),
  },
  txIcon: { 
    width: 34, 
    height: 34, 
    borderRadius: 17,
    flexShrink: 0, // Prevent icon from shrinking
  },
  txName: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#0F172A",
    flexWrap: "wrap", // Allow text wrapping
    marginBottom: 2, // Add spacing between name and meta
  },
  txMeta: { 
    fontSize: 13, 
    color: C.muted, 
    marginTop: 2,
    flexWrap: "wrap", // Allow text wrapping
  },
  tag: { 
    backgroundColor: "#EEF0FF", 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 999, 
    marginRight: 8,
    flexShrink: 0, // Prevent tag from shrinking
  },
  tagText: { 
    fontWeight: "700", 
    color: "#0F172A",
    fontSize: 12, // Ensure consistent font size
  },
  txAmount: { 
    fontSize: 16, 
    fontWeight: "800", 
    marginLeft: "auto",
    flexShrink: 0, // Prevent amount from shrinking
    textAlign: "right", // Right-align the amount
  },
});
