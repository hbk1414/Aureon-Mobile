import React, { useMemo, useState, useCallback, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  FlatList,
  Linking,
  Modal,
  Alert,
  Animated,
  Easing,
  Switch,
  AccessibilityInfo,
  TextInput,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  useBudgetCategories,
  formatCurrency,
  useSavingsPots,
  useAutoSaveRules,
  type BudgetCategory,
  type MonthlyTrendData,
  type SavingsPot,
  type AutoSaveRule,
  useMonthlyTrends,
} from "../services/dataService";
// import MonthlyTrendChart from "../components/MonthlyTrendChart";
// import TrendsDetailScreen from "./TrendsDetailScreen";
import { BudgetListSkeleton } from "../components/SkeletonLoader";

const COLORS = {
  bg: "#F7F8FB",
  card: "#FFFFFF",
  border: "#EAECEF",
  text: "#0F172A",
  mute: "#6B7280",
  blue: "#007AFF",
  green: "#30D158",
  red: "#FF3B30",
  orange: "#FF9F0A",
  purple: "#5856D6",
  violet: "#AF52DE",
};

type Pot = {
  id: string;
  name: string;
  emoji: string;
  current: number;
  target: number;
  cadence: "weekly" | "monthly";
  autoAmount: number;
  term: "short-term" | "long-term";
};

type CashbackOffer = {
  id: string;
  merchant: string;
  caption: string;
  rateLabel: string;
  expiresOn?: string;
  deepLink: string;
};

const TABS = ["Pots", "Autosave", "Cashback"] as const;
type TabKey = (typeof TABS)[number];

// Mock predictive cash flow data (each has its own threshold)
const cashFlowData = [
  { week: "This Week", amount: 1850, threshold: 800 },
  { week: "Next Week", amount: 1350, threshold: 800 },
  { week: "Week 3", amount: 850, threshold: 800 },
  { week: "Week 4", amount: 600, threshold: 800 },
  { week: "30 Days", amount: 400, threshold: 800 },
];

// ---------- Small primitives ----------

const Card: React.FC<{ style?: any; children?: React.ReactNode; accessibleLabel?: string }> = ({
  style,
  children,
  accessibleLabel,
}) => (
  <View
    accessibilityRole="summary"
    accessibilityLabel={accessibleLabel}
    style={[styles.cardBase, style]}
  >
    {children}
  </View>
);

const Progress: React.FC<{ value: number; height?: number; trackColor?: string; fillColor?: string; rounded?: boolean }> = ({
  value,
  height = 8,
  trackColor = COLORS.border,
  fillColor = COLORS.blue,
  rounded = true,
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View
      style={{
        height,
        backgroundColor: trackColor,
        borderRadius: rounded ? height / 2 : 0,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: "100%",
          backgroundColor: fillColor,
          borderRadius: rounded ? height / 2 : 0,
        }}
      />
    </View>
  );
};

