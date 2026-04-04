"use client";

import { SelectMenu } from "@/components/shared/SelectMenu";
import type { TransactionCategory, TransactionType } from "@/types/finance";
import { CATEGORIES } from "@/types/finance";
import { useStore } from "@/store/useStore";

export function TransactionFilters() {
  const filters = useStore((state) => state.filters);
  const setTypeFilter = useStore((state) => state.setTypeFilter);
  const setCategoryFilter = useStore((state) => state.setCategoryFilter);
  const setSort = useStore((state) => state.setSort);

  return (
    <div className="grid gap-4 rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="px-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Type</span>
        <SelectMenu<"all" | TransactionType>
          value={filters.typeFilter}
          onChange={setTypeFilter}
          ariaLabel="Filter by type"
          options={[
            { label: "All", value: "all" },
            { label: "Income", value: "income" },
            { label: "Expense", value: "expense" },
          ]}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="px-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Category</span>
        <SelectMenu<"all" | TransactionCategory>
          value={filters.categoryFilter}
          onChange={setCategoryFilter}
          ariaLabel="Filter by category"
          options={[
            { label: "All categories", value: "all" },
            ...CATEGORIES.map((category) => ({ label: category, value: category })),
          ]}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="px-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Sort</span>
        <SelectMenu<`${"date" | "amount"}:${"asc" | "desc"}`>
          value={`${filters.sortField}:${filters.sortOrder}`}
          onChange={(value) => {
            const [field, order] = value.split(":");
            setSort(field as "date" | "amount", order as "asc" | "desc");
          }}
          ariaLabel="Sort transactions"
          options={[
            { label: "Date (Newest first)", value: "date:desc" },
            { label: "Date (Oldest first)", value: "date:asc" },
            { label: "Amount (High to low)", value: "amount:desc" },
            { label: "Amount (Low to high)", value: "amount:asc" },
          ]}
        />
      </label>
    </div>
  );
}
