import { useState, useEffect } from "react";
import { trueLayerDataService } from "./truelayerDataService";

// Types
export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  time: string;
  merchant?: string;
  notes?: string;
  receiptPhoto?: string;
  isSubscription?: boolean;
  recurrence?: string;
  merchantLogo?: string;
}

export interface BudgetCategory {
  name: string;
  spent: number;
  limit: number;
  color: string;
  resetDay: number;
  rollover: boolean;
  alertThresholds: number[];
}

export interface UpcomingBill {
  id: string;
  label: string;
  date: string;
  amount: number;
  category: string;
  isSubscription: boolean;
  recurrence?: string;
  canPayNow?: boolean;
}

export interface AIInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  recommendation: string;
  icon: string;
  color: string;
  action?: {
    label: string;
    type: "navigate" | "modal" | "external";
    target: string;
  };
  why?: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  recurrence: "monthly" | "yearly" | "weekly";
  nextBilling: string;
  status: "active" | "paused" | "cancelled";
  canPause: boolean;
  canCancel: boolean;
  merchantLogo?: string;
  lastUsed?: string;
  usageFrequency?: "daily" | "weekly" | "monthly" | "rarely";
}

export interface SavingsPot {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  photo?: string;
  autoTransfer?: number;
  deadline?: string;
  category: "short-term" | "medium-term" | "long-term";
}

