import React, { useMemo, useState, useRef, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Animated, Modal, TextInput, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import TouchablePieChart, { Slice } from "../../components/TouchablePieChart";
import { 
  useTransactions, 
  useUpcomingBills, 
  useAIInsights,
  useSavingsPots,
  useMonthlyTrends,
  formatCurrency,
  type Transaction,
  type UpcomingBill,
  type AIInsight
} from "../services/dataService";
import { trueLayerService } from "../services/truelayerService";
import { BankingSummaryCard } from "../components/BankingSummaryCard";
import { useTrueLayerConnection } from "../hooks/useTrueLayerData";
import TrendsDetailScreen from "./TrendsDetailScreen";
import { LineChart } from 'react-native-gifted-charts';
import { useNavigation } from '@react-navigation/native';

type Upcoming = {
  id: string;
  label: string;
  date: string;
  amount: number;
  category?: string;
};
import { 
  CardSkeleton, 
  PieChartSkeleton, 
  LegendSkeleton,
  AIInsightSkeleton 
} from "../components/SkeletonLoader";
import { 
  NoUpcomingBillsEmptyState,
  NoAIInsightsEmptyState 
} from "../components/EmptyState";

const COLORS = {
  bg: "#F7F8FB",
  card: "#FFFFFF",
  border: "#EAECEF",
  text: "#0F172A",
  mute: "#6B7280",
  red: "#FF3B30",
  blue: "#007AFF",
  green: "#30D158",
  violet: "#5856D6",
  purple: "#AF52DE",
  orange: "#FF9F0A",
};

function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

/* ---------------- Spending Breakdown ---------------- */
function SpendingBreakdownCard() {
  const [selected, setSelected] = useState<number | null>(null);
  const { transactions, loading: transactionsLoading } = useTransactions();
  
  const pieData: Slice[] = useMemo(() => {
    if (transactionsLoading || !transactions.length) return [];
    const categoryTotals: { [key: string]: number } = {};
    transactions.forEach(tx => {
      if (tx.amount < 0) {
        // Temporarily group more transactions into "Purchases" for scroll testing
        let category = tx.category;
        if (category === 'TRANSFER' || category === 'DIRECT_DEBIT' || category === 'PURCHASE') {
          category = 'Purchases & Transfers';
        }
        categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(tx.amount);
      }
    });
    const colors = [COLORS.red, COLORS.blue, COLORS.green, COLORS.violet, COLORS.orange];
    return Object.entries(categoryTotals).map(([label, value], index) => ({
      label,
      value,
      color: colors[index % colors.length]
    }));
  }, [transactions, transactionsLoading]);

  const total = useMemo(() => pieData.reduce((s, d) => s + d.value, 0), [pieData]);

  const selectedSlice = selected != null ? pieData[selected] : null;
  const selectedTx: Transaction[] = useMemo(() => {
    if (!selectedSlice) return [];
    return transactions.filter(tx => {
      if (tx.amount >= 0) return false;
      
      // Match the same grouping logic used for categorization
      let category = tx.category;
      if (category === 'TRANSFER' || category === 'DIRECT_DEBIT' || category === 'PURCHASE') {
        category = 'Purchases & Transfers';
      }
      
      return category === selectedSlice.label;
    });
  }, [selectedSlice, transactions]);

  const handleSegmentSelect = (index: number) => {
    setSelected(prev => (prev === index ? null : index));
  };

  if (transactionsLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.h2}>Spending breakdown</Text>
        <Text style={styles.muted}>Where your money went this month</Text>
        <PieChartSkeleton />
        <LegendSkeleton />
      </View>
    );
  }

  if (!pieData.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.h2}>Spending breakdown</Text>
        <Text style={styles.muted}>Where your money went this month</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No Spending Data</Text>
          <Text style={styles.emptySubtitle}>Your spending breakdown will appear here once you have transactions.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.h2}>Spending breakdown</Text>
      <Text style={styles.muted}>Where your money went this month</Text>

      <View style={styles.pieWrap}>
        <TouchablePieChart
          data={pieData}
          size={280}
          onSelect={handleSegmentSelect}
        />
        <View style={styles.pieCenter}>
          <Text style={styles.centerBig}>{formatCurrency(total)}</Text>
          <Text style={styles.centerSub}>Total spent</Text>
        </View>
      </View>

      <View style={{ marginTop: 12, gap: 10 }}>
        {pieData.map((s, i) => {
          const active = i === selected;
          return (
            <TouchableOpacity
              key={s.label}
              style={[styles.legendRow, active && { backgroundColor: "#F4F6FB" }]}
              onPress={() => handleSegmentSelect(i)}
            >
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={[styles.legendLabel, active && { fontWeight: "800" }]}>{s.label}</Text>
              <Text style={[styles.legendAmt, active && { color: COLORS.blue }]}>
                {formatCurrency(s.value)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedSlice && (
        <View style={[styles.detailCard, { borderLeftColor: selectedSlice.color }]}>
          <Text style={styles.detailTitle}>
            {selectedSlice.label} • {selectedTx.length} item{selectedTx.length !== 1 ? "s" : ""}
          </Text>
          
          <View style={{ 
            height: 180,
            borderRadius: 8,
            backgroundColor: 'rgba(0,0,0,0.02)',
            paddingHorizontal: 8,
            overflow: 'hidden'
          }}>
            <FlatList
              data={[...selectedTx].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
              renderItem={({ item }) => (
                <View style={styles.txRow}>
                  <View style={styles.txCol}>
                    <Text style={styles.txName}>{item.name}</Text>
                    <Text style={styles.txSub}>{item.date} • {item.time}</Text>
                  </View>
                  <Text style={styles.txAmt}>{formatCurrency(item.amount)}</Text>
                </View>
              )}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              indicatorStyle="black"
              nestedScrollEnabled={true}
              contentContainerStyle={{ paddingVertical: 8 }}
              bounces={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

/* ---------------- Upcoming Bills ---------------- */
function UpcomingBillsCard() {
  const { upcomingBills } = useUpcomingBills();
  if (!upcomingBills.length) return null;

  return (
    <View style={styles.upcomingList}>
      {upcomingBills.map((bill, idx) => (
        <View key={bill.id} style={[
          styles.upcomingItem,
          idx !== upcomingBills.length - 1 && styles.upcomingItemDivider
        ]}>
          <View style={styles.upcomingLeft}>
            <View style={styles.upcomingDot} />
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>{bill.label}</Text>
              <Text style={styles.upcomingMeta}>
                {bill.date} • {bill.category}
              </Text>
            </View>
          </View>
          <View style={styles.upcomingRight}>
            <Text style={styles.upcomingAmount}>{formatCurrency(bill.amount)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------- AI Insights ---------------- */
function AIInsightsCard() {
  const { aiInsights, loading: aiInsightsLoading } = useAIInsights();

  if (aiInsightsLoading) {
    return (
      <View style={styles.card}>
        <AIInsightSkeleton />
      </View>
    );
  }

  if (!aiInsights.length) {
    return (
      <View style={styles.card}>
        <NoAIInsightsEmptyState />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.h2}>AI Insights</Text>
      <Text style={styles.muted}>Smart recommendations for your finances</Text>
      
      {aiInsights.map((insight, index) => (
        <View key={insight.id} style={[styles.insightBox, index > 0 && { marginTop: 8 }]}>
          <Text style={styles.insightIcon}>{insight.icon}</Text>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>{insight.title}</Text>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            {insight.action && (
              <TouchableOpacity style={styles.whyButton}>
                <Text style={styles.whyButtonText}>{insight.action.label}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

/* ---------------- Compact Trends (Upgraded) ---------------- */

type ChartRow = { label: string; income: number; expenses: number };

function CompactTrendsCard({ onSeeTrends }: { onSeeTrends: () => void }) {
  // Prefer server-provided monthly trends
  const { monthlyTrends, loading: trendsLoading } = useMonthlyTrends();
  // Fallback: aggregate from transactions
  const { transactions, loading: txLoading } = useTransactions();

  const rows: ChartRow[] = useMemo(() => {
    if (!trendsLoading && monthlyTrends && monthlyTrends.length > 0) {
      return monthlyTrends
        .slice(-6)
        .map((m: any) => ({
          label: String(m.month ?? ''),
          income: Number(m.income) || 0,
          expenses: Number(m.expenses) || 0,
        }));
    }
    if (!txLoading && transactions && transactions.length > 0) {
      const byMonth: Record<string, { income: number; expenses: number; label: string }> = {};
      for (const tx of transactions) {
        const d = new Date(tx.date);
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const short = d.toLocaleString(undefined, { month: 'short' });
        if (!byMonth[ym]) byMonth[ym] = { income: 0, expenses: 0, label: short };
        if (tx.amount >= 0) byMonth[ym].income += tx.amount;
        else byMonth[ym].expenses += Math.abs(tx.amount);
      }
      return Object.entries(byMonth)
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([, v]) => ({ label: v.label, income: Math.round(v.income), expenses: Math.round(v.expenses) }))
        .slice(-6);
    }
    return [];
  }, [monthlyTrends, trendsLoading, transactions, txLoading]);

  const loading = trendsLoading || txLoading;

  return (
    <View style={styles.card}>
      <View style={styles.trendsHeader}>
        <View>
          <Text style={styles.trendsTitle}>Income vs Expenses</Text>
          <Text style={styles.trendsSubtitle}>
            {rows.length > 0 ? `Last ${rows.length} months` : 'This month'}
          </Text>
        </View>
        <TouchableOpacity style={styles.seeTrendsButton} onPress={onSeeTrends}>
          <Text style={styles.seeTrendsText}>See trends</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.miniChartContainer}>
        {loading ? (
          <View style={styles.skeletonTrendsSparkline} />
        ) : rows.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Data Available</Text>
            <Text style={styles.emptySubtitle}>Chart will appear when data is loaded</Text>
          </View>
        ) : (
          <>
            <View style={styles.chartWrapper}>
              <GiftedTwoLine rows={rows} />
            </View>
            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.legendLabel}>Income</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={styles.legendLabel}>Expenses</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const GiftedTwoLine: React.FC<{ rows: ChartRow[] }> = ({ rows }) => {
  const data1 = rows.map(r => ({
    value: r.income,
    label: r.label,
    dataPointColor: '#34C759',
    labelComponent: () => null,
  }));
  const data2 = rows.map(r => ({
    value: r.expenses,
    label: r.label,
    dataPointColor: '#FF3B30',
    labelComponent: () => null,
  }));

  return (
    <LineChart
      hideAxesAndRules
      hideDataPoints={false}
      curved
      thickness={3}
      initialSpacing={10}
      spacing={42}
      xAxisLength={0}
      yAxisColor="transparent"
      xAxisColor="transparent"
      color1={'#34C759'}
      color2={'#FF3B30'}
      data={data1}
      data2={data2}
      height={74}
      width={280}
      backgroundColor={'#F5F7FB'}
      rulesColor={'#E9EEF5'}
      dataPointsColor={'#34C759'}
      dataPointsColor2={'#FF3B30'}
      showVerticalLines={false}
      dataPointsRadius={4}
      animationDuration={700}
    />
  );
};

/* ---------------- Savings Pots ---------------- */
function SavingsPotsCard({ onToggle, onCreate, onEdit }: {
  onToggle: () => void;
  onCreate: () => void;
  onEdit: (pot: any) => void;
}) {
  const { savingsPots } = useSavingsPots();

  return (
    <View style={styles.card}>
      <View style={styles.savingsPotsHeader}>
        <View>
          <Text style={styles.h2}>Savings Pots</Text>
          <Text style={styles.muted}>Your financial goals</Text>
        </View>
        <TouchableOpacity style={styles.addPotButton} onPress={onCreate}>
          <Text style={styles.addPotButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      {savingsPots.length > 0 ? (
        <View style={styles.savingsPotsList}>
          {savingsPots.slice(0, 3).map((pot) => (
            <TouchableOpacity 
              key={pot.id} 
              style={styles.savingsPotItem}
              onPress={() => onEdit(pot)}
              activeOpacity={0.7}
            >
              <View style={styles.savingsPotLeft}>
                {pot.photo ? (
                  <View style={[styles.savingsPotPhoto, { backgroundColor: pot.color + "20" }]}>
                    <Image source={{ uri: pot.photo }} style={styles.savingsPotPhotoImage} />
                  </View>
                ) : (
                  <View style={[styles.savingsPotIcon, { backgroundColor: pot.color + "20" }]}>
                    <Text style={styles.savingsPotIconText}>{pot.icon}</Text>
                  </View>
                )}
                <View style={styles.savingsPotInfo}>
                  <Text style={styles.savingsPotName}>{pot.name}</Text>
                  <Text style={styles.savingsPotProgress}>
                    {formatCurrency(pot.current)} of {formatCurrency(pot.target)}
                  </Text>
                  {pot.deadline && (
                    <Text style={styles.savingsPotDeadline}>
                      Due: {pot.deadline}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.savingsPotRight}>
                <Text style={styles.savingsPotPercentage}>
                  {Math.round((pot.current / pot.target) * 100)}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptySavingsPots}>
          <Text style={styles.emptySavingsText}>No savings pots yet</Text>
          <TouchableOpacity style={styles.createFirstPotButton} onPress={onCreate}>
            <Text style={styles.createFirstPotButtonText}>Create your first pot</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

/* ---------------- Screen ---------------- */
export default function DashboardClassic({ onConnectBank }: { onConnectBank?: () => void }) {
  const navigation = useNavigation();
  const { isConnected } = useTrueLayerConnection();
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [showSavingsPots, setShowSavingsPots] = useState(false);
  const [selectedPot, setSelectedPot] = useState<any>(null);
  const [showPotModal, setShowPotModal] = useState(false);
  const [potForm, setPotForm] = useState({
    name: '',
    target: '',
    icon: '💰',
    color: COLORS.blue,
    photo: null as string | null,
    deadline: ''
  });
  const [showTrendsDetail, setShowTrendsDetail] = useState(false);
  
  let transactionsLoading = false;
  let billsLoading = false;
  let aiInsightsLoading = false;
  let savingsLoading = false;
  let transactions: Transaction[] = [];
  let upcomingBills: UpcomingBill[] = [];
  let aiInsights: AIInsight[] = [];
  let savingsPots: any[] = [];

  try {
    const transactionsHook = useTransactions();
    const upcomingBillsHook = useUpcomingBills();
    const aiInsightsHook = useAIInsights();
    const savingsPotsHook = useSavingsPots();
    
    transactionsLoading = transactionsHook.loading;
    billsLoading = upcomingBillsHook.loading;
    aiInsightsLoading = aiInsightsHook.loading;
    savingsLoading = savingsPotsHook.loading;
    
    transactions = transactionsHook.transactions || [];
    upcomingBills = upcomingBillsHook.upcomingBills || [];
    aiInsights = aiInsightsHook.aiInsights || [];
    savingsPots = savingsPotsHook.savingsPots || [];
  } catch (error) {
    console.error('Error loading data:', error);
  }

  const chevronRotation = useRef(new Animated.Value(0)).current;
  const contentHeight = useRef(new Animated.Value(0)).current;

  const animateDropdown = (isOpen: boolean) => {
    const toValue = isOpen ? 1 : 0;
    Animated.parallel([
      Animated.timing(chevronRotation, {
        toValue: toValue * 90,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentHeight, {
        toValue: toValue,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleUpcomingToggle = () => {
    const newState = !showUpcoming;
    setShowUpcoming(newState);
    animateDropdown(newState);
  };

  const handleSavingsPotsToggle = () => {
    setShowSavingsPots(!showSavingsPots);
  };

  const handleCreatePot = () => {
    setSelectedPot(null);
    setPotForm({
      name: '',
      target: '',
      icon: '💰',
      color: COLORS.blue,
      photo: null,
      deadline: ''
    });
    setShowPotModal(true);
  };

  const handleEditPot = (pot: any) => {
    setSelectedPot(pot);
    setPotForm({
      name: pot.name,
      target: pot.target.toString(),
      icon: pot.icon,
      color: pot.color,
      photo: pot.photo,
      deadline: pot.deadline
    });
    setShowPotModal(true);
  };

  const handleSavePot = () => {
    // TODO: Implement actual save logic to data service
    console.log('Saving pot:', selectedPot ? 'edit' : 'new', potForm);
    setShowPotModal(false);
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPotForm({...potForm, photo: result.assets[0].uri});
    }
  };

  const handleConnectBank = () => {
    // Use the prop if provided, otherwise fall back to navigation
    if (onConnectBank) {
      onConnectBank();
    } else {
      navigation.navigate('BankConnection' as never);
    }
  };

  useEffect(() => {
    chevronRotation.setValue(0);
    contentHeight.setValue(0);
  }, []);
  
  const balance = useMemo(() => {
    if (transactionsLoading) return 0;
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  }, [transactions, transactionsLoading]);

  const name = "Alex";

  if (!transactions && !upcomingBills && !aiInsights && !savingsPots) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: COLORS.text }}>Loading Aureon Mobile...</Text>
      </SafeAreaView>
    );
  }
  
  if (transactionsLoading || billsLoading || aiInsightsLoading || savingsLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.card}>
                <Text style={styles.h1}>
                  {greeting()} <Text style={{ color: COLORS.blue }}>{name}</Text> 👋
                </Text>
                <Text style={styles.muted}>Balance is currently</Text>
                <View style={styles.balanceSkeleton}>
                  <View style={styles.skeletonBalance} />
                </View>
              </View>
              <View style={styles.card}>
                <Text style={styles.h2}>Upcoming Transactions</Text>
                <Text style={styles.muted}>Loading...</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.h2}>Spending Breakdown</Text>
                <Text style={styles.muted}>Loading...</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.h2}>Savings Pots</Text>
                <Text style={styles.muted}>Loading...</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.h2}>AI Insight</Text>
                <Text style={styles.muted}>Loading...</Text>
              </View>
            </>
          }
          data={[]}
          renderItem={() => null}
          keyExtractor={() => "x"}
          contentContainerStyle={{ paddingVertical: 20, gap: 16 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.card}>
              <Text style={styles.h1}>
                {greeting()} <Text style={{ color: COLORS.blue }}>{name}</Text> 👋
              </Text>
              <Text style={styles.muted}>Balance is currently</Text>
              <Text style={styles.balance}>{formatCurrency(balance)}</Text>
              
              {/* Bank Connection Button */}
              {!isConnected && (
                <TouchableOpacity 
                  style={styles.connectBankButton}
                  onPress={handleConnectBank}
                >
                  <Text style={styles.connectBankIcon}>🏦</Text>
                  <Text style={styles.connectBankText}>Connect Your Bank</Text>
                </TouchableOpacity>
              )}

              {/* Banking Summary Card - Show when connected */}
              {isConnected && <BankingSummaryCard />}
            </View>

            {/* Upgraded Compact Trends */}
            <CompactTrendsCard onSeeTrends={() => setShowTrendsDetail(true)} />

            {/* Upcoming Transactions (Toggleable) */}
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={handleUpcomingToggle}
              >
                <View>
                  <Text style={styles.h2}>Upcoming Transactions</Text>
                  <Text style={styles.muted}>Next 7–10 days</Text>
                  {!showUpcoming && upcomingBills.length > 0 && (
                    <View style={styles.nextTransactionPreview}>
                      <Text style={styles.nextTransactionText}>
                        Next: {upcomingBills[0].label} • {formatCurrency(upcomingBills[0].amount)}
                      </Text>
                    </View>
                  )}
                </View>
                <Animated.Text
                  style={[
                    styles.chevron,
                    {
                      transform: [{ rotate: chevronRotation.interpolate({
                        inputRange: [0, 90],
                        outputRange: ['0deg', '90deg']
                      })}]
                    }
                  ]}
                >
                  ›
                </Animated.Text>
              </TouchableOpacity>

              <Animated.View 
                style={{
                  overflow: 'hidden',
                  opacity: contentHeight,
                  maxHeight: contentHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 300]
                  })
                }}
              >
                <UpcomingBillsCard />
              </Animated.View>
            </View>
            
            <SpendingBreakdownCard />
            
            <SavingsPotsCard 
              onToggle={handleSavingsPotsToggle} 
              onCreate={handleCreatePot} 
              onEdit={handleEditPot} 
            />
            
            <AIInsightsCard />
          </>
        }
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
      />

      {/* Savings Pot Modal */}
      <Modal
        visible={showPotModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPotModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPotModal(false)}>
              <Text style={styles.modalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedPot ? 'Edit Savings Pot' : 'New Savings Pot'}
            </Text>
            <TouchableOpacity onPress={handleSavePot}>
              <Text style={styles.modalSaveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Pot Name</Text>
              <TextInput
                style={styles.formInput}
                value={potForm.name}
                onChangeText={(text) => setPotForm({...potForm, name: text})}
                placeholder="e.g., Holiday Fund"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Target Amount</Text>
              <TextInput
                style={styles.formInput}
                value={potForm.target}
                onChangeText={(text) => setPotForm({...potForm, target: text})}
                placeholder="e.g., 5000"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Icon</Text>
              <TextInput
                style={styles.formInput}
                value={potForm.icon}
                onChangeText={(text) => setPotForm({...potForm, icon: text})}
                placeholder="e.g., 🏖️"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Deadline (Optional)</Text>
              <TextInput
                style={styles.formInput}
                value={potForm.deadline}
                onChangeText={(text) => setPotForm({...potForm, deadline: text})}
                placeholder="e.g., 2024-12-31"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Photo (Optional)</Text>
              <View style={styles.photoSection}>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
              </View>
              
              {potForm.photo && (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: potForm.photo }} style={styles.photoImage} />
                  <TouchableOpacity 
                    style={styles.removePhotoButton}
                    onPress={() => setPotForm({...potForm, photo: null})}
                  >
                    <Text style={styles.removePhotoText}>×</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Trends Detail Modal */}
      <Modal
        visible={showTrendsDetail}
        animationType="slide"
        onRequestClose={() => setShowTrendsDetail(false)}
      >
        <TrendsDetailScreen onClose={() => setShowTrendsDetail(false)} />
      </Modal>
    </SafeAreaView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  h1: { fontSize: 22, fontWeight: "600", color: COLORS.text, letterSpacing: -0.2 },
  h2: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  muted: { color: COLORS.mute, marginTop: 4 },
  balance: { marginTop: 8, fontSize: 30, fontWeight: "600", color: COLORS.text },
  balanceSkeleton: { marginTop: 8, height: 30, backgroundColor: COLORS.border, borderRadius: 8 },
  skeletonBalance: { height: "100%", backgroundColor: COLORS.mute, borderRadius: 8 },

  pieWrap: { alignItems: "center", justifyContent: "center", marginTop: 14 },
  pieCenter: { position: "absolute", alignItems: "center", justifyContent: "center" },
  centerBig: { fontSize: 22, fontWeight: "600", color: COLORS.text },
  centerSub: { color: COLORS.mute, fontSize: 14 },
  legendRow: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendLabel: { flex: 1, color: COLORS.text, fontWeight: "600" },
  legendAmt: { fontWeight: "600", color: COLORS.text },

  detailCard: {
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.red,
    paddingLeft: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detailTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  sep: { height: 12 },
  txRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  txCol: { flex: 1 },
  txName: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  txSub: { fontSize: 12, color: COLORS.mute, marginTop: 2 },
  txAmt: { fontSize: 15, fontWeight: "600", color: COLORS.text },

  insightContainer: { marginTop: 16, gap: 12 },
  insightBox: { 
    flexDirection: "row", 
    alignItems: "flex-start", 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    overflow: 'hidden'
  },
  insightIcon: { 
    fontSize: 24, 
    marginRight: 12,
    flexShrink: 0
  },
  insightContent: { 
    flex: 1,
    marginTop: 0,
    marginBottom: 0
  },
  insightCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 20, marginHorizontal: 20, borderWidth: 1, borderColor: COLORS.border },
  insightHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  insightMeta: { marginLeft: 12 },
  insightTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text, marginBottom: 8 },
  insightDescription: { 
    fontSize: 14, 
    color: COLORS.mute, 
    lineHeight: 20,
    flexWrap: 'wrap'
  },
  insightActions: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 12 
  },
  whyButton: { 
    backgroundColor: COLORS.orange, 
    borderRadius: 10, 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 8,
    alignSelf: 'flex-start',
    flexShrink: 0
  },
  whyButtonText: { color: COLORS.card, fontSize: 14, fontWeight: "600" },

  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyIcon: { fontSize: 50, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text, marginBottom: 5 },
  emptySubtitle: { fontSize: 14, color: COLORS.mute, textAlign: "center", paddingHorizontal: 20 },

  upcomingList: { marginTop: 12, paddingHorizontal: 0, overflow: 'hidden' },
  upcomingItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 16 },
  upcomingItemDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  upcomingLeft: { flexDirection: "row", alignItems: "center", flex: 1, marginRight: 12 },
  upcomingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.blue, marginRight: 10 },
  upcomingInfo: { flex: 1 },
  upcomingTitle: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  upcomingMeta: { fontSize: 12, color: COLORS.mute, marginTop: 2 },
  upcomingRight: { alignItems: "flex-end", flexShrink: 0, minWidth: 80 },
  upcomingAmount: { fontSize: 15, fontWeight: "600", color: COLORS.text, textAlign: "right" },
  payNowButton: { backgroundColor: COLORS.blue, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12, marginTop: 8 },
  payNowText: { color: COLORS.card, fontSize: 14, fontWeight: "600" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  nextTransactionPreview: { backgroundColor: COLORS.bg, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginTop: 8 },
  nextTransactionText: { fontSize: 13, color: COLORS.mute, fontWeight: "600" },

  savingsPotsList: { marginTop: 12 },
  savingsPotItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  savingsPotLeft: { flexDirection: "row", alignItems: "center" },
  savingsPotIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  savingsPotIconText: { fontSize: 20, color: COLORS.blue },
  savingsPotInfo: { marginLeft: 12 },
  savingsPotName: { fontSize: 15, fontWeight: "600", color: COLORS.text },
  savingsPotProgress: { fontSize: 12, color: COLORS.mute, marginTop: 2 },
  savingsPotRight: { alignItems: "flex-end" },
  savingsPotPercentage: { fontSize: 14, fontWeight: "600", color: COLORS.blue },
  savingsPotDeadline: { fontSize: 12, color: COLORS.mute, marginTop: 2 },
  savingsPotPhoto: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", overflow: "hidden" },
  savingsPotPhotoImage: { width: "100%", height: "100%", borderRadius: 8 },

  chevronContainer: { width: 24, height: 24, justifyContent: "center", alignItems: "center" },
  chevron: { fontSize: 18, fontWeight: "600", color: COLORS.blue, lineHeight: 18 },

  savingsPotsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  addPotButton: { backgroundColor: COLORS.blue, borderRadius: 20, width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  addPotButtonText: { color: COLORS.card, fontSize: 24, fontWeight: "600" },

  emptySavingsPots: { alignItems: "center", paddingVertical: 40 },
  emptySavingsText: { fontSize: 16, color: COLORS.mute, marginBottom: 10 },
  createFirstPotButton: { backgroundColor: COLORS.blue, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 16 },
  createFirstPotButtonText: { color: COLORS.card, fontSize: 14, fontWeight: "600" },

  modalContainer: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  modalCancelButton: { color: COLORS.blue, fontSize: 16, fontWeight: "600" },
  modalTitle: { fontSize: 18, fontWeight: "600", color: COLORS.text, flex: 1, textAlign: "center" },
  modalSaveButton: { color: COLORS.blue, fontSize: 16, fontWeight: "600" },
  modalContent: { padding: 20 },
  formGroup: { marginBottom: 15 },
  formLabel: { fontSize: 14, color: COLORS.mute, marginBottom: 8 },
  formInput: { backgroundColor: COLORS.card, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.border, fontSize: 16, color: COLORS.text },

  photoSection: { marginTop: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, padding: 10, backgroundColor: COLORS.card },
  photoPreview: { position: "relative", width: "100%", height: 100, borderRadius: 8, overflow: "hidden" },
  photoImage: { width: "100%", height: "100%", borderRadius: 8 },
  removePhotoButton: { position: "absolute", top: 5, right: 5, backgroundColor: COLORS.red, borderRadius: 15, width: 30, height: 30, justifyContent: "center", alignItems: "center", zIndex: 1 },
  removePhotoText: { color: COLORS.card, fontSize: 18, fontWeight: "bold" },
  photoButtons: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginTop: 10 
  },
  photoButton: {
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  photoButtonText: {
    color: COLORS.card,
    fontSize: 14,
    fontWeight: "600",
  },

  trendsSkeleton: { paddingVertical: 10, paddingHorizontal: 16 },
  skeletonTrendsTitle: { height: 20, backgroundColor: COLORS.border, borderRadius: 8, marginBottom: 8 },
  skeletonTrendsSparkline: { height: 40, backgroundColor: COLORS.border, borderRadius: 8 },

  trendsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  trendsTitle: { fontSize: 16, fontWeight: "600", color: COLORS.text },
  trendsSubtitle: { fontSize: 12, color: COLORS.mute, marginTop: 4 },
  seeTrendsButton: { backgroundColor: COLORS.blue, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12 },
  seeTrendsText: { color: COLORS.card, fontSize: 14, fontWeight: "600" },

  trendsSparkline: { height: 40, backgroundColor: COLORS.card, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 10, paddingVertical: 5, marginTop: 8 },
  sparklineSvg: { width: "100%", height: "100%" },

  miniChartContainer: {
    position: 'relative',
    width: '100%',
    height: 100,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  chartWrapper: { width: 280, height: 74, overflow: 'hidden' },
  legend: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },

  connectBankButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  connectBankIcon: { fontSize: 20, marginRight: 8 },
  connectBankText: { color: COLORS.card, fontSize: 14, fontWeight: '600' },

});
