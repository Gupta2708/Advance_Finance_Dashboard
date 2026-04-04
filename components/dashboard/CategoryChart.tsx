"use client";

import { useEffect, useRef, useState } from "react";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { useStore } from "@/store/useStore";
import { getCategoryBreakdown } from "@/utils/calculations";
import { applyFilters } from "@/utils/filters";
import { formatCurrency } from "@/utils/formatters";

const COLORS = ["#1d4ed8", "#0f766e", "#dc2626", "#ea580c", "#64748b", "#8b5cf6", "#10b981", "#f59e0b"];

export function CategoryChart() {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const categoryData = getCategoryBreakdown(applyFilters(transactions, filters));
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
  const outerRadius = Math.max(72, Math.min(chartSize.width, chartSize.height) * 0.34);
  const innerRadius = Math.max(40, outerRadius * 0.55);

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/60 bg-[var(--card)] p-5 shadow-sm dark:border-slate-700/50">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Expense Breakdown</h2>
        <p className="text-xs uppercase tracking-wider text-[var(--muted-foreground)]">By category</p>
      </div>
      <div ref={containerRef} className="h-72 min-h-[18rem] min-w-0 w-full">
        {canRenderChart ? (
          <PieChart width={chartSize.width} height={chartSize.height}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              paddingAngle={2}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${entry.category}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
          </PieChart>
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
        )}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        {categoryData.slice(0, 6).map((item, index) => (
          <div key={item.category} className="flex items-center gap-2 text-[var(--muted-foreground)]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{item.category}</span>
            <span className="ml-auto font-medium text-[var(--foreground)]">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
