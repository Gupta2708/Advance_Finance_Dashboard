"use client";

import { Bell, Download, Plus, Search, Sparkles } from "lucide-react";
import { RoleSwitcher } from "@/components/shared/RoleSwitcher";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useStore } from "@/store/useStore";
import { applyFilters } from "@/utils/filters";
import { exportTransactionsAsCsv, exportTransactionsAsJson } from "@/utils/exporters";
import { toast } from "sonner";

export function Navbar() {
  const role = useStore((state) => state.role);
  const filters = useStore((state) => state.filters);
  const transactions = useStore((state) => state.transactions);
  const setSearch = useStore((state) => state.setSearch);
  const openModal = useStore((state) => state.openModal);
  const filteredTransactions = applyFilters(transactions, filters);
  const profileLabel = "Employee";

  const handleExportCsv = () => {
    exportTransactionsAsCsv(filteredTransactions);
    toast.success("Filtered transactions exported as CSV");
  };

  const handleExportJson = () => {
    exportTransactionsAsJson(filteredTransactions);
    toast.success("Filtered transactions exported as JSON");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/86 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-8 md:py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center gap-3">
              <h1 className="text-[clamp(1.8rem,2.6vw,2.5rem)] font-semibold leading-none tracking-tight text-[var(--foreground-strong)]">
                Welcome, {profileLabel}
              </h1>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Sparkles size={17} />
              </span>
            </div>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted-foreground)]">
              Track balances, scan your latest activity, and jump between insights without losing context.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap xl:justify-end">
            <button
              type="button"
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-[var(--surface-strong)] hover:bg-[var(--surface-hover)]"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[var(--surface)]" />
            </button>
            <RoleSwitcher />
            <ThemeToggle />
            <div className="flex h-11 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),#8b5cf6)] text-sm font-bold text-white shadow-sm">
                {profileLabel
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-bold tracking-tight text-[var(--foreground-strong)]">
                  {profileLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-[820px] xl:flex-1">
            <Search size={18} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              value={filters.search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by merchant, description, or category"
              className="h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-14 pr-5 text-[15px] text-[var(--foreground)] shadow-[0_12px_30px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--foreground)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-[var(--surface-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground-strong)]"
            >
              <Download size={16} /> CSV
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--foreground)] shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:border-[var(--surface-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground-strong)]"
            >
              <Download size={16} /> JSON
            </button>
            {role === "admin" ? (
              <button
                type="button"
                onClick={() => openModal("create")}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,var(--accent),#3659dc)] px-5 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(37,99,235,0.32)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <Plus size={16} /> Add Transaction
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