export interface AutoSaveRule {
  id: string;
  name: string;
  type: "roundup" | "payday-sweep" | "percentage" | "fixed-amount" | "spare-change";
  status: "active" | "paused" | "deleted";
  targetPot: string; // Savings pot ID
  amount?: number; // For fixed-amount rules
  percentage?: number; // For percentage rules (1-100)
  roundupThreshold?: number; // Minimum amount to trigger roundup
  paydayOffset?: number; // Days after payday to sweep (default: 1)
  conditions?: {
    minTransactionAmount?: number;
    maxTransactionAmount?: number;
    categories?: string[];
    merchants?: string[];
  };
  schedule?: {
    frequency: "every-transaction" | "daily" | "weekly" | "monthly";
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    time?: string; // HH:MM format
  };
  statistics: {
    totalSaved: number;
    transactionCount: number;
    lastExecuted?: string;
    nextExecution?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AutoSaveExecution {
  id: string;
  ruleId: string;
  amount: number;
  transactionId?: string; // For roundup/spare-change rules
  executedAt: string;
  status: "success" | "failed" | "pending";
  errorMessage?: string;
}

export interface CashFlowForecast {
  id: string;
  date: string;
  expectedIncome: number;
  expectedExpenses: number;
  netFlow: number;
  confidence: "high" | "medium" | "low";
  factors: string[];
}

export interface MerchantInsight {
  id: string;
  merchant: string;
  totalSpent: number;
  transactionCount: number;
  averageAmount: number;
  category: string;
  trend: "increasing" | "decreasing" | "stable";
  lastTransaction: string;
  recommendations: string[];
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  netIncome: number;
  savings: number;
  spendingCategories: {
    [category: string]: number;
  };
}

// Helper function to convert TrueLayer transaction to app format
const convertTrueLayerTransaction = (tlTransaction: any): Transaction => {
  const amount = Math.abs(tlTransaction.amount);
  const isIncome = tlTransaction.amount > 0;
  
  return {
    id: tlTransaction.transactionId || tlTransaction.id || Date.now().toString(),
    name: tlTransaction.description,
    amount: amount,
    category: tlTransaction.transactionCategory || tlTransaction.category || (isIncome ? 'Income' : 'Other'),
    date: new Date(tlTransaction.timestamp).toISOString().split('T')[0],
    time: new Date(tlTransaction.timestamp).toTimeString().split(' ')[0],
    merchant: tlTransaction.merchantName || tlTransaction.description,
    notes: tlTransaction.description,
  };
};

// Helper function to get current balance from TrueLayer accounts
const getCurrentBalance = (balances: any[]): number => {
  return balances.reduce((total, balance) => {
    return total + (balance.current || 0);
  }, 0);
};

// Mock data (fallback when TrueLayer is not connected)
const mockTransactions: Transaction[] = [
  {
    id: "1",
    name: "Tesco Superstore",
    amount: 45.67,
    category: "Food & Drink",
    date: "2024-01-15",
    time: "10:30:00",
    merchant: "Tesco",
  },
  {
    id: "2",
    name: "Starbucks Coffee",
    amount: 12.50,
    category: "Food & Drink",
    date: "2024-01-15",
    time: "08:15:00",
    merchant: "Starbucks",
  },
  {
    id: "3",
    name: "Salary Payment",
    amount: 2500.00,
    category: "Income",
    date: "2024-01-14",
    time: "09:00:00",
    merchant: "Employer Ltd",
  },
  {
    id: "4",
    name: "Amazon UK",
    amount: 89.99,
    category: "Shopping",
    date: "2024-01-13",
    time: "14:22:00",
    merchant: "Amazon",
  },
  {
    id: "5",
    name: "Uber Trip",
    amount: 23.45,
    category: "Transport",
    date: "2024-01-12",
    time: "19:30:00",
    merchant: "Uber",
  },
  {
    id: "6",
    name: "Netflix Subscription",
    amount: 15.99,
    category: "Entertainment",
    date: "2024-01-10",
    time: "00:00:00",
    merchant: "Netflix",
    isSubscription: true,
    recurrence: "monthly",
  },
  {
    id: "7",
    name: "Gym Membership",
    amount: 45.00,
    category: "Health & Fitness",
    date: "2024-01-08",
    time: "00:00:00",
    merchant: "PureGym",
    isSubscription: true,
    recurrence: "monthly",
  },
  {
    id: "8",
    name: "Electricity Bill",
    amount: 120.50,
    category: "Utilities",
    date: "2024-01-05",
    time: "00:00:00",
    merchant: "British Gas",
  },
];

const mockBudgetCategories: BudgetCategory[] = [
  {
    name: "Food & Drink",
    spent: 580.50,
    limit: 600.00,
    color: "#FF6B6B",
    resetDay: 1,
    rollover: false,
    alertThresholds: [80, 90, 100],
  },
  {
    name: "Transport",
    spent: 245.30,
    limit: 300.00,
    color: "#4ECDC4",
    resetDay: 1,
    rollover: false,
    alertThresholds: [80, 90, 100],
  },
  {
    name: "Shopping",
    spent: 320.75,
    limit: 400.00,
    color: "#45B7D1",
    resetDay: 1,
    rollover: false,
    alertThresholds: [80, 90, 100],
  },
  {
    name: "Entertainment",
    spent: 180.25,
    limit: 200.00,
    color: "#96CEB4",
    resetDay: 1,
    rollover: false,
    alertThresholds: [80, 90, 100],
  },
  {
    name: "Utilities",
    spent: 450.00,
    limit: 500.00,
    color: "#FFEAA7",
    resetDay: 1,
    rollover: false,
    alertThresholds: [80, 90, 100],
  },
];

const mockUpcomingBills: UpcomingBill[] = [
  {
    id: "1",
    label: "Rent Payment",
    date: "2024-01-25",
    amount: 1200.00,
    category: "Housing",
    isSubscription: true,
    recurrence: "monthly",
    canPayNow: true,
  },
  {
    id: "2",
    label: "Phone Bill",
    date: "2024-01-28",
    amount: 35.00,
    category: "Utilities",
    isSubscription: true,
    recurrence: "monthly",
    canPayNow: true,
  },
  {
    id: "3",
    label: "Car Insurance",
    date: "2024-02-01",
    amount: 180.00,
    category: "Insurance",
    isSubscription: true,
    recurrence: "monthly",
    canPayNow: false,
  },
];

const mockAIInsights: AIInsight[] = [
  {
    id: "1",
    type: "spending",
    title: "High Coffee Spending",
    description: "You've spent £45 on coffee this month, 50% more than usual.",
    impact: "medium",
    recommendation: "Consider making coffee at home to save £30/month",
    icon: "☕",
    color: "#FF6B6B",
    action: {
      label: "View Details",
      type: "navigate",
      target: "Transactions",
    },
    why: "Based on your spending patterns, coffee purchases are significantly higher than your 3-month average.",
  },
  {
    id: "2",
    type: "savings",
    title: "Savings Goal Ahead",
    description: "You're on track to reach your vacation fund goal by March.",
    impact: "high",
    recommendation: "Great job! Consider increasing your monthly contribution to reach it sooner.",
    icon: "🎯",
    color: "#4ECDC4",
    action: {
      label: "Adjust Goal",
      type: "modal",
      target: "SavingsGoal",
    },
  },
  {
    id: "3",
    type: "budget",
    title: "Food Budget Alert",
    description: "You've used 97% of your food budget with 5 days remaining.",
    impact: "high",
    recommendation: "Reduce dining out this week to stay within budget.",
    icon: "⚠️",
    color: "#FFA500",
    action: {
      label: "View Budget",
      type: "navigate",
      target: "Budgets",
    },
  },
];

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    amount: 15.99,
    category: "Entertainment",
    recurrence: "monthly",
    nextBilling: "2024-02-10",
    status: "active",
    canPause: true,
    canCancel: true,
    merchantLogo: "https://logo.clearbit.com/netflix.com",
    lastUsed: "2024-01-15",
    usageFrequency: "daily",
  },
  {
    id: "2",
    name: "Spotify Premium",
    amount: 9.99,
    category: "Entertainment",
    recurrence: "monthly",
    nextBilling: "2024-02-05",
    status: "active",
    canPause: true,
    canCancel: true,
    merchantLogo: "https://logo.clearbit.com/spotify.com",
    lastUsed: "2024-01-14",
    usageFrequency: "daily",
  },
  {
    id: "3",
    name: "Gym Membership",
    amount: 45.00,
    category: "Health & Fitness",
    recurrence: "monthly",
    nextBilling: "2024-02-08",
    status: "active",
    canPause: true,
    canCancel: true,
    merchantLogo: "https://logo.clearbit.com/puregym.com",
    lastUsed: "2024-01-12",
    usageFrequency: "weekly",
  },
];

