import { energyBar, Txn, Recurring } from './forecast';

export type WishItem = { label: string; price: number; when?: 'now'|'midmonth'|'monthend' };

export function canIAffordIt({
  balance, txns, recurrings, items, minBuffer = 100
}: {
  balance: number;
  txns: Txn[];
  recurrings: Recurring[];
  items: WishItem[];
  minBuffer?: number;  // user-configurable cushion
}) {
  const base = energyBar({ balance, txns, recurrings });
  const total = items.reduce((s,i)=>s+i.price,0);

  const after = energyBar({
    balance: balance - total,        // assume spend now
    txns,
    recurrings
  });

  const bufferAfter = after.projectedEOM;
  let verdict: 'green'|'amber'|'red' =
    bufferAfter > minBuffer ? 'green' : (bufferAfter > 0 ? 'amber' : 'red');

  const suggestions: string[] = [];
  if (verdict !== 'green') {
    // try delaying to month-end
    const delayed = energyBar({ balance, txns, recurrings });
    const delayedEOM = delayed.projectedEOM - total;
    if (delayedEOM > bufferAfter + 50) suggestions.push('Delay purchase to month-end');
    // try split across two months
    if (total > 150) suggestions.push('Split into two payments');
    // suggest pot
    suggestions.push('Create a pot and autosave weekly');
  }

  return {
    before: base,
    after,
    total,
    verdict,
    suggestions
  };
}