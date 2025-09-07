import React, { useState, useMemo } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Dimensions, ScrollView, Alert } from "react-native";
import { useTransactions, useMerchantInsights, useSubscriptions, formatCurrency, formatDateTime, formatDate, type Transaction, type Subscription } from "../services/dataService";
import { TransactionListSkeleton } from "../components/SkeletonLoader";
import { NoTransactionsEmptyState, NoSearchResultsEmptyState, NoCategoryTransactionsEmptyState } from "../components/EmptyState";
import Svg, { G, Path, Line, Text as SvgText, Circle } from "react-native-svg";

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
};

const categories = ["All", "Food", "Transport", "Entertainment", "Shopping", "Utilities", "Income"];

export default function TransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTimeframe, setSelectedTimeframe] = useState<"1M" | "3M" | "6M" | "1Y">("1M");
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ date: string; amount: number; x: number; y: number } | null>(null);
  const [showSubscriptions, setShowSubscriptions] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const { transactions, loading, error } = useTransactions();
  const { merchantInsights, loading: insightsLoading } = useMerchantInsights();
  const { subscriptions, loading: subscriptionsLoading, error: subscriptionsError } = useSubscriptions();

  // Subscription handling functions
  const handlePauseSubscription = (subscription: Subscription) => {
    Alert.alert(
      "Pause Subscription",
      `Are you sure you want to pause ${subscription.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Pause", 
          style: "destructive",
          onPress: () => {
            // TODO: Implement pause logic
            console.log(`Pausing ${subscription.name}`);
          }
        }
      ]
    );
  };

  const handleCancelSubscription = (subscription: Subscription) => {
    Alert.alert(
      "Cancel Subscription",
      `Are you sure you want to cancel ${subscription.name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Cancel Subscription", 
          style: "destructive",
          onPress: () => {
            // TODO: Implement cancellation logic
            console.log(`Cancelling ${subscription.name}`);
          }
        }
      ]
    );
  };

  const getUsageColor = (frequency: string) => {
    switch (frequency) {
      case "daily": return COLORS.green;
      case "weekly": return COLORS.blue;
      case "monthly": return COLORS.orange;
      case "rarely": return COLORS.red;
      default: return COLORS.mute;
    }
  };

  const getUsageText = (frequency: string) => {
    switch (frequency) {
      case "daily": return "Used Daily";
      case "weekly": return "Used Weekly";
      case "monthly": return "Used Monthly";
      case "rarely": return "Rarely Used";
      default: return "Unknown";
    }
  };

  // Get unique merchants from transactions
  const uniqueMerchants = useMemo(() => {
    const merchants = new Set<string>();
    transactions.forEach(tx => {
      if (tx.merchant) merchants.add(tx.merchant);
    });
    return Array.from(merchants);
  }, [transactions]);

  // Check if search query matches a specific merchant
  const searchedMerchant = useMemo(() => {
    if (!searchQuery) return null;
    const query = searchQuery.toLowerCase();
    return uniqueMerchants.find(merchant => 
      merchant.toLowerCase().includes(query)
    ) || null;
  }, [searchQuery, uniqueMerchants]);

  // Calculate spending data for the searched merchant over different timeframes
  const merchantSpendingData = useMemo(() => {
    if (!searchedMerchant) return null;

    console.log('Processing data for merchant:', searchedMerchant);

    const now = new Date();
    const timeframes = {
      "1M": new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
      "3M": new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()),
      "6M": new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()),
      "1Y": new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    };

    const data: { [key: string]: { date: string; amount: number }[] } = {};
    
    Object.entries(timeframes).forEach(([period, startDate]) => {
      const periodTransactions = transactions.filter(tx => {
        // Only include transactions for the searched merchant
        if (tx.merchant !== searchedMerchant) return false;
        
        // Only include expenses (negative amounts)
        if (tx.amount >= 0) return false;
        
        // Parse the date and check if it's within the timeframe
        const txDate = new Date(tx.date);
        if (isNaN(txDate.getTime())) {
          console.warn('Invalid date for transaction:', tx);
          return false;
        }
        
        return txDate >= startDate;
      });

      console.log(`Period ${period}:`, {
        startDate: startDate.toISOString(),
        transactionsFound: periodTransactions.length,
        transactions: periodTransactions.map(t => ({ date: t.date, amount: t.amount }))
      });

      // Group by month for 1M, 3M, 6M and by quarter for 1Y
      const grouped = periodTransactions.reduce((acc, tx) => {
        const date = new Date(tx.date);
        let key: string;
        
        if (period === "1Y") {
          key = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
        } else {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }
        
        if (!acc[key]) acc[key] = 0;
        acc[key] += Math.abs(tx.amount);
        return acc;
      }, {} as { [key: string]: number });

      // Sort by date and convert to array
      data[period] = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, amount]) => ({ date, amount }));
    });

    console.log('Final processed data:', data);
    return data;
  }, [searchedMerchant, transactions]);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (tx.merchant && tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || tx.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <View style={styles.merchantLogoContainer}>
          <Text style={styles.merchantLogo}>{item.merchantLogo || "🏦"}</Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>{item.name}</Text>
          <Text style={styles.transactionMeta}>
            {formatDateTime(item.date, item.time)} • {item.category}
            {item.merchant && ` • ${item.merchant}`}
          </Text>
          {item.notes && (
            <Text style={styles.transactionNotes}>{item.notes}</Text>
          )}
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: item.amount > 0 ? COLORS.green : COLORS.text }]}>
          {item.amount > 0 ? '+' : ''}{formatCurrency(item.amount)}
        </Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
        {item.isSubscription && (
          <View style={styles.subscriptionBadge}>
            <Text style={styles.subscriptionText}>🔄</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderMerchantInsight = ({ item }: { item: any }) => (
    <View style={[
      styles.merchantCard,
      { 
        backgroundColor: item.trend === "increasing" ? COLORS.red + "15" : 
                       item.trend === "decreasing" ? COLORS.green + "15" : 
                       COLORS.blue + "15",
        borderColor: item.trend === "increasing" ? COLORS.red + "30" : 
                    item.trend === "decreasing" ? COLORS.green + "30" : 
                    COLORS.blue + "30"
      }
    ]}>
      {/* Trend indicator dot */}
      <View style={[
        styles.trendDot,
        { backgroundColor: item.trend === "increasing" ? COLORS.red : 
                         item.trend === "decreasing" ? COLORS.green : 
                         COLORS.blue }
      ]} />
      
      <View style={styles.merchantHeader}>
        <View style={styles.merchantLogoContainer}>
          <Text style={styles.merchantLogo}>{item.logo}</Text>
        </View>
        <View style={styles.merchantInfo}>
          <Text style={styles.merchantName}>{item.name}</Text>
          <Text style={styles.merchantCategory}>{item.category}</Text>
        </View>
        <View style={styles.merchantStats}>
          <Text style={styles.merchantAmount}>{formatCurrency(item.totalSpent)}</Text>
          <Text style={styles.merchantCount}>{item.transactionCount} transactions</Text>
        </View>
      </View>
      <View style={styles.merchantFooter}>
        <View style={[
          styles.trendBadge,
          { 
            backgroundColor: item.trend === "increasing" ? COLORS.red + "30" : 
                           item.trend === "decreasing" ? COLORS.green + "30" : 
                           COLORS.blue + "30",
            borderColor: item.trend === "increasing" ? COLORS.red : 
                        item.trend === "decreasing" ? COLORS.green : 
                        COLORS.blue
          }
        ]}>
          <Text style={[
            styles.trendText,
            { color: item.trend === "increasing" ? COLORS.red : 
                   item.trend === "decreasing" ? COLORS.green : 
                   COLORS.blue }
          ]}>
            {item.trend === "increasing" ? "↗️ Increasing" : 
             item.trend === "decreasing" ? "↘️ Decreasing" : "→ Stable"}
          </Text>
        </View>
        <Text style={styles.lastTransaction}>
          Last: {item.lastTransaction}
        </Text>
      </View>
    </View>
  );

  const renderSubscription = (subscription: Subscription) => (
    <View key={subscription.id} style={styles.subscriptionCard}>
      <View style={styles.subscriptionHeader}>
        <View style={styles.merchantInfo}>
          <Text style={styles.merchantLogo}>{subscription.merchantLogo}</Text>
          <View style={styles.subscriptionDetails}>
            <Text style={styles.subscriptionName}>{subscription.name}</Text>
            <Text style={styles.subscriptionCategory}>{subscription.category}</Text>
            <View style={styles.billingDateContainer}>
              <Text style={styles.billingDateLabel}>Next billing:</Text>
              <Text style={styles.billingDateValue}>{formatDate(subscription.nextBilling)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.amountInfo}>
          <Text style={styles.amount}>{formatCurrency(subscription.amount)}</Text>
          <Text style={styles.recurrence}>/{subscription.recurrence}</Text>
        </View>
      </View>

      <View style={styles.subscriptionBody}>
        <View style={styles.actions}>
          {subscription.canPause && (
            <TouchableOpacity
              style={[styles.actionButton, styles.pauseButton]}
              onPress={() => handlePauseSubscription(subscription)}
            >
              <Text style={styles.pauseButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
          {subscription.canCancel && (
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelSubscription(subscription)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const MerchantTrendsChart = () => {
    if (!searchedMerchant) return null;

    let currentData = merchantSpendingData?.[selectedTimeframe];
    
    // If no real data, show sample data for testing
    if (!currentData || currentData.length === 0) {
      console.log('No real data found, showing sample data for:', searchedMerchant);
      currentData = [
        { date: "2024-01", amount: 67.99 },
        { date: "2023-12", amount: 135.49 },
        { date: "2023-11", amount: 89.50 },
        { date: "2023-10", amount: 156.25 }
      ];
    }

    // Additional safety check
    if (!currentData || currentData.length === 0) {
      return (
        <View style={styles.trendsChartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Spending at {searchedMerchant}</Text>
            <Text style={styles.chartSubtitle}>No data available</Text>
          </View>
        </View>
      );
    }

    // Debug logging
    console.log('Chart rendering:', {
      searchedMerchant,
      selectedTimeframe,
      currentData,
      dataLength: currentData.length,
      isSampleData: !merchantSpendingData?.[selectedTimeframe] || merchantSpendingData[selectedTimeframe].length === 0
    });

    const chartWidth = Dimensions.get('window').width - 80;
    const chartHeight = 200;
    const padding = 40;

    // Calculate chart scales
    const maxAmount = currentData && currentData.length > 0 ? Math.max(...currentData.map(d => d.amount)) : 0;
    const minAmount = 0;
    const amountRange = maxAmount - minAmount;

    const valueToY = (value: number) => {
      return chartHeight - padding - ((value - minAmount) / amountRange) * (chartHeight - 2 * padding);
    };

    const indexToX = (index: number) => {
      if (!currentData || currentData.length === 0) return padding;
      return padding + (index / (currentData.length - 1)) * (chartWidth - 2 * padding);
    };

    // Generate line path
    const linePath = currentData && currentData.length > 0 ? currentData.map((item, index) => {
      const x = indexToX(index);
      const y = valueToY(item.amount);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') : '';

    return (
      <View style={styles.trendsChartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Spending at {searchedMerchant}</Text>
          <Text style={styles.chartSubtitle}>Amount spent over time</Text>
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframeSelector}>
          {(["1M", "3M", "6M", "1Y"] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.timeframeButton,
                selectedTimeframe === period && styles.timeframeButtonActive
              ]}
              onPress={() => {
                setSelectedTimeframe(period);
                setSelectedDataPoint(null); // Clear selection when changing timeframe
              }}
            >
              <Text style={[
                styles.timeframeButtonText,
                selectedTimeframe === period && styles.timeframeButtonTextActive
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          {(!merchantSpendingData?.[selectedTimeframe] || merchantSpendingData[selectedTimeframe].length === 0) && (
            <View style={styles.sampleDataNotice}>
              <Text style={styles.sampleDataText}>📊 Sample data shown for demonstration</Text>
            </View>
          )}
          
          {/* Tooltip for selected data point */}
          {selectedDataPoint && (
            <View style={[
              styles.tooltip,
              {
                left: Math.max(20, Math.min(selectedDataPoint.x - 50, chartWidth - 100)),
                top: Math.max(20, selectedDataPoint.y - 60)
              }
            ]}>
              <Text style={styles.tooltipDate}>
                {selectedDataPoint.date.includes('Q') 
                  ? selectedDataPoint.date 
                  : `${selectedDataPoint.date.split('-')[0]}-${selectedDataPoint.date.split('-')[1]}`
                }
              </Text>
              <Text style={styles.tooltipAmount}>
                {formatCurrency(selectedDataPoint.amount)}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.chartTouchArea}
            activeOpacity={1}
            onPress={() => setSelectedDataPoint(null)}
          >
            <Svg width={chartWidth} height={chartHeight}>
            <G>
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = chartHeight - padding - ratio * (chartHeight - 2 * padding);
                const value = ratio * maxAmount;
                return (
                  <G key={index}>
                    <Line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke={COLORS.border}
                      strokeWidth={1}
                      strokeOpacity={0.3}
                    />
                    <SvgText
                      x={padding - 10}
                      y={y + 4}
                      fontSize="10"
                      fill={COLORS.mute}
                      textAnchor="end"
                    >
                      £{Math.round(value / 10) * 10}
                    </SvgText>
                  </G>
                );
              })}

              {/* Data points and labels */}
              {currentData.map((item, index) => {
                const x = indexToX(index);
                const y = valueToY(item.amount);
                return (
                  <G key={index}>
                    {/* Touchable area for the data point */}
                    <Circle
                      cx={x}
                      cy={y}
                      r={8}
                      fill="transparent"
                      onPress={() => setSelectedDataPoint({ 
                        date: item.date, 
                        amount: item.amount, 
                        x: x, 
                        y: y 
                      })}
                    />
                    {/* Visible data point */}
                    <Circle
                      cx={x}
                      cy={y}
                      r={4}
                      fill={COLORS.blue}
                    />
                    <SvgText
                      x={x}
                      y={chartHeight - 10}
                      fontSize="10"
                      fill={COLORS.mute}
                      textAnchor="middle"
                    >
                      {item.date.includes('Q') ? item.date : item.date.split('-')[1]}
                    </SvgText>
                  </G>
                );
              })}

              {/* Line */}
              <Path
                d={linePath}
                stroke={COLORS.blue}
                strokeWidth={3}
                fill="none"
              />
            </G>
          </Svg>
          </TouchableOpacity>
        </View>

        {/* Summary Stats */}
        <View style={styles.chartStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>
              {formatCurrency(currentData.reduce((sum, d) => sum + d.amount, 0))}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Average</Text>
            <Text style={styles.statValue}>
              {formatCurrency(currentData.reduce((sum, d) => sum + d.amount, 0) / currentData.length)}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Transactions</Text>
            <Text style={styles.statValue}>
              {transactions.filter(tx => 
                tx.merchant === searchedMerchant && 
                tx.amount < 0
              ).length}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "#FF9500",
      Transport: "#30D158",
      Entertainment: "#AF52DE",
      Shopping: "#5856D6",
      Utilities: "#FF3B30",
      Income: "#007AFF",
    };
    return colors[category] || "#6B7280";
  };

  const handleAddTransaction = () => {
    // TODO: Navigate to add transaction screen
    console.log("Add transaction");
  };

  if (loading) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Your financial activity</Text>
        </View>
        <TransactionListSkeleton />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Your financial activity</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to Load</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    );
  }

  if (!transactions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Your financial activity</Text>
        </View>
        <NoTransactionsEmptyState onAddTransaction={handleAddTransaction} />
      </SafeAreaView>
    );
  }

  if (searchQuery && !filteredTransactions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Your financial activity</Text>
        </View>
      <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.mute}
            />
          </View>
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedCategory === item && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === item && styles.filterChipTextActive
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.filtersList}
          />
      </View>
        <NoSearchResultsEmptyState searchQuery={searchQuery} />
      </SafeAreaView>
    );
  }

  if (selectedCategory !== "All" && !filteredTransactions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Your financial activity</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.mute}
          />
        </View>
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
          <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedCategory === item && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === item && styles.filterChipTextActive
                ]}>
                  {item}
            </Text>
          </TouchableOpacity>
            )}
            contentContainerStyle={styles.filtersList}
          />
        </View>
        <NoCategoryTransactionsEmptyState category={selectedCategory} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Transactions</Text>
          <Text style={styles.subtitle}>Your financial activity</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by merchant, transaction, or category..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={COLORS.mute}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery('')}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
                  </View>
                </View>

        {/* Merchant Trends Chart */}
        <MerchantTrendsChart />
        
        {/* Category Filters */}
        <View style={styles.filtersContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                    style={[
                  styles.filterChip,
                  selectedCategory === item && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === item && styles.filterChipTextActive
                ]}>
                  {item}
                  </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.filtersList}
          />
                </View>

        {/* Merchant Insights */}
        {!insightsLoading && merchantInsights.length > 0 && (
          <View style={styles.insightsContainer}>
            <Text style={styles.insightsTitle}>Top Merchants</Text>
            <Text style={styles.insightsSubtitle}>Your spending by merchant</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={merchantInsights.slice(0, 3)}
              keyExtractor={(item) => item.name}
              renderItem={renderMerchantInsight}
              contentContainerStyle={styles.insightsList}
            />
              </View>
        )}

        {/* Subscriptions Section */}
        <View style={styles.subscriptionsSection}>
          <TouchableOpacity
            style={styles.subscriptionsHeader}
            onPress={() => setShowSubscriptions(!showSubscriptions)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.subscriptionsTitle}>Subscriptions</Text>
              <Text style={styles.subscriptionsSubtitle}>
                {subscriptions.length} active • {formatCurrency(subscriptions.reduce((sum, sub) => sum + sub.amount, 0))}/month
              </Text>
            </View>
            <Text style={[
              styles.subscriptionsChevron,
              { transform: [{ rotate: showSubscriptions ? '90deg' : '0deg' }] }
            ]}>
              ›
            </Text>
      </TouchableOpacity>

          {/* Summary Cards */}
          <View style={styles.summaryCardsContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Monthly Cost</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(subscriptions.reduce((sum, sub) => sum + sub.amount, 0))}
              </Text>
              <Text style={styles.summarySubtext}>Total recurring</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Yearly Cost</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(subscriptions.reduce((sum, sub) => sum + sub.amount, 0) * 12)}
              </Text>
              <Text style={styles.summarySubtext}>Annual total</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Active</Text>
              <Text style={styles.summaryValue}>{subscriptions.length}</Text>
              <Text style={styles.summarySubtext}>Subscriptions</Text>
            </View>
          </View>

          {showSubscriptions && (
            <View style={styles.subscriptionsContent}>
              {subscriptionsLoading ? (
                <View style={styles.subscriptionsLoading}>
                  <Text style={styles.loadingText}>Loading subscriptions...</Text>
                </View>
              ) : subscriptions.length > 0 ? (
                <View style={styles.subscriptionsList}>
                  {subscriptions.map(renderSubscription)}
                </View>
              ) : (
                <View style={styles.subscriptionsEmpty}>
                  <Text style={styles.subscriptionsEmptyText}>No active subscriptions</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          <Text style={styles.transactionsSubtitle}>
            {filteredTransactions.length} transactions
          </Text>
          
          {loading ? (
            <TransactionListSkeleton />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Failed to Load</Text>
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          ) : filteredTransactions.length === 0 ? (
            searchQuery ? (
              <NoSearchResultsEmptyState searchQuery={searchQuery} />
            ) : selectedCategory !== "All" ? (
              <NoCategoryTransactionsEmptyState category={selectedCategory} />
            ) : (
              <NoTransactionsEmptyState />
            )
          ) : (
            <ScrollView 
              style={styles.transactionsFlatList}
              contentContainerStyle={styles.transactionsList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {filteredTransactions.map((item) => renderTransaction({ item }))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    marginBottom: 8, // Add space after header
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24, // Increase space after search
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 56,
    fontSize: 18,
    color: COLORS.text,
  },
  clearButton: {
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  clearButtonText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '700',
  },
  filtersContainer: {
    marginBottom: 24, // Increase space after filters
    paddingHorizontal: 20,
  },
  filtersList: {
    paddingHorizontal: 0, // Remove padding since container has it
    gap: 12, // Increase gap between filter chips
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10, // Increase vertical padding
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8, // Add margin between chips
  },
  filterChipActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  filterChipText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: COLORS.card,
    fontWeight: "600",
  },
  insightsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24, // Increase space after insights
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8, // Add space after title
  },
  insightsSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
    marginBottom: 20, // Increase space after subtitle
  },
  insightsList: {
    gap: 16, // Increase gap between merchant cards
  },
  merchantCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 200,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  merchantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  merchantLogoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card + "80",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  merchantLogo: {
    fontSize: 20,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  merchantCategory: {
    fontSize: 12,
    color: COLORS.mute,
  },
  merchantStats: {
    alignItems: "flex-end",
  },
  merchantAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  merchantCount: {
    fontSize: 10,
    color: COLORS.mute,
  },
  merchantFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  lastTransaction: {
    fontSize: 10,
    color: COLORS.mute,
  },
  transactionsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionLogo: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  transactionMeta: {
    fontSize: 13,
    color: COLORS.mute,
    marginBottom: 2,
  },
  transactionNotes: {
    fontSize: 12,
    color: COLORS.mute,
    fontStyle: "italic",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 4,
  },
  subscriptionBadge: {
    backgroundColor: COLORS.blue + "20",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  subscriptionText: {
    fontSize: 10,
    color: COLORS.blue,
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
  trendDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  trendsChartCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: COLORS.mute,
  },
  timeframeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeframeButtonActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  timeframeButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  timeframeButtonTextActive: {
    color: COLORS.card,
    fontWeight: "600",
  },
  chartContainer: {
    height: 200,
    marginBottom: 16,
  },
  chartStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  sampleDataNotice: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.blue + "10",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1,
  },
  sampleDataText: {
    fontSize: 12,
    color: COLORS.blue,
    fontWeight: '500',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    zIndex: 10,
  },
  tooltipDate: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 2,
  },
  tooltipAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  chartTouchArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  nextBilling: {
    fontSize: 12,
    color: COLORS.mute,
  },
  subscriptionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden', // Ensure content stays within card boundaries
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
    marginBottom: 12,
  },
  merchantInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Changed from 'center' to 'flex-start'
    flex: 1, // Take up available space
    marginRight: 12, // Add margin to prevent overlap
  },
  merchantLogo: {
    fontSize: 20,
    marginRight: 10,
  },
  subscriptionDetails: {
    flex: 1, // Take up remaining space
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  subscriptionCategory: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 4,
  },
  amountInfo: {
    alignItems: 'flex-end',
    flexShrink: 0, // Prevent shrinking
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  recurrence: {
    fontSize: 12,
    color: COLORS.mute,
  },
  subscriptionBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  usageInfo: {
    flex: 1,
  },
  lastUsed: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 4,
  },
  usageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  usageText: {
    fontSize: 10,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  pauseButton: {
    borderColor: COLORS.blue,
  },
  pauseButtonText: {
    color: COLORS.blue,
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    borderColor: COLORS.red,
  },
  cancelButtonText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionsSection: {
    marginTop: 8, // Add space from previous section
    marginBottom: 24, // Add space before transactions
    marginHorizontal: 20, // Add horizontal margins
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  subscriptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16, // Increase padding
    paddingHorizontal: 20, // Add horizontal padding
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subscriptionsTitle: {
    fontSize: 18, // Increase font size
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4, // Add space between title and subtitle
  },
  subscriptionsSubtitle: {
    fontSize: 14, // Increase font size
    color: COLORS.mute,
  },
  subscriptionsChevron: {
    fontSize: 24, // Increase size
    color: COLORS.mute,
    fontWeight: '600',
  },
  subscriptionsContent: {
    paddingVertical: 16, // Increase padding
  },
  subscriptionsLoading: {
    alignItems: 'center',
    paddingVertical: 24, // Increase padding
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.mute,
  },
  subscriptionsList: {
    paddingHorizontal: 20, // Add horizontal padding
    gap: 16, // Increase gap between subscription cards
  },
  subscriptionsEmpty: {
    alignItems: 'center',
    paddingVertical: 24, // Increase padding
  },
  subscriptionsEmptyText: {
    fontSize: 14,
    color: COLORS.mute,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    marginBottom: 24,
  },
  summaryCard: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.mute,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 10,
    color: COLORS.mute,
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 32, // Increase bottom padding
  },
  transactionsTitle: {
    fontSize: 20, // Increase font size
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8, // Add space after title
  },
  transactionsSubtitle: {
    fontSize: 16, // Increase font size
    color: COLORS.mute,
    marginBottom: 20, // Increase space after subtitle
  },
  transactionsFlatList: {
    maxHeight: 400, // Fixed height to make it scrollable
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  billingDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: COLORS.blue + '15', // Light blue background
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start', // Only take up needed space
  },
  billingDateLabel: {
    fontSize: 12,
    color: COLORS.blue, // Blue text to match background
    marginRight: 4,
    fontWeight: '500',
  },
  billingDateValue: {
    fontSize: 14,
    fontWeight: '700', // Make it bold
    color: COLORS.blue, // Blue text to match background
  },

});