const mockSavingsPots: SavingsPot[] = [
  {
    id: "1",
    name: "Vacation Fund",
    target: 2000,
    current: 1250,
    icon: "🏖️",
    color: "#FF6B6B",
    category: "short-term",
    autoTransfer: 200,
  },
  {
    id: "2",
    name: "Emergency Fund",
    target: 5000,
    current: 3200,
    icon: "🛡️",
    color: "#4ECDC4",
    category: "short-term",
    autoTransfer: 300,
  },
  {
    id: "3",
    name: "New Car",
    target: 15000,
    current: 4500,
    icon: "🚗",
    color: "#45B7D1",
    category: "long-term",
    autoTransfer: 500,
  },
];

const mockAutoSaveRules: AutoSaveRule[] = [
  {
    id: "1",
    name: "Round-up Coffee",
    type: "roundup",
    status: "active",
    targetPot: "1", // Vacation Fund
    roundupThreshold: 1.00,
    conditions: {
      categories: ["Food", "Coffee"],
      minTransactionAmount: 1.00,
      maxTransactionAmount: 50.00
    },
    schedule: {
      frequency: "every-transaction"
    },
    statistics: {
      totalSaved: 45.75,
      transactionCount: 23,
      lastExecuted: "2024-01-15",
      nextExecution: "2024-01-16"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Payday Sweep",
    type: "payday-sweep",
    status: "active",
    targetPot: "2", // Emergency Fund
    paydayOffset: 1,
    conditions: {
      minTransactionAmount: 100.00
    },
    schedule: {
      frequency: "monthly",
      dayOfMonth: 26 // Assuming payday is 25th
    },
    statistics: {
      totalSaved: 1200.00,
      transactionCount: 3,
      lastExecuted: "2024-01-26",
      nextExecution: "2024-02-26"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-26"
  },
  {
    id: "3",
    name: "10% Salary Save",
    type: "percentage",
    status: "active",
    targetPot: "3", // New Car
    percentage: 10,
    conditions: {
      categories: ["Salary", "Income"]
    },
    schedule: {
      frequency: "every-transaction"
    },
    statistics: {
      totalSaved: 280.00,
      transactionCount: 1,
      lastExecuted: "2024-01-25",
      nextExecution: "2024-02-25"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-25"
  },
  {
    id: "4",
    name: "Spare Change Saver",
    type: "spare-change",
    status: "paused",
    targetPot: "1", // Vacation Fund
    conditions: {
      minTransactionAmount: 5.00
    },
    schedule: {
      frequency: "every-transaction"
    },
    statistics: {
      totalSaved: 12.50,
      transactionCount: 8,
      lastExecuted: "2024-01-10",
      nextExecution: "2024-01-16"
    },
    createdAt: "2024-01-05",
    updatedAt: "2024-01-12"
  }
];

const mockCashFlowForecast: CashFlowForecast[] = [
  {
    id: "1",
    date: "2024-01-20",
    expectedIncome: 2500,
    expectedExpenses: 1800,
    netFlow: 700,
    confidence: "high",
    factors: ["Regular salary", "Known bills", "Historical spending"]
  },
  {
    id: "2",
    date: "2024-01-27",
    expectedIncome: 0,
    expectedExpenses: 1200,
    netFlow: -1200,
    confidence: "medium",
    factors: ["Rent due", "Variable spending"]
  },
  {
    id: "3",
    date: "2024-02-03",
    expectedIncome: 2500,
    expectedExpenses: 1600,
    netFlow: 900,
    confidence: "high",
    factors: ["Salary", "Lower bills"]
  }
];

const mockMerchantInsights: MerchantInsight[] = [
  {
    id: "1",
    merchant: "Tesco",
    totalSpent: 580.50,
    transactionCount: 12,
    averageAmount: 48.38,
    category: "Food & Drink",
    trend: "stable",
    lastTransaction: "2024-01-15",
    recommendations: ["Consider bulk buying", "Use loyalty card", "Shop during sales"]
  },
  {
    id: "2",
    merchant: "Starbucks",
    totalSpent: 125.00,
    transactionCount: 10,
    averageAmount: 12.50,
    category: "Food & Drink",
    trend: "increasing",
    lastTransaction: "2024-01-15",
    recommendations: ["Make coffee at home", "Use reusable cup", "Consider alternatives"]
  },
  {
    id: "3",
    merchant: "Amazon",
    totalSpent: 450.75,
    transactionCount: 8,
    averageAmount: 56.34,
    category: "Shopping",
    trend: "decreasing",
    lastTransaction: "2024-01-13",
    recommendations: ["Use price tracking", "Wait for sales", "Compare prices"]
  }
];

const mockMonthlyTrends: MonthlyTrendData[] = [
  {
    month: "2023-10",
    income: 5000,
    expenses: 3200,
    netIncome: 1800,
    savings: 1500,
    spendingCategories: {
      "Food & Drink": 600,
      "Transport": 300,
      "Shopping": 400,
      "Entertainment": 200,
      "Utilities": 500,
      "Housing": 1200
    }
  },
  {
    month: "2023-11",
    income: 5000,
    expenses: 3400,
    netIncome: 1600,
    savings: 1400,
    spendingCategories: {
      "Food & Drink": 650,
      "Transport": 320,
      "Shopping": 450,
      "Entertainment": 180,
      "Utilities": 520,
      "Housing": 1200
    }
  },
  {
    month: "2023-12",
    income: 5500,
    expenses: 3800,
    netIncome: 1700,
    savings: 1600,
    spendingCategories: {
      "Food & Drink": 700,
      "Transport": 350,
      "Shopping": 600,
      "Entertainment": 250,
      "Utilities": 500,
      "Housing": 1200
    }
  },
  {
    month: "2024-01",
    income: 5000,
    expenses: 2800,
    netIncome: 2200,
    savings: 2000,
    spendingCategories: {
      "Food & Drink": 580,
      "Transport": 245,
      "Shopping": 320,
      "Entertainment": 180,
      "Utilities": 450,
      "Housing": 1200
    }
  }
];

// Enhanced hooks with TrueLayer integration
export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        // Use our working TrueLayer data service
        const accounts = await trueLayerDataService.getAccounts();
        
        if (accounts.length > 0) {
          // Get all transactions from the first account
          const tlTransactions = await trueLayerDataService.getTransactions();
          const convertedTransactions = tlTransactions.map(convertTrueLayerTransaction);
          setTransactions(convertedTransactions);
          console.log(`[DataService] Loaded ${convertedTransactions.length} real transactions from TrueLayer`);
        } else {
          throw new Error('No accounts available');
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions - please connect your bank account");
        setTransactions([]); // No fallback to mock data as requested
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, loading, error };
};

export const useBudgetCategories = () => {
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgetCategories = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setBudgetCategories(mockBudgetCategories);
        setError(null);
      } catch (err) {
        setError("Failed to load budget categories");
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetCategories();
  }, []);

  return { budgetCategories, loading, error };
};

