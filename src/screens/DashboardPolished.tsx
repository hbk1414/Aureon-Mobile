import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Platform,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Conditional import for LinearGradient (mobile only)
let LinearGradient: any = null;
if (Platform.OS !== 'web') {
  try {
    LinearGradient = require("expo-linear-gradient").LinearGradient;
  } catch (e) {
    console.warn("LinearGradient not available:", e);
  }
}

/** ---------- Apple palette (vibrant) ---------- */
const Apple = {
  blue: "#007AFF",
  purple: "#5856D6",
  violet: "#AF52DE",
  pink: "#FF2D92",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#30D158",
  lightBlue: "#64D2FF",
} as const;

/** ---------- Neutrals (Materio-ish) ---------- */
const N = {
  bg: "#F4F5FA",
  card: "rgba(255,255,255,0.78)", // glassy white
  border: "rgba(15,23,42,0.08)",
  text: "#0F172A",
  muted: "#667085",
};

/** ---------- Helpers ---------- */
const CARD_BG = "rgba(255,255,255,0.78)";
const CARD_BORDER = "rgba(15,23,42,0.08)";
const R = 22; // radius
const S = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 };
const SHADOW = Platform.select({
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
});

/** ---------- Glass Card ---------- */
function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

/** ---------- Section Header ---------- */
function Section({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.h1}>{title}</Text>
      {right}
    </View>
  );
}

/** ---------- Predictive Cash Flow "Energy Bar" ---------- */
function PredictiveCashflow({
  today,
  weeks,                // e.g. [2200, 1800, 1500, 1200]
  day30,
  threshold = 1000,
}: {
  today: number;
  weeks: number[];
  day30: number;
  threshold?: number;
}) {
  const points = [today, ...weeks, day30];
  const labels = ["Today", "Week 1", "Week 2", "Week 3", "Week 4", "30 Days"];
  const crossIdx = points.findIndex((v) => v < threshold);

  // animate left->right fill
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: false }).start();
  }, []);
  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <Card>
      <Text style={styles.h2}>Predictive Cash Flow</Text>
      <Text style={styles.sub}>Next 30 days forecast</Text>

      <View style={{ marginTop: S.md }}>
        <View style={styles.energyTrack}>
          <Animated.View style={[styles.energyMask, { width }]}>
            {LinearGradient ? (
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[Apple.green, Apple.yellow, Apple.orange, Apple.red]}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              // Fallback for web: solid color with opacity
              <View style={[StyleSheet.absoluteFill, { backgroundColor: Apple.green }]} />
            )}
          </Animated.View>
        </View>

        {/* labels under track */}
        <View style={styles.energyTicks}>
          {points.map((amt, i) => {
            const bad = crossIdx !== -1 && i >= crossIdx;
            return (
              <View key={i} style={styles.tick}>
                <Text style={[styles.amount, { color: bad ? Apple.red : Apple.green }]}>
                  £{amt.toLocaleString()}
                </Text>
                <Text style={styles.tickLabel}>{labels[i]}</Text>
              </View>
            );
          })}
        </View>

        {crossIdx !== -1 ? (
          <View style={styles.noticeBad}>
            <Text style={{ color: Apple.red, fontWeight: "700" }}>
              Drops below £{threshold.toLocaleString()} around {labels[crossIdx]}.
            </Text>
          </View>
        ) : (
          <View style={styles.noticeGood}>
            <Text style={{ color: Apple.green, fontWeight: "700" }}>
              Stays above £{threshold.toLocaleString()} all month.
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
}

/** ---------- Category Row ---------- */
function CategoryRow({
  color, label, amount, isLast = false,
}: { color: string; label: string; amount: number; isLast?: boolean }) {
  return (
    <View style={[styles.catRow, isLast && styles.catRowLast]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.catLabel}>{label}</Text>
      <Text style={styles.catAmt}>${amount.toLocaleString()}</Text>
    </View>
  );
}

/** ---------- Quick Action Button ---------- */
function QuickAction({
  label, color = Apple.purple, onPress,
}: { label: string; color?: string; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.quickBtn, { backgroundColor: color }]}>
      <Text style={styles.quickText}>{label}</Text>
    </Pressable>
  );
}

