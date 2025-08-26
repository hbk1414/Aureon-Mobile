"use client"

import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { GlassmorphismCard } from "../components/GlassmorphismCard"
import { visionProColors } from "../../App"

export default function TransactionsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const transactions = [
    {
      id: 1,
      title: "Starbucks Coffee",
      category: "Food & Dining",
      amount: -5.67,
      date: "Today, 2:30 PM",
      icon: "cafe",
      color: [visionProColors.green, visionProColors.yellow],
      roundUp: 0.33,
    },
    {
      id: 2,
      title: "Uber Ride",
      category: "Transportation",
      amount: -12.34,
      date: "Yesterday, 6:45 PM",
      icon: "car",
      color: [visionProColors.primary, visionProColors.lightBlue],
      roundUp: 0.66,
    },
    {
      id: 3,
      title: "Salary Deposit",
      category: "Income",
      amount: 3500.0,
      date: "Dec 1, 9:00 AM",
      icon: "business",
      color: [visionProColors.purple, visionProColors.violet],
    },
    {
      id: 4,
      title: "Netflix Subscription",
      category: "Entertainment",
      amount: -15.99,
      date: "Nov 30, 12:00 PM",
      icon: "tv",
      color: [visionProColors.red, visionProColors.orange],
    },
    {
      id: 5,
      title: "Grocery Store",
      category: "Food & Dining",
      amount: -87.45,
      date: "Nov 29, 4:20 PM",
      icon: "basket",
      color: [visionProColors.green, visionProColors.yellow],
      roundUp: 0.55,
    },
  ]

  const filters = [
    { key: "all", label: "All", icon: "list" },
    { key: "income", label: "Income", icon: "trending-up" },
    { key: "expenses", label: "Expenses", icon: "trending-down" },
    { key: "food", label: "Food", icon: "restaurant" },
    { key: "transport", label: "Transport", icon: "car" },
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "income") return transaction.amount > 0
    if (selectedFilter === "expenses") return transaction.amount < 0
    if (selectedFilter === "food") return transaction.category === "Food & Dining"
    if (selectedFilter === "transport") return transaction.category === "Transportation"
    return true
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <GlassmorphismCard style={styles.searchCard}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search transactions..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </GlassmorphismCard>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            onPress={() => setSelectedFilter(filter.key)}
            style={[styles.filterTab, selectedFilter === filter.key && styles.activeFilterTab]}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={selectedFilter === filter.key ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
            />
            <Text style={[styles.filterTabText, selectedFilter === filter.key && styles.activeFilterTabText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.transactionsList}>
        {filteredTransactions.map((transaction) => (
          <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
            <GlassmorphismCard style={styles.transactionCard}>
              <View style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <LinearGradient colors={transaction.color} style={styles.transactionIcon}>
                    <Ionicons name={transaction.icon as any} size={20} color="#FFFFFF" />
                  </LinearGradient>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                  </View>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.amount > 0 ? styles.positiveAmount : styles.negativeAmount,
                    ]}
                  >
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </Text>
                  {transaction.roundUp && (
                    <View style={styles.roundUpBadge}>
                      <Ionicons name="arrow-up-circle" size={12} color={visionProColors.green} />
                      <Text style={styles.roundUpText}>+${transaction.roundUp.toFixed(2)}</Text>
                    </View>
                  )}
                </View>
              </View>
            </GlassmorphismCard>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient colors={[visionProColors.primary, visionProColors.lightBlue]} style={styles.fabGradient}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchCard: {
    paddingVertical: 4,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 12,
    paddingVertical: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  activeFilterTab: {
    backgroundColor: `${visionProColors.primary}40`,
    borderWidth: 1,
    borderColor: `${visionProColors.primary}60`,
  },
  filterTabText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 6,
    fontWeight: "500",
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  transactionItem: {
    marginBottom: 12,
  },
  transactionCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  transactionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  positiveAmount: {
    color: visionProColors.green,
  },
  negativeAmount: {
    color: "#FFFFFF",
  },
  roundUpBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${visionProColors.green}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roundUpText: {
    fontSize: 10,
    color: visionProColors.green,
    fontWeight: "600",
    marginLeft: 2,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
})