export const useUpcomingBills = () => {
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingBills = async () => {
      try {
        setLoading(true);
        
        // Get real transactions from TrueLayer
        const tlTransactions = await trueLayerDataService.getTransactions();
        
        // Find recurring transactions to predict upcoming bills
        const recurringTransactions = tlTransactions.filter(tx => 
          tx.transaction_type === 'DEBIT' && 
          (tx.transaction_category === 'BILLS' || 
           tx.transaction_category === 'SUBSCRIPTIONS' ||
           tx.description.toLowerCase().includes('subscription') ||
           tx.description.toLowerCase().includes('bill') ||
           tx.description.toLowerCase().includes('monthly'))
        ).slice(0, 5); // Take top 5 for upcoming bills
        
        const bills: UpcomingBill[] = recurringTransactions.map((tx, index) => {
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + (7 + index * 3)); // Spread over next few weeks
          
          return {
            id: tx.transaction_id + '_upcoming',
            label: tx.description,
            date: nextDate.toISOString().split('T')[0],
            amount: Math.abs(tx.amount),
            category: tx.transaction_category || 'Bills',
            isSubscription: tx.description.toLowerCase().includes('subscription'),
            recurrence: 'monthly',
            canPayNow: true,
          };
        });
        
        setUpcomingBills(bills);
        console.log(`[DataService] Generated ${bills.length} upcoming bills from real transaction data`);
        setError(null);
      } catch (err) {
        console.error("Error generating upcoming bills:", err);
        setError("Failed to load upcoming bills - please connect your bank account");
        setUpcomingBills([]); // No fallback to mock data as requested
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingBills();
  }, []);

  return { upcomingBills, loading, error };
};

