"use client";

import clsx from "clsx";
import { Edit3, Trash2 } from "lucide-react";
import type { Transaction } from "@/types/finance";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface TransactionRowProps {
  transaction: Transaction;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  mode?: "table" | "card";
}

export function TransactionRow({
  transaction,
  isAdmin,
  onEdit,
  onDelete,
  mode = "table",
}: TransactionRowProps) {
  const signedAmount = transaction.type === "expense" ? -transaction.amount : transaction.amount;

  if (mode === "table") {
    return (
      <tr className="border-t border-slate-100 text-sm dark:border-slate-800">
        <td className="px-4 py-3 text-[var(--muted-foreground)]">{formatDate(transaction.date)}</td>
        <td className="px-4 py-3">
          <p className="font-medium">{transaction.description}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{transaction.merchant}</p>
        </td>
        <td className="px-4 py-3 text-[var(--muted-foreground)]">{transaction.category}</td>
        <td className="px-4 py-3 text-[var(--muted-foreground)]">{transaction.paymentMethod ?? "UPI"}</td>
        <td className="px-4 py-3">
          <span
            className={clsx(
              "rounded-full px-2 py-1 text-xs font-medium",
              transaction.type === "income"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
            )}
          >
            {transaction.type}
          </span>
        </td>
        <td
          className={clsx(
            "px-4 py-3 font-semibold",
            transaction.type === "income" ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {signedAmount > 0 ? "+" : "-"}
          {formatCurrency(Math.abs(signedAmount))}
        </td>
        <td className="px-4 py-3 text-right">
          {isAdmin ? (
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onEdit(transaction.id)}
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                aria-label={`Edit ${transaction.description}`}
              >
                <Edit3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(transaction.id)}
                className="rounded-lg border border-slate-200 p-2 text-rose-500 transition hover:bg-rose-50 dark:border-slate-700 dark:hover:bg-rose-500/10"
                aria-label={`Delete ${transaction.description}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <span className="text-xs text-[var(--muted-foreground)]">View only</span>
          )}
        </td>
      </tr>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--foreground)] shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{transaction.description}</p>
          <p className="text-xs text-[var(--muted-foreground)]">{transaction.merchant}</p>
        </div>
        <p
          className={clsx(
            "text-sm font-semibold",
            transaction.type === "income" ? "text-emerald-600" : "text-rose-600",
          )}
        >
          {signedAmount > 0 ? "+" : "-"}
          {formatCurrency(Math.abs(signedAmount))}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>{formatDate(transaction.date)}</span>
        <span>{transaction.category}</span>
        <span>{transaction.paymentMethod ?? "UPI"}</span>
      </div>
      <div className="mt-2 text-xs text-[var(--muted-foreground)]">
        <span className="capitalize">{transaction.type}</span>
      </div>
      {isAdmin ? (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(transaction.id)}
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction.id)}
            className="flex-1 rounded-lg border border-rose-200 px-3 py-2 text-sm text-rose-600 dark:border-rose-600/40"
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}
