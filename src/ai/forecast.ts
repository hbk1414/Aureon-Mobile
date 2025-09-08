// Types
export type Txn = {
  id: string;
  date: string;            // ISO
  amount: number;          // negatives = spend, positives = income
  category: string;
  merchant?: string;
  is_subscription?: boolean;
};

export type Recurring = {
  label: string;
  amount: number;          // negative for bills, positive for income
  cadence: 'weekly' | 'monthly' | 'biweekly' | 'fourweekly';
  nextDate: string;        // next expected ISO date
};

const DAYS_IN_MONTH = (d = new Date()) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

function daysLeftInMonth(today = new Date()) {
  return DAYS_IN_MONTH(today) - today.getDate();
}

export function endOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

// Simple cadence projector
function projectUntilMonthEnd(rec: Recurring, today = new Date()): number {
  let total = 0;
  let dt = new Date(rec.nextDate);
  const end = endOfMonth(today).getTime();
  const stepDays = rec.cadence === 'weekly' ? 7
                 : rec.cadence === 'biweekly' ? 14
                 : rec.cadence === 'fourweekly' ? 28
                 : 30; // monthly-ish

  while (dt.getTime() <= end) {
    total += rec.amount;
    dt = new Date(dt.getTime() + stepDays * 24 * 3600 * 1000);
  }
  return total;
}

export function rollingDailyBurn(txns: Txn[], today = new Date()) {
  // past 30d variable spend/day (exclude known recurring + transfers)
  const cutoff = new Date(today.getTime() - 30 * 24 * 3600 * 1000);
  const variable = txns.filter(t =>
    new Date(t.date) >= cutoff && t.amount < 0 && !t.is_subscription
  );
  const sum = variable.reduce((s, t) => s + Math.abs(t.amount), 0);
  return sum / 30;
}

export function energyBar({
  balance,
  txns,
  recurrings,
  today = new Date()
}: {
  balance: number;
  txns: Txn[];
  recurrings: Recurring[];
  today?: Date;
}) {
  const daysLeft = daysLeftInMonth(today);
  const variablePerDay = rollingDailyBurn(txns, today);
  const variableToMonthEnd = -(variablePerDay * daysLeft); // negative spend
  const committed = recurrings.reduce((s, r) => s + projectUntilMonthEnd(r, today), 0);

  // Projected end-of-month balance
  const projectedEOM = balance + committed + variableToMonthEnd;

  // "safe to spend" until month end
  // we treat committed+expected variable as a buffer
  const safeToSpend = Math.max(0, balance - Math.abs(committed + variableToMonthEnd));

  const risk: Array<'low_income' | 'heavy_bills' | 'overspend_trend'> = [];
  if (committed < 0 && Math.abs(committed) > balance * 0.6) risk.push('heavy_bills');
  const last7 = txns.filter(t => (new Date().getTime() - new Date(t.date).getTime()) < 7*864e5 && t.amount < 0);
  const prev7 = txns.filter(t => (new Date().getTime() - new Date(t.date).getTime()) < 14*864e5 && (new Date().getTime() - new Date(t.date).getTime()) >= 7*864e5 && t.amount < 0);
  const last7Spend = last7.reduce((s,t)=>s+Math.abs(t.amount),0);
  const prev7Spend = prev7.reduce((s,t)=>s+Math.abs(t.amount),0);
  if (prev7Spend > 0 && last7Spend > prev7Spend * 1.25) risk.push('overspend_trend');

  return { safeToSpend, projectedEOM, committed, variableToMonthEnd, daysLeft, risk };
}