export const useAIInsights = () => {
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAIInsights = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAIInsights(mockAIInsights);
        setError(null);
      } catch (err) {
        setError("Failed to load AI insights");
      } finally {
        setLoading(false);
      }
    };

    fetchAIInsights();
  }, []);

  return { aiInsights, loading, error };
};

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 700));
        setSubscriptions(mockSubscriptions);
        setError(null);
      } catch (err) {
        setError("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return { subscriptions, loading, error };
};

export const useSavingsPots = () => {
  const [savingsPots, setSavingsPots] = useState<SavingsPot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavingsPots = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setSavingsPots(mockSavingsPots);
        setError(null);
      } catch (err) {
        setError("Failed to load savings pots");
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsPots();
  }, []);

  return { savingsPots, loading, error };
};

export const useCashFlowForecast = () => {
  const [cashFlowForecast, setCashFlowForecast] = useState<CashFlowForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCashFlowForecast = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 900));
        setCashFlowForecast(mockCashFlowForecast);
        setError(null);
      } catch (err) {
        setError("Failed to load cash flow forecast");
      } finally {
        setLoading(false);
      }
    };

    fetchCashFlowForecast();
  }, []);

  return { cashFlowForecast, loading, error };
};

export const useMerchantInsights = () => {
  const [merchantInsights, setMerchantInsights] = useState<MerchantInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchantInsights = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setMerchantInsights(mockMerchantInsights);
        setError(null);
      } catch (err) {
        setError("Failed to load merchant insights");
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantInsights();
  }, []);

  return { merchantInsights, loading, error };
};

