"use client";

import { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "@/store/useStore";
import { getTrendSeries } from "@/utils/calculations";
import { applyFilters } from "@/utils/filters";
import { formatCurrency } from "@/utils/formatters";

export function TrendChart() {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const trendData = getTrendSeries(applyFilters(transactions, filters));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const nextWidth = Math.floor(element.clientWidth);
      const nextHeight = Math.floor(element.clientHeight);

      setChartSize((current) => {
        if (current.width === nextWidth && current.height === nextHeight) {
          return current;
        }

        return { width: nextWidth, height: nextHeight };
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });

    observer.observe(element);
    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const canRenderChart = chartSize.width > 0 && chartSize.height > 0;

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/60 bg-[var(--card)] p-5 shadow-sm dark:border-slate-700/50">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Income vs Expense Trend</h2>
        <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">Monthly</p>
      </div>
      <div ref={containerRef} className="h-72 min-h-[18rem] min-w-0 w-full">
        {canRenderChart ? (
          <LineChart width={chartSize.width} height={chartSize.height} data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => formatCurrency(Number(value ?? 0))}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value ?? 0))}
              contentStyle={{ borderRadius: 12, border: "1px solid #d1d5db" }}
            />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#1d4ed8" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="balance" stroke="#0f766e" strokeWidth={2.5} dot={false} />
          </LineChart>
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
        )}
      </div>
    </section>
  );
}
