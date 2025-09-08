import { Txn } from './forecast';

export function generateMicroInsights(txns: Txn[]) {
  const out: string[] = [];
  const now = new Date();

  // Unused subscriptions (no usage transactions in 60 days)
  const subs = txns.filter(t => t.is_subscription);
  for (const s of subs) {
    const lastHit = txns
      .filter(t => t.merchant === s.merchant && t.amount < 0 && !t.is_subscription)
      .sort((a,b)=>+new Date(b.date)-+new Date(a.date))[0];
    const days = lastHit ? Math.round((+now - +new Date(lastHit.date))/864e5) : 999;
    if (days > 60) out.push(`You haven't used ${s.merchant} in ${days} days — consider pausing.`);
  }

  // Round-up potential (simple)
  const cardTx = txns.filter(t => t.amount < 0);
  const roundable = cardTx.reduce((s,t)=> s + (1 - (Math.abs(t.amount) % 1)), 0);
  if (roundable > 10) out.push(`Round-ups could add ~£${roundable.toFixed(2)} this month.`);

  // Weekend vs weekday spend
  const wd = cardTx.filter(t => [0,6].includes(new Date(t.date).getDay())).reduce((s,t)=>s+Math.abs(t.amount),0);
  const we = cardTx.filter(t => ![0,6].includes(new Date(t.date).getDay())).reduce((s,t)=>s+Math.abs(t.amount),0);
  if (we && wd > we * 1.5) out.push(`Weekend spend is ${Math.round((wd/we)*100)}% of weekdays — plan ahead to avoid overspend.`);

  return out.slice(0, 3);
}