export const useMonthlyTrends = () => {
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyTrends = async () => {
      try {
        setLoading(true);
        
        // Get real transactions from TrueLayer
        const tlTransactions = await trueLayerDataService.getTransactions();
        
        // Group transactions by month and calculate trends
        const monthlyData: { [key: string]: { income: number; expenses: number; transactions: any[] } } = {};
        
        tlTransactions.forEach(tx => {
          const date = new Date(tx.timestamp);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleString('default', { month: 'short' });
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0, transactions: [] };
          }
          
          if (tx.transaction_type === 'CREDIT') {
            monthlyData[monthKey].income += Math.abs(tx.amount);
          } else {
            monthlyData[monthKey].expenses += Math.abs(tx.amount);
          }
          monthlyData[monthKey].transactions.push(tx);
        });
        
        // Convert to trend data format
        const trends: MonthlyTrendData[] = Object.entries(monthlyData)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(-6) // Last 6 months
          .map(([monthKey, data]) => {
            const [year, month] = monthKey.split('-');
            const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
            
            return {
              month: monthName,
              income: Math.round(data.income),
              expenses: Math.round(data.expenses),
              netIncome: Math.round(data.income - data.expenses),
              savings: Math.round(Math.max(0, data.income - data.expenses)),
              spendingCategories: data.transactions
                .filter(tx => tx.transaction_type === 'DEBIT')
                .reduce((acc: any, tx: any) => {
                  const category = tx.transaction_category || 'Other';
                  acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
                  return acc;
                }, {})
            };
          });
        
        setMonthlyTrends(trends);
        console.log(`[DataService] Calculated monthly trends for ${trends.length} months from real transaction data`);
        setError(null);
      } catch (err) {
        console.error("Error calculating monthly trends:", err);
        setError("Failed to load monthly trends - please connect your bank account");
        setMonthlyTrends([]); // No fallback to mock data as requested
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyTrends();
  }, []);

  return { monthlyTrends, loading, error };
};

export const useAutoSaveRules = () => {
  const [autoSaveRules, setAutoSaveRules] = useState<AutoSaveRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAutoSaveRules = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        setAutoSaveRules(mockAutoSaveRules);
        setError(null);
      } catch (err) {
        setError("Failed to load autosave rules");
      } finally {
        setLoading(false);
      }
    };

    fetchAutoSaveRules();
  }, []);

  return { autoSaveRules, loading, error };
};

// Enhanced current balance hook with TrueLayer integration
export const useCurrentBalance = () => {
  const [balance, setBalance] = useState(8750);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setLoading(true);
        
        // Check if TrueLayer is connected
        if (trueLayerService.isAuthenticated()) {
          const accounts = await trueLayerService.getAccounts();
          const currentBalance = getCurrentBalance(accounts);
          setBalance(currentBalance);
        } else {
          // Use mock balance if not connected
          setBalance(8750);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Failed to load balance");
        // Fallback to mock balance
        setBalance(8750);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  return { balance, loading, error };
};

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};
