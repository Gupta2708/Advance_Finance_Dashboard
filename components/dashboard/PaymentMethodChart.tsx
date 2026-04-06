"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useStore } from "@/store/useStore";
import { getPaymentMethodBreakdown } from "@/utils/calculations";
import { applyFilters } from "@/utils/filters";
import { formatCurrency } from "@/utils/formatters";

export function PaymentMethodChart() {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const filteredTransactions = applyFilters(transactions, filters);
  const methodBreakdown = getPaymentMethodBreakdown(filteredTransactions);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const nextWidth = Math.floor(element.clientWidth);
      const nextHeight = Math.floor(element.clientHeight);
      setChartSize((current) =>
        current.width === nextWidth && current.height === nextHeight
          ? current
          : { width: nextWidth, height: nextHeight },
      );
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const chartData = useMemo(() => methodBreakdown, [methodBreakdown]);
  const canRenderChart = chartSize.width > 0 && chartSize.height > 0 && chartData.length > 0;

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/60 bg-[var(--card)] p-5 shadow-sm dark:border-slate-700/50">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Payment Method Analysis</h2>
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            UPI vs Card vs NetBanking mix
          </p>
        </div>
      </div>

      <div ref={containerRef} className="h-72 min-h-[18rem] min-w-0 w-full">
        {canRenderChart ? (
          <BarChart width={chartSize.width} height={chartSize.height} data={chartData} barCategoryGap={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="paymentMethod" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => formatCurrency(Number(value ?? 0))}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => [formatCurrency(Number(value ?? 0)), String(name ?? "")]}
              labelFormatter={(label, payload) => {
                const count = payload?.[0]?.payload?.transactionCount ?? 0;
                return `${label} (${count} transactions)`;
              }}
            />
            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} name="Expense" />
            <Bar dataKey="income" fill="#22c55e" radius={[8, 8, 0, 0]} name="Income" />
          </BarChart>
        ) : (
          <div className="grid h-full place-items-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)]">
            Add transactions to see payment method trends.
          </div>
        )}
      </div>
    </section>
  );
}
