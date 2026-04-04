"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: ReactNode;
  accentClassName?: string;
}

export function StatCard({
  title,
  value,
  change,
  positive = true,
  icon,
  accentClassName = "from-sky-500 via-blue-500 to-cyan-400",
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
      <div className={clsx("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", accentClassName)} />
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--muted-foreground)]">{title}</span>
        <span className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">{icon}</span>
      </div>
      <p className="text-[2rem] font-semibold tracking-tight text-[var(--foreground-strong)]">{value}</p>
      {change ? (
        <p
          className={clsx(
            "mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold",
            positive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
          )}
        >
          {change}
        </p>
      ) : null}
    </div>
  );
}
