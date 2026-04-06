"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { useStore } from "@/store/useStore";
import { getDescriptionBreakdown } from "@/utils/calculations";
import { applyFilters } from "@/utils/filters";
import { formatCurrency } from "@/utils/formatters";

export function DescriptionBreakdownChart() {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const filteredTransactions = applyFilters(transactions, filters);
  const descriptionData = getDescriptionBreakdown(filteredTransactions);
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

  const chartData = useMemo(
    () =>
      descriptionData.slice(0, 6).map((item) => ({
        ...item,
        label: item.description.length > 18 ? `${item.description.slice(0, 18)}...` : item.description,
      })),
    [descriptionData],
  );

  const canRenderChart = chartSize.width > 0 && chartSize.height > 0 && chartData.length > 0;
  const topPattern = descriptionData[0];

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/60 bg-[var(--card)] p-5 shadow-sm dark:border-slate-700/50">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Description Breakdown</h2>
          <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
            Repetitive spend or earnings patterns
          </p>
        </div>
        {topPattern ? (
          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]">
            Top repeat: {topPattern.description} ({topPattern.occurrences}x)
          </span>
        ) : null}
      </div>

      <div ref={containerRef} className="h-72 min-h-[18rem] min-w-0 w-full">
        {canRenderChart ? (
          <BarChart width={chartSize.width} height={chartSize.height} data={chartData} barCategoryGap={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(value) => formatCurrency(Number(value ?? 0))}
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => {
                const numericValue = Number(value ?? 0);
                const seriesName = String(name ?? "");
                if (seriesName.toLowerCase() === "occurrences") {
                  return [`${numericValue}x`, "Count"];
                }
                return [formatCurrency(numericValue), seriesName];
              }}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.description ?? "Pattern"}
            />
            <Bar dataKey="expense" fill="#dc2626" radius={[8, 8, 0, 0]} name="Expense" />
            <Bar dataKey="income" fill="#16a34a" radius={[8, 8, 0, 0]} name="Income" />
          </BarChart>
        ) : (
          <div className="grid h-full place-items-center rounded-2xl border border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)]">
            No repeated patterns found for the selected filters.
          </div>
        )}
      </div>
    </section>
  );
}