const Chevron: React.FC<{ open: boolean }> = ({ open }) => {
  const rot = useRef(new Animated.Value(open ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.timing(rot, {
      toValue: open ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [open, rot]);
  const rotate = rot.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  return (
    <Animated.Text
      style={{ fontSize: 12, color: COLORS.mute, transform: [{ rotate }] }}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      ▼
    </Animated.Text>
  );
};

// ---------- Helpers ----------

const formatMoney = (n: number) =>
  `£${n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const shortDay = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    const d = new Date(iso);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  }
};

// ---------- Main Screen ----------

export default function BudgetsGoalsScreen() {
  const [selectedPeriod] = useState("This Month");
  const [active, setActive] = useState<TabKey>("Pots");
  const [showTrendsDetail, setShowTrendsDetail] = useState(false);

  // Hooks with try/catch safety (keeping your approach)
  let budgetCategories: BudgetCategory[] = [];
  let monthlyTrends: MonthlyTrendData[] = [];
  let savingsPots: SavingsPot[] = [];
  let autoSaveRules: AutoSaveRule[] = [];
  let loading = false;
  let trendsLoading = false;
  let savingsLoading = false;
  let autoSaveLoading = false;
  let error: any = null;

  try {
    const budgetHook = useBudgetCategories();
    const trendsHook = useMonthlyTrends();
    const savingsHook = useSavingsPots();
    const autoSaveHook = useAutoSaveRules();

    budgetCategories = budgetHook.budgetCategories || [];
    monthlyTrends = trendsHook.monthlyTrends || [];
    savingsPots = savingsHook.savingsPots || [];
    autoSaveRules = autoSaveHook.autoSaveRules || [];
    loading = budgetHook.loading || savingsHook.loading;
    trendsLoading = trendsHook.loading;
    savingsLoading = savingsHook.loading;
    autoSaveLoading = autoSaveHook.loading;
    error = budgetHook.error || trendsHook.error || savingsHook.error || autoSaveHook.error;
  } catch (err) {
    console.error("Error loading data:", err);
  }

  // Monthly overview placeholders
  const totalSavingsGoals = 2000;
  const currentBalance = 8750;
  const totalUpcomingBills = 1200;

  // Budget rollups
  const totalSpent = useMemo(
    () => budgetCategories.reduce((sum, cat) => sum + cat.spent, 0),
    [budgetCategories]
  );
  const totalBudget = useMemo(
    () => budgetCategories.reduce((sum, cat) => sum + cat.limit, 0),
    [budgetCategories]
  );
  const remainingBudget = totalBudget - totalSpent;

  // Pots projection
  const pots: Pot[] = useMemo(
    () =>
      savingsPots.map((pot) => ({
        id: pot.id,
        name: pot.name,
        emoji: pot.icon,
        current: pot.current,
        target: pot.target,
        cadence: "monthly" as const,
        autoAmount: pot.autoTransfer || 0,
        term: pot.category as "short-term" | "long-term",
      })),
    [savingsPots]
  );

  const offers: CashbackOffer[] = useMemo(
    () => [
      { id: "o1", merchant: "ASOS", caption: "Fashion & accessories", rateLabel: "6% back", deepLink: "https://example.com/asos" },
      { id: "o2", merchant: "Deliveroo", caption: "Takeaway", rateLabel: "10% back", deepLink: "https://example.com/deliveroo" },
      { id: "o3", merchant: "Apple", caption: "Devices & accessories", rateLabel: "2% back", deepLink: "https://example.com/apple" },
    ],
    []
  );

  const onChangeTab = useCallback((tab: TabKey) => {
    setActive(tab);
    Haptics.selectionAsync();
  }, []);

  const handleViewFullTrends = useCallback(() => {
    setShowTrendsDetail(true);
    Haptics.selectionAsync();
  }, []);

  const handleCloseTrendsDetail = useCallback(() => {
    setShowTrendsDetail(false);
  }, []);

  const renderCashFlowBar = useCallback(() => {
    const points = cashFlowData.map((d) => d.amount);
    const labels = cashFlowData.map((d) => d.week);
    const crossIdx = cashFlowData.findIndex((d) => d.amount < d.threshold);
    const threshold = Math.min(...cashFlowData.map((d) => d.threshold));
    const fillPct =
      crossIdx >= 0 ? ((crossIdx + 1) / cashFlowData.length) * 100 : 100;

    return (
      <View style={styles.cashFlowContainer}>
        <Text style={styles.cashFlowTitle}>Predictive Cash Flow</Text>
        <Text style={styles.cashFlowSubtitle}>30-day forecast</Text>

        {/* Energy track */}
        <View style={styles.energyTrack}>
          <View style={styles.energyMask}>
            <View
              style={[
                styles.energyFill,
                {
                  width: `${fillPct}%`,
                  backgroundColor: crossIdx >= 0 ? COLORS.orange : COLORS.green,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.energyTicks}>
          {points.map((amount, i) => (
            <View key={i} style={styles.tick}>
              <Text
                style={[
                  styles.amountText,
                  { color: amount < threshold ? COLORS.red : COLORS.text },
                ]}
              >
                {formatCurrency(amount)}
              </Text>
              <Text style={styles.tickLabel}>{labels[i]}</Text>
            </View>
          ))}
        </View>

        {crossIdx >= 0 && (
          <View style={styles.noticeBad}>
            <Text style={styles.noticeText}>
              ⚠️ Cash flow drops below {formatCurrency(threshold)} in {labels[crossIdx]}
            </Text>
          </View>
        )}
      </View>
    );
  }, []);

  if (loading || trendsLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Budgets & Goals</Text>
            <Text style={styles.subtitle}>Track your spending and savings</Text>
          </View>
          <BudgetListSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Budgets & Goals</Text>
            <Text style={styles.subtitle}>Track your spending targets</Text>
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Failed to Load</Text>
            <Text style={styles.errorMessage}>{String(error)}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                Haptics.selectionAsync();
                AccessibilityInfo.announceForAccessibility?.("Retrying load");
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Budgets & Goals</Text>
          <Text style={styles.subtitle}>Track your spending targets</Text>
        </View>

        {/* Segment bar */}
        <View style={styles.segmentContainer}>
          <View style={styles.segment} accessibilityRole="tablist">
            {TABS.map((tab) => (
              <Pressable
                key={tab}
                accessibilityRole="tab"
                accessibilityState={{ selected: active === tab }}
                accessibilityLabel={`Show ${tab}`}
                onPress={() => onChangeTab(tab)}
                style={[styles.segmentBtn, active === tab && styles.segmentBtnActive]}
              >
                <Text
                  style={[styles.segmentText, active === tab && styles.segmentTextActive]}
                >
                  {tab}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Tab content */}
        <View style={styles.tabContentContainer}>
          {active === "Pots" && (
            <Card accessibleLabel="Savings Pots">
              <PotsTab pots={pots} />
              <View style={{ height: 16 }} />
              {renderCashFlowBar()}
            </Card>
          )}

          {active === "Autosave" && (
            <Card accessibleLabel="Autosave">
              <AutosaveTab rules={autoSaveRules} pots={savingsPots} />
            </Card>
          )}

          {active === "Cashback" && (
            <Card accessibleLabel="Cashback offers">
              <CashbackTab offers={offers} />
            </Card>
          )}
        </View>

        {/* Monthly Overview (kept commented per your note) */}
        {/*
        <Card style={styles.section} accessibleLabel="Monthly Overview">
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Monthly Overview</Text>
              <Text style={styles.sectionSubtitle}>Income vs Expenses Trends</Text>
            </View>
            <TouchableOpacity style={styles.viewFullTrendsButton} onPress={handleViewFullTrends}>
              <Text style={styles.viewFullTrendsText}>View full trends →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.periodContainer}>
            {["This Month", "Last Month", "Next Month"].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodChip,
                  selectedPeriod === period && styles.periodChipActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  style={[
                    styles.periodChipText,
                    selectedPeriod === period && styles.periodChipTextActive,
                  ]}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.compactChartContainer}>
            <MonthlyTrendChart
              data={monthlyTrends}
              currentBalance={currentBalance}
              upcomingBills={totalUpcomingBills}
              savingsGoals={totalSavingsGoals}
            />
          </View>
        </Card>
        */}
      </ScrollView>

      {/* Trends modal (placeholder since import is commented) */}
      <Modal visible={showTrendsDetail} animationType="slide" onRequestClose={handleCloseTrendsDetail}>
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: COLORS.text, marginBottom: 12 }}>
            Trends
          </Text>
          <Text style={{ color: COLORS.mute, marginBottom: 12 }}>
            (Placeholder — connect your TrendsDetailScreen)
          </Text>
          <TouchableOpacity
            onPress={handleCloseTrendsDetail}
            style={[styles.primaryPill, { alignSelf: "flex-start" }]}
          >
            <Text style={styles.primaryPillText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ---------- Pots Tab ----------

function PotsTab({ pots }: { pots: Pot[] }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPotForm, setNewPotForm] = useState({
    name: "",
    target: "",
    emoji: "💰",
    term: "short-term" as "short-term" | "long-term",
    autoTransfer: "",
  });

  const onDeposit = useCallback((name: string) => {
    Haptics.selectionAsync();
    Alert.alert("Deposit", `Add money to ${name}`);
  }, []);
  const onWithdraw = useCallback((name: string) => {
    Haptics.selectionAsync();
    Alert.alert("Withdraw", `Take money from ${name}`);
  }, []);
  const onEdit = useCallback((name: string) => {
    Haptics.selectionAsync();
    Alert.alert("Edit Pot", `Edit settings for ${name}`);
  }, []);

  const handleCreatePot = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCreateModal(true);
  }, []);

  const handleSaveNewPot = useCallback(() => {
    if (!newPotForm.name.trim()) {
      Alert.alert("Error", "Please enter a pot name");
      return;
    }

    if (!newPotForm.target || parseFloat(newPotForm.target) <= 0) {
      Alert.alert("Error", "Please enter a valid target amount");
      return;
    }

    const newPot: Pot = {
      id: `pot-${Date.now()}`, // Generate unique ID
      name: newPotForm.name.trim(),
      target: parseFloat(newPotForm.target),
      current: 0,
      emoji: newPotForm.emoji,
      cadence: "monthly",
      autoAmount: newPotForm.autoTransfer ? parseFloat(newPotForm.autoTransfer) : 0,
      term: newPotForm.term,
    };

    // In a real app, you would call a service function here to save the pot
    // For now, we'll show a success message
    Alert.alert(
      "Success!",
      `Created new pot: ${newPot.name}`,
      [
        {
          text: "OK",
          onPress: () => {
            console.log("New pot created:", newPot);
            // Reset form
            setNewPotForm({
              name: "",
              target: "",
              emoji: "💰",
              term: "short-term",
              autoTransfer: "",
            });
            setShowCreateModal(false);
          }
        }
      ]
    );
  }, [newPotForm]);

  const handleCancelCreate = useCallback(() => {
    setNewPotForm({
      name: "",
      target: "",
      emoji: "💰",
      term: "short-term",
      autoTransfer: "",
    });
    setShowCreateModal(false);
  }, []);

  const emojiOptions = ["💰", "🏠", "🚗", "✈️", "🎓", "💍", "🏖️", "📱", "💻", "🎮", "🏃‍♂️", "🧘‍♀️", "🍕", "☕", "🛍️", "🎵", "📚", "🎨", "🏋️‍♂️", "🌱"];

  return (
    <View>
      <View style={styles.rowBetween}>
        <Text style={styles.h2}>Savings Pots</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create new pot"
          style={styles.primaryPill}
          onPress={handleCreatePot}
        >
          <Text style={styles.primaryPillText}>+ New Pot</Text>
        </Pressable>
      </View>

      <View style={{ height: 16 }} />

      {pots.map((pot) => {
        const pct = Math.min(100, Math.round((pot.current / pot.target) * 100));
        return (
          <View key={pot.id} style={[styles.potCard, styles.cardShadow]}>
            <View style={styles.potHeader}>
              <Text style={styles.potEmoji}>{pot.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.potTitle}>{pot.name}</Text>
                <Text style={styles.potSubtitle}>{pot.term.replace("-", " ")}</Text>
              </View>
              <Text style={styles.potPercent}>{pct}%</Text>
            </View>

            <Progress value={pct} />

            <View style={[styles.rowBetween, { marginTop: 8 }]}>
              <Text style={styles.amountText}>{formatMoney(pot.current)}</Text>
              <Text style={styles.subtle}>of {formatMoney(pot.target)}</Text>
            </View>

            {pot.autoAmount > 0 && (
              <View style={styles.autoBox}>
                <Text style={styles.autoText}>
                  Auto-transfer: {formatMoney(pot.autoAmount)}/{pot.cadence}
                </Text>
              </View>
            )}

            <View style={styles.actionsRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onDeposit(pot.name)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>Deposit</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => onWithdraw(pot.name)}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>Withdraw</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => onEdit(pot.name)}
                style={styles.ghostBtn}
              >
                <Text style={styles.ghostBtnText}>Edit</Text>
              </Pressable>
            </View>
          </View>
        );
      })}

      {/* Create New Pot Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCancelCreate}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelCreate} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create New Pot</Text>
            <TouchableOpacity onPress={handleSaveNewPot} style={styles.modalSaveButton}>
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Pot Name */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Pot Name</Text>
              <TextInput
                style={styles.textInput}
                value={newPotForm.name}
                onChangeText={(text) => setNewPotForm(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Vacation Fund"
                placeholderTextColor={COLORS.mute}
              />
            </View>

            {/* Target Amount */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Target Amount</Text>
              <TextInput
                style={styles.textInput}
                value={newPotForm.target}
                onChangeText={(text) => setNewPotForm(prev => ({ ...prev, target: text }))}
                placeholder="0.00"
                placeholderTextColor={COLORS.mute}
                keyboardType="numeric"
              />
            </View>

            {/* Emoji Selection */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Icon</Text>
              <View style={styles.emojiGrid}>
                {emojiOptions.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiOption,
                      newPotForm.emoji === emoji && styles.emojiOptionSelected
                    ]}
                    onPress={() => setNewPotForm(prev => ({ ...prev, emoji }))}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Term Selection */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Timeframe</Text>
              <View style={styles.termOptions}>
                <TouchableOpacity
                  style={[
                    styles.termOption,
                    newPotForm.term === "short-term" && styles.termOptionSelected
                  ]}
                  onPress={() => setNewPotForm(prev => ({ ...prev, term: "short-term" }))}
                >
                  <Text style={[
                    styles.termOptionText,
                    newPotForm.term === "short-term" && styles.termOptionTextSelected
                  ]}>
                    Short-term
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.termOption,
                    newPotForm.term === "long-term" && styles.termOptionSelected
                  ]}
                  onPress={() => setNewPotForm(prev => ({ ...prev, term: "long-term" }))}
                >
                  <Text style={[
                    styles.termOptionText,
                    newPotForm.term === "long-term" && styles.termOptionTextSelected
                  ]}>
                    Long-term
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Auto Transfer */}
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Auto Transfer (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={newPotForm.autoTransfer}
                onChangeText={(text) => setNewPotForm(prev => ({ ...prev, autoTransfer: text }))}
                placeholder="0.00"
                placeholderTextColor={COLORS.mute}
                keyboardType="numeric"
              />
              <Text style={styles.formHint}>Amount to automatically transfer each month</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

// ---------- Autosave Tab ----------

function AutosaveTab({ rules, pots }: { rules: AutoSaveRule[]; pots: SavingsPot[] }) {
  const [activeTab, setActiveTab] = useState<"overview" | "settings">("overview");
  const [showPotDropdown, setShowPotDropdown] = useState(false);
  const [settings, setSettings] = useState({
    isEnabled: true,
    roundUpType: "nearest_pound",
    destination: "savings_pot",
    selectedSavingsPot: pots?.[0]?.id ?? "emergency",
  });

  // Add state for managing round-ups and savings
  const [roundUps, setRoundUps] = useState([
    { transactionId: "1", originalAmount: -4.3, roundUpAmount: 0.7, timestamp: "2025-09-01T10:30:00Z", status: "completed", merchant: "Starbucks" },
    { transactionId: "2", originalAmount: -12.45, roundUpAmount: 0.55, timestamp: "2025-09-02T14:20:00Z", status: "completed", merchant: "Tesco" },
    { transactionId: "3", originalAmount: -7.89, roundUpAmount: 0.11, timestamp: "2025-09-03T09:15:00Z", status: "pending", merchant: "Costa" },
    { transactionId: "4", originalAmount: -23.67, roundUpAmount: 0.33, timestamp: "2025-09-03T16:45:00Z", status: "pending", merchant: "Amazon" },
    { transactionId: "5", originalAmount: -8.99, roundUpAmount: 0.01, timestamp: "2025-09-04T12:30:00Z", status: "completed", merchant: "McDonald's" },
    { transactionId: "6", originalAmount: -15.75, roundUpAmount: 0.25, timestamp: "2025-09-04T18:20:00Z", status: "completed", merchant: "Pizza Express" },
    { transactionId: "7", originalAmount: -32.4, roundUpAmount: 0.6, timestamp: "2025-09-05T11:15:00Z", status: "completed", merchant: "Sainsbury's" },
    { transactionId: "8", originalAmount: -6.5, roundUpAmount: 0.5, timestamp: "2025-09-05T15:45:00Z", status: "pending", merchant: "Pret A Manger" },
    { transactionId: "9", originalAmount: -19.99, roundUpAmount: 0.01, timestamp: "2025-09-06T09:30:00Z", status: "completed", merchant: "Boots" },
    { transactionId: "10", originalAmount: -45.2, roundUpAmount: 0.8, timestamp: "2025-09-06T14:10:00Z", status: "completed", merchant: "John Lewis" },
    { transactionId: "11", originalAmount: -3.25, roundUpAmount: 0.75, timestamp: "2025-09-07T08:45:00Z", status: "pending", merchant: "Greggs" },
    { transactionId: "12", originalAmount: -28.9, roundUpAmount: 0.1, timestamp: "2025-09-07T19:20:00Z", status: "completed", merchant: "Waitrose" },
  ]);

  const [totalSaved, setTotalSaved] = useState(2847.32);
  const [pendingAmount, setPendingAmount] = useState(1.21);
  const [thisMonthSaved, setThisMonthSaved] = useState(127.45);

  const onSwitchTab = useCallback((tab: "overview" | "settings") => {
    setActiveTab(tab);
    Haptics.selectionAsync();
  }, []);

  const allDestinations = useMemo(
    () => [
      {
        type: "investment" as const,
        value: "isa",
        label: "Stocks & Shares ISA",
        desc: "Invest for long-term growth",
        returns: "+7.2% this year",
        returnColor: "#34c759",
      },
      {
        type: "savings" as const,
        value: "instant_savings",
        label: "Instant Access Savings",
        desc: "General savings account",
        returns: "4.5% AER",
        returnColor: "#34c759",
      },
      ...pots.map((pot) => ({
        type: "pot" as const,
        value: pot.id,
        label: pot.name,
        desc: pot.category === "short-term" ? "Short-term savings goal" : "Long-term savings goal",
        returns: `£${pot.current.toLocaleString("en-GB")}`,
        returnColor: "#007aff",
      })),
    ],
    [pots]
  );

  const updateSettings = useCallback((newSettings: any) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const getCurrentDestination = useCallback(() => {
    if (settings.destination === "savings_pot") {
      return allDestinations.find((d) => d.type === "pot" && d.value === settings.selectedSavingsPot);
    }
    return allDestinations.find((d) => d.value === settings.destination);
  }, [allDestinations, settings.destination, settings.selectedSavingsPot]);

  // Calculate pending amount from round-ups
  const calculatedPendingAmount = useMemo(() => {
    return roundUps
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + r.roundUpAmount, 0);
  }, [roundUps]);

  // Calculate this month saved from round-ups
  const calculatedThisMonthSaved = useMemo(() => {
    return roundUps
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.roundUpAmount, 0);
  }, [roundUps]);

  // Function to save pending amount to the selected pot
  const handleSavePendingAmount = useCallback(async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Get the current destination
      const currentDestination = getCurrentDestination();
      if (!currentDestination) {
        Alert.alert("Error", "No destination selected");
        return;
      }

      // Calculate the amount to save
      const amountToSave = calculatedPendingAmount;
      if (amountToSave <= 0) {
        Alert.alert("No Amount", "No pending amount to save");
        return;
      }

      // Update round-ups status from pending to completed
      const updatedRoundUps = roundUps.map(roundUp => ({
        ...roundUp,
        status: roundUp.status === "pending" ? "completed" : roundUp.status
      }));
      setRoundUps(updatedRoundUps);

      // Update totals
      setTotalSaved(prev => prev + amountToSave);
      setPendingAmount(0);
      setThisMonthSaved(prev => prev + amountToSave);

      // If saving to a pot, update the pot amount
      if (currentDestination.type === "pot") {
        // Find the pot in the pots array
        const potIndex = pots.findIndex(pot => pot.id === currentDestination.value);
        if (potIndex !== -1) {
          // Create updated pots array
          const updatedPots = [...pots];
          updatedPots[potIndex] = {
            ...updatedPots[potIndex],
            current: updatedPots[potIndex].current + amountToSave
          };
          
          // Update the pots in the parent component
          // Note: In a real app, you'd call a service function here
          // For now, we'll show a success message
          Alert.alert(
            "Success!",
            `£${amountToSave.toFixed(2)} saved to ${currentDestination.label}`,
            [
              {
                text: "OK",
                onPress: () => {
                  // You could add additional success feedback here
                  console.log(`Saved £${amountToSave.toFixed(2)} to pot: ${currentDestination.label}`);
                }
              }
            ]
          );
        }
      } else {
        // For investment/savings accounts
        Alert.alert(
          "Success!",
          `£${amountToSave.toFixed(2)} ${settings.destination === "isa" ? "invested" : "saved"} to ${currentDestination.label}`,
          [
            {
              text: "OK",
              onPress: () => {
                console.log(`${settings.destination === "isa" ? "Invested" : "Saved"} £${amountToSave.toFixed(2)} to ${currentDestination.label}`);
              }
            }
          ]
        );
      }

    } catch (error) {
      console.error("Error saving amount:", error);
      Alert.alert("Error", "Failed to save amount. Please try again.");
    }
  }, [roundUps, calculatedPendingAmount, pots, settings.destination, getCurrentDestination]);

  const getDestinationLabel = () => getCurrentDestination()?.label ?? "Select Destination";
  const getDestinationDescription = () => (getCurrentDestination()?.type === "pot" ? "Safe & secure savings" : getCurrentDestination()?.desc ?? "");

  const handleDestinationChange = useCallback(
    (destination: any) => {
      Haptics.selectionAsync();
      if (destination.type === "pot") {
        updateSettings({
          destination: "savings_pot",
          selectedSavingsPot: destination.value,
        });
      } else {
        updateSettings({
          destination: destination.value,
        });
      }
      setShowPotDropdown(false);
    },
    [updateSettings]
  );

  const isCurrentDestination = useCallback(
    (destination: any) => {
      if (destination.type === "pot") {
        return settings.destination === "savings_pot" && settings.selectedSavingsPot === destination.value;
      }
      return settings.destination === destination.value;
    },
    [settings.destination, settings.selectedSavingsPot]
  );

  const OverviewView = () => (
    <View style={{ backgroundColor: COLORS.bg }}>
      {/* Hero */}
      <Card style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24 }} accessibleLabel="Total saved overview">
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 48, fontWeight: "200", color: COLORS.text, lineHeight: 52 }}>
            £{totalSaved.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={{ fontSize: 17, color: COLORS.mute, marginTop: 4 }}>Total Saved</Text>
        </View>
      </Card>

      {/* Stats */}
      <Card style={{ borderRadius: 10, marginTop: 20, marginHorizontal: 0, paddingHorizontal: 20, paddingVertical: 24 }} accessibleLabel="This month and pending amounts">
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "600", color: COLORS.text }}>£{calculatedThisMonthSaved.toFixed(2)}</Text>
            <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 2 }}>This Month</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "600", color: COLORS.orange }}>£{calculatedPendingAmount.toFixed(2)}</Text>
            <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 2 }}>Pending</Text>
          </View>
        </View>
      </Card>

      {/* Destination + dropdown */}
      <Card style={{ marginTop: 20 }}>
        <View style={{ paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: showPotDropdown ? 1 : 0, borderBottomColor: COLORS.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 17, color: COLORS.text }}>{getDestinationLabel()}</Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Toggle destination list"
                  onPress={() => {
                    Haptics.selectionAsync();
                    setShowPotDropdown((s) => !s);
                  }}
                  style={{ padding: 4 }}
                >
                  <Chevron open={showPotDropdown} />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>{getDestinationDescription()}</Text>
            </View>
            <TouchableOpacity
              accessibilityRole="tab"
              accessibilityLabel="Open autosave settings"
              onPress={() => onSwitchTab("settings")}
            >
              <Text style={{ fontSize: 17, color: COLORS.blue }}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showPotDropdown && (
          <View style={styles.dropdownShadow}>
            {/* Investment/Savings header */}
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>INVESTMENT DESTINATION</Text>
            </View>
            {allDestinations
              .filter((d) => d.type === "investment" || d.type === "savings")
              .map((destination, index, array) => (
                <TouchableOpacity
                  key={destination.value}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${destination.label}`}
                  style={[
                    styles.dropdownRow,
                    { borderBottomWidth: index < array.length - 1 ? 1 : 0 },
                    isCurrentDestination(destination) && { backgroundColor: "#f2f2f7" },
                  ]}
                  onPress={() => handleDestinationChange(destination)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, color: COLORS.text }}>{destination.label}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>{destination.desc}</Text>
                    <Text style={{ fontSize: 11, color: destination.returnColor, marginTop: 2, fontWeight: "600" }}>{destination.returns}</Text>
                  </View>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: isCurrentDestination(destination) ? 6 : 1,
                      borderColor: isCurrentDestination(destination) ? COLORS.blue : COLORS.border,
                      backgroundColor: COLORS.card,
                    }}
                  />
                </TouchableOpacity>
              ))}

            {/* Pots header */}
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>CHOOSE SAVINGS POT</Text>
            </View>

            {allDestinations
              .filter((d) => d.type === "pot")
              .map((destination, index, array) => (
                <TouchableOpacity
                  key={destination.value}
                  accessibilityRole="button"
                  accessibilityLabel={`Select pot ${destination.label}`}
                  style={[
                    styles.dropdownRow,
                    { borderBottomWidth: index < array.length - 1 ? 1 : 0 },
                    isCurrentDestination(destination) && { backgroundColor: "#f2f2f7" },
                  ]}
                  onPress={() => handleDestinationChange(destination)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, color: COLORS.text }}>{destination.label}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>{destination.desc}</Text>
                    <Text style={{ fontSize: 11, color: destination.returnColor, marginTop: 2, fontWeight: "600" }}>{destination.returns}</Text>
                  </View>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: isCurrentDestination(destination) ? 6 : 1,
                      borderColor: isCurrentDestination(destination) ? COLORS.blue : COLORS.border,
                      backgroundColor: COLORS.card,
                    }}
                  />
                </TouchableOpacity>
              ))}
          </View>
        )}
      </Card>

      {/* Action Button */}
      {calculatedPendingAmount > 0 && (
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`${settings.destination === "isa" ? "Invest" : "Save"} pending amount`}
            style={styles.primaryCTA}
            onPress={handleSavePendingAmount}
          >
            <Text style={styles.primaryCTAtext}>
              {settings.destination === "isa" ? "Invest" : "Save"} £{calculatedPendingAmount.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recent Activity */}
      <Card style={{ marginTop: 35 }} accessibleLabel="Recent round-up activity">
        <View style={styles.listHeaderRow}>
          <Text style={styles.listHeaderTitle}>Recent Activity</Text>
          <Text style={{ color: COLORS.mute, fontSize: 13 }}>
            This month: £{calculatedThisMonthSaved.toFixed(2)}
          </Text>
        </View>

        <FlatList
          data={roundUps}
          keyExtractor={(item) => item.transactionId}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 320 }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: COLORS.border }} />}
          renderItem={({ item }) => (
            <View style={styles.roundupRow}>
              <View>
                <Text style={{ fontSize: 17, color: COLORS.text }}>{item.merchant}</Text>
                <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>{shortDay(item.timestamp)}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 17, color: COLORS.green }}>+£{item.roundUpAmount.toFixed(2)}</Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: item.status === "completed" ? COLORS.green : COLORS.orange,
                    marginTop: 1,
                  }}
                >
                  {item.status === "completed" ? (settings.destination === "isa" ? "Invested" : "Saved") : "Pending"}
                </Text>
              </View>
            </View>
          )}
        />
      </Card>
    </View>
  );

  const SettingsView = () => (
    <View style={{ backgroundColor: COLORS.bg }}>
      {/* Header */}
      <Card style={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24 }} accessibleLabel="Autosave settings">
        <View>
          <Text style={{ fontSize: 34, fontWeight: "700", color: COLORS.text }}>Settings</Text>
          <Text style={{ fontSize: 17, color: COLORS.mute, marginTop: 4 }}>Configure your spare change</Text>
        </View>
      </Card>

      {/* Enable Toggle */}
      <Card style={{ marginTop: 20 }} accessibleLabel="Round-up investing toggle">
        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View accessible>
              <Text style={{ fontSize: 17, color: COLORS.text }}>Round-Up Investing</Text>
              <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>Automatically invest spare change</Text>
            </View>
            <Switch
              accessibilityLabel="Enable round-up investing"
              value={settings.isEnabled}
              onValueChange={(v) => {
                updateSettings({ isEnabled: v });
                Haptics.selectionAsync();
              }}
              trackColor={{ false: "#e5e5ea", true: "#b7f7c6" }}
              thumbColor={settings.isEnabled ? COLORS.green : "#f4f3f4"}
            />
          </View>
        </View>
      </Card>

      {settings.isEnabled && (
        <>
          {/* Round Up Method */}
          <Card style={{ marginTop: 35 }} accessibleLabel="Round up method">
            <View style={styles.sectionDividerHeader}>
              <Text style={styles.sectionDividerHeaderText}>ROUND UP METHOD</Text>
            </View>

            {[
              { value: "nearest_pound", label: "Nearest Pound", desc: "£4.30 → save £0.70" },
              { value: "nearest_50p", label: "Nearest 50p", desc: "£4.30 → save £0.20" },
              { value: "fixed_amount", label: "Fixed Amount", desc: "Always save £1.00" },
            ].map((option, index, array) => {
              const selected = settings.roundUpType === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={option.label}
                  style={[
                    styles.radioRow,
                    { borderBottomWidth: index < array.length - 1 ? 1 : 0 },
                  ]}
                  onPress={() => {
                    updateSettings({ roundUpType: option.value });
                    Haptics.selectionAsync();
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 17, color: COLORS.text }}>{option.label}</Text>
                    <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>{option.desc}</Text>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: selected ? 7 : 1,
                      borderColor: selected ? COLORS.blue : COLORS.border,
                      backgroundColor: COLORS.card,
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </Card>

          {/* All Destinations */}
          <Card style={{ marginTop: 35 }} accessibleLabel="Investment destination selection">
            <View style={styles.sectionDividerHeader}>
              <Text style={styles.sectionDividerHeaderText}>INVESTMENT DESTINATION</Text>
            </View>

            {allDestinations
              .filter((d) => d.type === "investment" || d.type === "savings")
              .map((option, index, array) => {
                const selected =
                  settings.destination === option.value ||
                  (option.value === "savings_pot" && settings.destination === "savings_pot");
                return (
                  <TouchableOpacity
                    key={option.value}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option.label}
                    style={[
                      styles.radioRow,
                      { borderBottomWidth: index < array.length - 1 ? 1 : 0 },
                    ]}
                    onPress={() => {
                      updateSettings({ destination: option.value });
                      Haptics.selectionAsync();
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 17, color: COLORS.text }}>{option.label}</Text>
                      <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>{option.desc}</Text>
                      <Text style={{ fontSize: 11, color: option.returnColor, marginTop: 2, fontWeight: "600" }}>
                        {option.returns}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: selected ? 7 : 1,
                        borderColor: selected ? COLORS.blue : COLORS.border,
                        backgroundColor: COLORS.card,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
          </Card>

          {/* Savings Pot Selection */}
          {settings.destination === "savings_pot" && (
            <Card style={{ marginTop: 35 }} accessibleLabel="Choose savings pot">
              <View style={styles.sectionDividerHeader}>
                <Text style={styles.sectionDividerHeaderText}>CHOOSE SAVINGS POT</Text>
              </View>

              {allDestinations
                .filter((d) => d.type === "pot")
                .map((pot, index, array) => {
                  const selected = settings.selectedSavingsPot === pot.value;
                  return (
                    <TouchableOpacity
                      key={pot.value}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      accessibilityLabel={pot.label}
                      style={[
                        styles.radioRow,
                        { borderBottomWidth: index < array.length - 1 ? 1 : 0 },
                      ]}
                      onPress={() => {
                        updateSettings({ selectedSavingsPot: pot.value });
                        Haptics.selectionAsync();
                      }}
                    >
                      <View>
                        <Text style={{ fontSize: 17, color: COLORS.text }}>{pot.label}</Text>
                        <Text style={{ fontSize: 13, color: COLORS.mute, marginTop: 1 }}>{pot.desc}</Text>
                        <Text style={{ fontSize: 11, color: pot.returnColor, marginTop: 2, fontWeight: "600" }}>
                          {pot.returns}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          borderWidth: selected ? 7 : 1,
                          borderColor: selected ? COLORS.blue : COLORS.border,
                          backgroundColor: COLORS.card,
                        }}
                      />
                    </TouchableOpacity>
                  );
                })}
            </Card>
          )}
        </>
      )}
    </View>
  );

  return (
    <View style={{ backgroundColor: COLORS.bg }}>
      {/* Tab Bar */}
      <View style={{ backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
        <View style={{ flexDirection: "row" }} accessibilityRole="tablist">
          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "overview" }}
            onPress={() => onSwitchTab("overview")}
            style={[styles.subTabBtn, activeTab === "overview" && styles.subTabBtnActive]}
          >
            <Text style={[styles.subTabText, activeTab === "overview" && styles.subTabTextActive]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === "settings" }}
            onPress={() => onSwitchTab("settings")}
            style={[styles.subTabBtn, activeTab === "settings" && styles.subTabBtnActive]}
          >
            <Text style={[styles.subTabText, activeTab === "settings" && styles.subTabTextActive]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === "overview" ? <OverviewView /> : <SettingsView />}
    </View>
  );
}

// ---------- Cashback Tab ----------

function CashbackTab({ offers }: { offers: CashbackOffer[] }) {
  const open = useCallback(async (url: string, merchant: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Activated", `${merchant} offer activated`);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", "Could not open link");
    }
  }, []);

  return (
    <View>
      <Text style={styles.h2}>Cashback</Text>
      <FlatList
        data={offers}
        keyExtractor={(o) => o.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <View style={[styles.offerCard, styles.cardShadow]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.offerTitle}>{item.merchant}</Text>
              <Text style={styles.subtle}>{item.caption}</Text>
            </View>
            <Text style={styles.offerBadge}>{item.rateLabel}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Activate ${item.merchant} cashback`}
              style={styles.primaryPill}
              onPress={() => open(item.deepLink, item.merchant)}
            >
              <Text style={styles.primaryPillText}>Activate</Text>
            </Pressable>
          </View>
        )}
      />
      <Text style={styles.hint}>
        Activation opens the merchant site via a tracked link so rewards are attributed.
      </Text>
    </View>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.mute,
  },

  // Card base (unified shadow)
  cardBase: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },

  periodContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  periodChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodChipActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  periodChipText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  periodChipTextActive: {
    color: COLORS.card,
    fontWeight: "600",
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.mute,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  section: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  // Segments
  segmentContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  segment: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
    borderWidth: 1, // ensure visible border
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  segmentTextActive: {
    color: COLORS.card,
  },
  tabContentContainer: {
    marginHorizontal: 0,
  },

  h2: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryPill: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  primaryPillText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  subtle: {
    fontSize: 13,
    color: COLORS.mute,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },

  // Pots
  potCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  potHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  potEmoji: {
    fontSize: 24,
    marginRight: 4,
  },
  potTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  potSubtitle: {
    fontSize: 13,
    color: COLORS.mute,
  },
  potPercent: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.green,
  },
  autoBox: {
    backgroundColor: COLORS.green + "12",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.green + "20",
    marginTop: 12,
  },
  autoText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: "500",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  secondaryBtn: {
    backgroundColor: COLORS.blue + "12",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.blue + "20",
  },
  secondaryBtnText: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: "600",
  },
  ghostBtn: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ghostBtnText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },

  // Cashflow mini
  cashFlowContainer: {
    gap: 16,
  },
  cashFlowTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  cashFlowSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
  },
  energyTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: COLORS.border,
    overflow: "hidden",
  },
  energyMask: {
    height: "100%",
    borderRadius: 999,
  },
  energyFill: {
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
  },
  tickLabel: {
    fontSize: 12,
    color: COLORS.mute,
    marginTop: 2,
  },
  noticeBad: {
    backgroundColor: COLORS.red + "12",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.red + "20",
  },
  noticeText: {
    fontSize: 13,
    color: COLORS.red,
    fontWeight: "500",
  },

  // Dropdown
  dropdownShadow: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  dropdownHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: "#f8f8f8",
  },
  dropdownHeaderText: {
    fontSize: 13,
    color: COLORS.mute,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  dropdownRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // Autosave sub tabs
  subTabBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  subTabBtnActive: {
    borderBottomColor: COLORS.blue,
  },
  subTabText: {
    fontSize: 17,
    fontWeight: "400",
    color: COLORS.mute,
    textAlign: "center",
  },
  subTabTextActive: {
    color: COLORS.blue,
  },

  // Settings rows
  sectionDividerHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionDividerHeaderText: {
    fontSize: 13,
    color: COLORS.mute,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  radioRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: COLORS.border,
  },

  // Lists
  listHeaderRow: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listHeaderTitle: {
    fontSize: 17,
    color: COLORS.text,
    fontWeight: "600",
  },
  roundupRow: {
    paddingVertical: 12,
    paddingHorizontal: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // Cashback
  offerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  offerBadge: {
    backgroundColor: COLORS.green + "12",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.green + "20",
    alignSelf: "flex-start",
    marginRight: 8,
  },
  hint: {
    fontSize: 13,
    color: COLORS.mute,
    textAlign: "center",
    marginTop: 16,
  },

  // Misc
  compactChartContainer: {
    marginTop: 16,
  },
  viewFullTrendsButton: {
    backgroundColor: COLORS.blue + "05",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.blue + "20",
  },
  viewFullTrendsText: {
    fontSize: 13,
    color: COLORS.blue,
    fontWeight: "600",
  },

  primaryCTA: {
    width: "100%",
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  primaryCTAtext: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.card,
  },

  // Modal
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 17,
    color: COLORS.blue,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
    textAlign: "center",
  },
  modalSaveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.blue,
  },
  modalSaveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 17,
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 17,
    color: COLORS.text,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: 10,
  },
  emojiOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiOptionSelected: {
    borderColor: COLORS.blue,
    borderWidth: 2,
  },
  emojiText: {
    fontSize: 24,
  },
  termOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  termOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  termOptionSelected: {
    borderColor: COLORS.blue,
    borderWidth: 1,
  },
  termOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  termOptionTextSelected: {
    color: COLORS.blue,
  },
  formHint: {
    fontSize: 13,
    color: COLORS.mute,
    marginTop: 8,
  },
});
