import { useMemo } from 'react';
import { useTransactions, useCurrentBalance, useUpcomingBills } from '../services/dataService';
import { Txn, Recurring } from '../ai/forecast';

export function useAffordabilityData() {
  const { transactions } = useTransactions();
  const { currentBalance } = useCurrentBalance();
  const { upcomingBills } = useUpcomingBills();

  const aiTransactions: Txn[] = useMemo(() => {
    if (!transactions) return [];
    
    return transactions.map(tx => ({
      id: tx.id,
      date: tx.date,
      amount: tx.amount,
      category: tx.category,
      merchant: tx.merchant,
      is_subscription: tx.isSubscription || false
    }));
  }, [transactions]);

  const recurrings: Recurring[] = useMemo(() => {
    if (!upcomingBills) return [];
    
    return upcomingBills
      .filter(bill => bill.isSubscription && bill.recurrence)
      .map(bill => {
        // Map recurrence strings to forecast cadence types
        let cadence: 'weekly' | 'monthly' | 'biweekly' | 'fourweekly' = 'monthly';
        
        if (bill.recurrence?.includes('weekly')) {
          cadence = 'weekly';
        } else if (bill.recurrence?.includes('biweekly') || bill.recurrence?.includes('bi-weekly')) {
          cadence = 'biweekly';
        } else if (bill.recurrence?.includes('fourweekly') || bill.recurrence?.includes('four-weekly')) {
          cadence = 'fourweekly';
        }

        return {
          label: bill.label,
          amount: -Math.abs(bill.amount), // Make sure bills are negative
          cadence,
          nextDate: bill.date
        };
      });
  }, [upcomingBills]);

  return {
    balance: currentBalance || 0,
    transactions: aiTransactions,
    recurrings,
    isReady: !!transactions && currentBalance !== null
  };
}