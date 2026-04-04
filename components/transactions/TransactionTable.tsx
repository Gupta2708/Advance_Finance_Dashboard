"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { EmptyState } from "@/components/shared/EmptyState";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { applyFilters } from "@/utils/filters";
import { toast } from "sonner";

export function TransactionTable() {
  const role = useStore((state) => state.role);
  const openModal = useStore((state) => state.openModal);
  const openDeleteDialog = useStore((state) => state.openDeleteDialog);
  const closeDeleteDialog = useStore((state) => state.closeDeleteDialog);
  const deleteTransaction = useStore((state) => state.deleteTransaction);
  const deletingId = useStore((state) => state.modal.deletingId);
  const transactions = useStore((state) => state.transactions);
  const filters = useStore((state) => state.filters);
  const filteredTransactions = applyFilters(transactions, filters);

  if (filteredTransactions.length === 0) {
    return (
      <EmptyState
        title="No transactions found"
        description="Try changing filters or add a new transaction to populate the dashboard."
        actionLabel={role === "admin" ? "Add transaction" : undefined}
        onAction={role === "admin" ? () => openModal("create") : undefined}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-[var(--card)] shadow-sm dark:border-slate-700/50">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                mode="table"
                isAdmin={role === "admin"}
                onEdit={(id) => openModal("edit", id)}
                onDelete={openDeleteDialog}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {filteredTransactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            mode="card"
            isAdmin={role === "admin"}
            onEdit={(id) => openModal("edit", id)}
            onDelete={openDeleteDialog}
          />
        ))}
      </div>

      <AnimatePresence>
        {deletingId ? (
          <motion.div
            className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
            >
              <h3 className="text-lg font-semibold">Delete transaction?</h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                This action cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeDeleteDialog}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteTransaction(deletingId);
                    toast.success("Transaction deleted");
                  }}
                  className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
