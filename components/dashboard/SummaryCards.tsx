"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, PiggyBank, Wallet } from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { useStore } from "@/store/useStore";
import { getSummaryStats } from "@/utils/calculations";
import { applyFilters } from "@/utils/filters";
import { formatCurrency } from "@/utils/formatters";

export function SummaryCards() {
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const stats = getSummaryStats(applyFilters(transactions, filters));

  const cards = [
    {
      title: "Total Balance",
      value: formatCurrency(stats.totalBalance),
      icon: <Wallet size={16} />,
      change: stats.totalBalance >= 0 ? "Positive cash flow" : "Deficit",
      positive: stats.totalBalance >= 0,
      accentClassName: "from-violet-500 via-fuchsia-500 to-purple-400",
    },
    {
      title: "Total Income",
      value: formatCurrency(stats.totalIncome),
      icon: <ArrowUpRight size={16} />,
      change: "In selected range",
      positive: true,
      accentClassName: "from-orange-400 via-amber-400 to-yellow-300",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(stats.totalExpenses),
      icon: <ArrowDownLeft size={16} />,
      change: "In selected range",
      positive: false,
      accentClassName: "from-sky-400 via-cyan-400 to-blue-300",
    },
    {
      title: "Net Savings",
      value: formatCurrency(stats.netSavings),
      icon: <PiggyBank size={16} />,
      change: stats.netSavings >= 0 ? "On track" : "Needs attention",
      positive: stats.netSavings >= 0,
      accentClassName: "from-emerald-400 via-green-400 to-lime-300",
    },
  ];

  return (
    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.35 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </section>
  );
}
