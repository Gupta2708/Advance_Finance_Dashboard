"use client";

import clsx from "clsx";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getInsights } from "@/utils/calculations";
import { applyFilters } from "@/utils/filters";
import { formatCurrency, formatPercent } from "@/utils/formatters";

export function InsightsPanel() {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const insights = getInsights(applyFilters(transactions, filters));

  const isIncrease = insights.monthlyExpenseDeltaPct >= 0;

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-[var(--card)] p-5 shadow-sm dark:border-slate-700/50">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Smart Insights</h2>
        <span
          className={clsx(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            isIncrease
              ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
          )}
        >
          {isIncrease ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(insights.monthlyExpenseDeltaPct)}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[var(--accent-soft)] p-3">
          <p className="text-xs text-[var(--muted-foreground)]">Highest Spending Category</p>
          <p className="mt-1 text-base font-semibold">
            {insights.highestSpendingCategory}
            <span className="ml-2 text-sm font-medium text-[var(--muted-foreground)]">
              ({formatCurrency(insights.highestSpendingAmount)})
            </span>
          </p>
        </div>

        <div className="rounded-xl bg-[var(--accent-soft)] p-3">
          <p className="text-xs text-[var(--muted-foreground)]">Net Savings</p>
          <p className="mt-1 text-base font-semibold">{formatCurrency(insights.netSavings)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-[var(--muted-foreground)]">This Month Expenses</p>
          <p className="mt-1 text-base font-semibold">{formatCurrency(insights.thisMonthExpenses)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p className="text-xs text-[var(--muted-foreground)]">Last Month Expenses</p>
          <p className="mt-1 text-base font-semibold">{formatCurrency(insights.lastMonthExpenses)}</p>
        </div>
      </div>

      <p className="mt-4 rounded-xl border border-dashed border-slate-300 p-3 text-sm text-[var(--muted-foreground)] dark:border-slate-700">
        {insights.message}
      </p>
    </section>
  );
}
