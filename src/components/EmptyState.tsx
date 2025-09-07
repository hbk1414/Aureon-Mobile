import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const COLORS = {
  bg: "#F7F8FB",
  text: "#0F172A",
  mute: "#6B7280",
  blue: "#007AFF",
  border: "#EAECEF",
};

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  showAction?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  showAction = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {showAction && actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Specific empty states
export const NoTransactionsEmptyState: React.FC<{ onAddTransaction?: () => void }> = ({ 
  onAddTransaction 
}) => (
  <EmptyState
    icon="📊"
    title="No Transactions Yet"
    subtitle="Your financial activity will appear here once you start making transactions."
    actionLabel="Add Transaction"
    onAction={onAddTransaction}
    showAction={!!onAddTransaction}
  />
);

export const NoUpcomingBillsEmptyState: React.FC = () => (
  <EmptyState
    icon="📅"
    title="No Upcoming Bills"
    subtitle="Great job! You have no bills due in the next 7-10 days."
  />
);

export const NoBudgetCategoriesEmptyState: React.FC<{ onSetupBudget?: () => void }> = ({ 
  onSetupBudget 
}) => (
  <EmptyState
    icon="🎯"
    title="No Budget Categories"
    subtitle="Set up budget categories to start tracking your spending and stay on track with your financial goals."
    actionLabel="Setup Budget"
    onAction={onSetupBudget}
    showAction={!!onSetupBudget}
  />
);

export const NoAIInsightsEmptyState: React.FC = () => (
  <EmptyState
    icon="🤖"
    title="No AI Insights Yet"
    subtitle="AI insights will appear here as we analyze your spending patterns and financial behavior."
  />
);

export const NoConnectedAccountsEmptyState: React.FC<{ onConnectAccount?: () => void }> = ({ 
  onConnectAccount 
}) => (
  <EmptyState
    icon="🏦"
    title="No Connected Accounts"
    subtitle="Connect your bank accounts and credit cards to automatically sync your financial data."
    actionLabel="Connect Account"
    onAction={onConnectAccount}
    showAction={!!onConnectAccount}
  />
);

export const NoSavingsGoalsEmptyState: React.FC<{ onCreateGoal?: () => void }> = ({ 
  onCreateGoal 
}) => (
  <EmptyState
    icon="💰"
    title="No Savings Goals"
    subtitle="Create savings goals to track your progress and stay motivated to save money."
    actionLabel="Create Goal"
    onAction={onCreateGoal}
    showAction={!!onCreateGoal}
  />
);

export const NoSearchResultsEmptyState: React.FC<{ searchQuery: string }> = ({ 
  searchQuery 
}) => (
  <EmptyState
    icon="🔍"
    title="No Results Found"
    subtitle={`No transactions found for "${searchQuery}". Try adjusting your search terms or filters.`}
  />
);

export const NoCategoryTransactionsEmptyState: React.FC<{ category: string }> = ({ 
  category 
}) => (
  <EmptyState
    icon="📁"
    title={`No ${category} Transactions`}
    subtitle={`You haven't made any ${category.toLowerCase()} transactions yet.`}
  />
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: COLORS.bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mute,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