/** ---------- Transaction Row ---------- */
function TxRow({
  iconBg, name, meta, tag, amount, positive,
}: {
  iconBg: string; name: string; meta: string; tag?: string;
  amount: string; positive?: boolean;
}) {
  return (
    <View style={styles.txCard}>
      <View style={[styles.txIcon, { backgroundColor: iconBg }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.txName}>{name}</Text>
        <Text style={styles.txMeta}>{meta}</Text>
      </View>
      {tag ? <View style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View> : null}
      <Text style={[styles.txAmount, { color: positive ? Apple.green : N.text }]}>{amount}</Text>
    </View>
  );
}

/** ---------- BUDGET OVERVIEW (animated bars) ---------- */
function BudgetItem({ label, used, total, color }:{
  label:string; used:number; total:number; color:string
}) {
  const pct = Math.min(1, used/total);
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(()=>{ Animated.timing(anim,{toValue:pct,duration:600,useNativeDriver:false}).start();},[pct]);
  const width = anim.interpolate({ inputRange:[0,1], outputRange:["0%","100%"] });

  return (
    <View style={{marginBottom:16}}>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
        <Text style={{fontSize:18,fontWeight:"700",color:"#0F172A"}}>{label}</Text>
        <View style={{backgroundColor:"#EEF0FF",paddingHorizontal:10,paddingVertical:4,borderRadius:999}}>
          <Text style={{fontWeight:"800",color:"#0F172A"}}>{Math.round(pct*100)}%</Text>
        </View>
      </View>
      <View style={{height:8, backgroundColor:"#E9EAF2", borderRadius:999, overflow:"hidden", marginTop:8}}>
        <Animated.View style={{height:"100%", width, backgroundColor: color}} />
      </View>
      <Text style={{marginTop:6, color:"#667085"}}>Used {used} / {total}</Text>
    </View>
  );
}

/** ---------- Screen ---------- */
export default function DashboardPolished() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: N.bg }}>
      <ScrollView contentContainerStyle={styles.cc}>
        {/* Top KPIs / Actions */}
        <Card>
          <Text style={styles.h2}>At a glance</Text>
          <View style={styles.pillRow}>
            <View style={[styles.statPill, { backgroundColor: Apple.blue + "22" }]}>
              <View style={[styles.miniDot, { backgroundColor: Apple.blue }]} />
              <Text style={styles.pillText}><Text style={styles.bold}>$2,450</Text> Monthly Budget</Text>
            </View>
            <View style={[styles.statPill, { backgroundColor: Apple.green + "22" }]}>
              <View style={[styles.miniDot, { backgroundColor: Apple.green }]} />
              <Text style={styles.pillText}><Text style={styles.bold}>85%</Text> Savings Rate</Text>
            </View>
          </View>
        </Card>

        {/* Predictive cash flow */}
        <PredictiveCashflow
          today={2500}
          weeks={[2200, 1800, 1500, 1200]}
          day30={800}
          threshold={1000}
        />

        {/* Top Categories */}
        <Card>
          <Section title="Top Categories" />
          <CategoryRow color={Apple.blue}   label="Food & Dining" amount={450} />
          <CategoryRow color={Apple.violet} label="Shopping"      amount={380} />
          <CategoryRow color={Apple.green}  label="Transport"     amount={280} />
          <CategoryRow color={Apple.orange} label="Entertainment" amount={220} isLast />
        </Card>

        {/* Quick Actions */}
        <Card>
          <Section title="Quick Actions" />
          <View style={styles.actionsRow}>
            <QuickAction label={"Scan\nReceipt"} color={Apple.purple} />
            <QuickAction label={"Add\nTransaction"} color={Apple.violet} />
            <QuickAction label={"Set\nBudget"} color={Apple.blue} />
          </View>
        </Card>

        {/* AI Insights */}
        <Card>
          <Section title="AI Insights" />
          <View style={[styles.insight, { borderLeftColor: Apple.yellow }]}>
            <Text style={styles.insightText}>
              💡 Your entertainment spending is 15% higher than usual. Consider a weekly limit.
            </Text>
          </View>
          <View style={[styles.insight, { borderLeftColor: Apple.green }]}>
            <Text style={styles.insightText}>
              🎯 Great job! You're saving 25% more than your goal — ahead for your vacation fund.
            </Text>
          </View>
        </Card>

        {/* Budget Overview */}
        <Card>
          <Section title="Budget Overview" />
          <BudgetItem label="Groceries"     used={320} total={500} color={Apple.blue} />
          <BudgetItem label="Entertainment" used={180} total={300} color={Apple.pink} />
          <BudgetItem label="Transport"     used={95}  total={200} color={Apple.green} />
          <BudgetItem label="Shopping"      used={420} total={400} color={Apple.violet} />
        </Card>

        {/* Recent Activity */}
        <Section title="Recent Activity" />
        <TxRow iconBg={Apple.blue + "22"}  name="Grocery Store"  meta="Today • $45.20"      tag="Food"      amount="$45.20" />
        <TxRow iconBg={Apple.orange + "22"} name="Gas Station"    meta="Yesterday • $32.50"  tag="Transport" amount="$32.50" />
        <TxRow iconBg={Apple.violet + "22"} name="Netflix"        meta="2 days ago • $15.99" tag="Media"     amount="$15.99" />
        <TxRow iconBg={Apple.green + "22"}  name="Salary Deposit" meta="1 day ago"           amount="+$3500.00" positive />
      </ScrollView>
    </SafeAreaView>
  );
}

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  cc: { 
    padding: 24, 
    gap: 18,
    minHeight: "100%", // Ensure full height
  },
  h1: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#0F172A",
    letterSpacing: -0.2,
    flexWrap: "wrap", // Allow text wrapping
  },
  h2: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#0F172A",
    flexWrap: "wrap", // Allow text wrapping
  },
  h3: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#0F172A",
    flexWrap: "wrap", // Allow text wrapping
  },
  sub: { 
    color: "#667085", 
    marginTop: 4,
    flexWrap: "wrap", // Allow text wrapping
  },

  card: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: R,
    padding: 18,
    ...SHADOW,
  },
  sectionRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 12 
  },

  /** Predictive bar */
  energyTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E9EAF2",
    overflow: "hidden",
    // subtle bevel
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)"
  },
  energyMask: {
    height: "100%",
    borderRadius: 999,
  },
  energyTicks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  tick: { 
    flex: 1, 
    alignItems: "center",
    minWidth: 0, // Prevent text overflow
  },
  amount: { fontWeight: "700" },
  tickLabel: { 
    color: "#667085", 
    fontSize: 12, 
    marginTop: 2 
  },
  noticeBad: { 
    backgroundColor: Apple.red + "12", 
    borderRadius: R, 
    padding: 10, 
    marginTop: 8 
  },
  noticeGood: { 
    backgroundColor: Apple.green + "12", 
    borderRadius: R, 
    padding: 10, 
    marginTop: 8 
  },

  /** Top categories */
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(15,23,42,0.08)"
  },
  catRowLast: { 
    borderBottomWidth: 0 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 10,
    flexShrink: 0, // Prevent dot from shrinking
  },
  catLabel: { 
    flex: 1, 
    color: N.text, 
    fontSize: 16, 
    fontWeight: "600",
    marginRight: 8, // Add spacing from amount
    flexWrap: "wrap", // Allow text wrapping
  },
  catAmt: { 
    color: N.text, 
    fontSize: 16, 
    fontWeight: "800",
    flexShrink: 0, // Prevent amount from shrinking
    textAlign: "right", // Right-align the amount
  },

  /** Quick actions */
  actionsRow: { 
    flexDirection: "row", 
    gap: 12, 
    marginTop: 8,
    flexWrap: "wrap", // Allow wrapping on small screens
  },
  quickBtn: { 
    borderRadius: 18, 
    paddingVertical: 16, 
    paddingHorizontal: 18, 
    minWidth: 110, 
    maxWidth: "100%", // Prevent overflow
    alignItems: "center",
    flex: 1, // Allow flexible sizing
  },
  quickText: { 
    color: "white", 
    fontWeight: "800", 
    textAlign: "center", 
    lineHeight: 18,
    flexWrap: "wrap", // Allow text wrapping
  },

  /** Pills */
  pillRow: { 
    flexDirection: "row", 
    gap: 10, 
    marginTop: 10, 
    flexWrap: "wrap" 
  },
  statPill: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 999,
    flexWrap: "wrap", // Allow text wrapping
    maxWidth: "100%", // Prevent overflow
  },
  miniDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  pillText: { color: "#475569", fontSize: 13 },
  bold: { fontWeight: "700", color: N.text },

  /** Transactions */
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
    ...SHADOW,
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
    color: N.text,
    flexWrap: "wrap", // Allow text wrapping
    marginBottom: 2, // Add spacing between name and meta
  },
  txMeta: { 
    fontSize: 13, 
    color: N.muted, 
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
    color: N.text,
    fontSize: 12, // Ensure consistent font size
  },
  txAmount: { 
    fontSize: 16, 
    fontWeight: "800", 
    marginLeft: "auto",
    flexShrink: 0, // Prevent amount from shrinking
    textAlign: "right", // Right-align the amount
  },

  /** Insights */
  insight: {
    borderLeftWidth: 4,
    paddingLeft: 16,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: CARD_BG,
    borderRadius: R,
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
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: N.text,
  },
});

