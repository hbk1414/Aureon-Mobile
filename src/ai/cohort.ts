export type CategorySpend = { category: string; thisMonth: number; lastMonth?: number };

export type CohortStats = {
  category: string;
  median: number;          // peers median £
  p75: number;             // 75th percentile £
};

export function compareToCohort(my: CategorySpend[], cohort: CohortStats[]) {
  const insights: { title: string; body: string }[] = [];

  for (const c of my) {
    const peer = cohort.find(p => p.category === c.category);
    if (!peer) continue;

    const diff = c.thisMonth - peer.median;
    const pct = peer.median ? (diff / peer.median) * 100 : 0;

    // surface only material deviations
    if (pct > 15 && c.thisMonth > 40) {
      insights.push({
        title: `${c.category}: +${pct.toFixed(0)}% vs peers`,
        body: `Reducing £${Math.round(diff/2)} this month (e.g., one fewer order/week) could save ~£${Math.round(diff/2)}.`
      });
    }

    // growth vs last month
    if (c.lastMonth && c.thisMonth > c.lastMonth * 1.25 && c.thisMonth > 60) {
      insights.push({
        title: `${c.category} trending up`,
        body: `Up from £${Math.round(c.lastMonth)} → £${Math.round(c.thisMonth)}. Consider a soft cap of £${Math.round(c.thisMonth*0.9)} next month.`
      });
    }
  }

  // keep the top 2–3
  return insights.slice(0, 3);
}