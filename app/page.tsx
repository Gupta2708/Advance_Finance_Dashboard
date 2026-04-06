"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Toaster } from "sonner";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { Navbar } from "@/components/shared/Navbar";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionFormModal } from "@/components/transactions/TransactionFormModal";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { useStore } from "@/store/useStore";

const TrendChart = dynamic(() => import("@/components/dashboard/TrendChart").then((mod) => mod.TrendChart), {
  ssr: false,
});

const CategoryChart = dynamic(() => import("@/components/dashboard/CategoryChart").then((mod) => mod.CategoryChart), {
  ssr: false,
});

const DescriptionBreakdownChart = dynamic(
  () => import("@/components/dashboard/DescriptionBreakdownChart").then((mod) => mod.DescriptionBreakdownChart),
  { ssr: false },
);

const PaymentMethodChart = dynamic(
  () => import("@/components/dashboard/PaymentMethodChart").then((mod) => mod.PaymentMethodChart),
  { ssr: false },
);

export default function Home() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex w-full max-w-[1820px] gap-5 px-4 py-5 md:px-6 xl:px-8">
        <AppSidebar />

        <div className="min-w-0 flex-1 overflow-hidden rounded-[34px] border border-[var(--border)] bg-[var(--shell)] shadow-[0_30px_80px_rgba(15,23,42,0.10)]">
          <Navbar />

          <main className="grid w-full gap-7 px-4 py-6 md:px-8 lg:px-10">
            <section id="overview" className="scroll-mt-28">
              <SummaryCards />
            </section>

            <motion.section
              id="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid scroll-mt-28 gap-6 xl:grid-cols-[1.55fr_0.95fr]"
            >
              <TrendChart />
              <CategoryChart />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="grid gap-6 xl:grid-cols-2"
            >
              <DescriptionBreakdownChart />
              <PaymentMethodChart />
            </motion.section>

            <section id="insights" className="scroll-mt-28">
              <InsightsPanel />
            </section>

            <section id="transactions" className="scroll-mt-28 space-y-4">
              <div>
                <h2 className="text-[2rem] font-semibold tracking-tight text-[var(--foreground-strong)]">Transactions</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Search, filter, and manage transaction history in real time.
                </p>
              </div>
              <TransactionFilters />
              <TransactionTable />
            </section>
          </main>
        </div>
      </div>

      <TransactionFormModal />
      <Toaster richColors position="top-right" />
    </div>
  );
}
