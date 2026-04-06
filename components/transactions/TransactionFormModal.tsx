"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/store/useStore";
import { CATEGORIES, PAYMENT_METHODS } from "@/types/finance";
import type { PaymentMethod, Transaction, TransactionCategory, TransactionType } from "@/types/finance";
import { toInputDate } from "@/utils/formatters";

interface FormValues {
  date: string;
  description: string;
  merchant: string;
  amount: string;
  category: TransactionCategory;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  note: string;
}

const defaultValues: FormValues = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  merchant: "",
  amount: "",
  category: "Food",
  type: "expense",
  paymentMethod: "UPI",
  note: "",
};

const toFormValues = (transaction?: Transaction): FormValues => {
  if (!transaction) return defaultValues;
  return {
    date: toInputDate(transaction.date),
    description: transaction.description,
    merchant: transaction.merchant,
    amount: String(transaction.amount),
    category: transaction.category,
    type: transaction.type,
    paymentMethod: transaction.paymentMethod ?? "UPI",
    note: transaction.note ?? "",
  };
};

function TransactionFormBody({
  initial,
  editingId,
  onClose,
}: {
  initial: FormValues;
  editingId: string | null;
  onClose: () => void;
}) {
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const [values, setValues] = useState<FormValues>(initial);
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!values.description || !values.merchant || !values.amount || !values.date) {
      setError("All required fields must be filled.");
      return;
    }

    const parsedAmount = Number(values.amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    const payload = {
      date: values.date,
      description: values.description,
      merchant: values.merchant,
      amount: parsedAmount,
      category: values.category,
      type: values.type,
      paymentMethod: values.paymentMethod,
      note: values.note,
    };

    if (editingId) {
      updateTransaction(editingId, payload);
      toast.success("Transaction updated");
    } else {
      addTransaction(payload);
      toast.success("Transaction added");
    }

    onClose();
  };

  return (
    <motion.form
      onSubmit={submit}
      className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--foreground)] shadow-xl"
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 8, opacity: 0 }}
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{editingId ? "Edit" : "Add"} transaction</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--foreground)]"
        >
          Close
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Description
          <input
            required
            value={values.description}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, description: event.target.value }))
            }
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Merchant
          <input
            required
            value={values.merchant}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, merchant: event.target.value }))
            }
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Date
          <input
            type="date"
            required
            value={values.date}
            onChange={(event) => setValues((prev) => ({ ...prev, date: event.target.value }))}
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Amount
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={values.amount}
            onChange={(event) => setValues((prev) => ({ ...prev, amount: event.target.value }))}
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Type
          <select
            value={values.type}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, type: event.target.value as TransactionType }))
            }
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Category
          <select
            value={values.category}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, category: event.target.value as TransactionCategory }))
            }
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Payment Method
          <select
            value={values.paymentMethod}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, paymentMethod: event.target.value as PaymentMethod }))
            }
            className="h-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          >
            {PAYMENT_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          Note (optional)
          <textarea
            rows={3}
            value={values.note}
            onChange={(event) => setValues((prev) => ({ ...prev, note: event.target.value }))}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
          />
        </label>
      </div>

      {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--foreground)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          {editingId ? "Save changes" : "Add transaction"}
        </button>
      </div>
    </motion.form>
  );
}

export function TransactionFormModal() {
  const isOpen = useStore((state) => state.modal.isFormOpen);
  const editingId = useStore((state) => state.modal.editingId);
  const closeModal = useStore((state) => state.closeModal);
  const transactions = useStore((state) => state.transactions);

  const editingTransaction = useMemo(
    () => transactions.find((item) => item.id === editingId),
    [editingId, transactions],
  );

  const formInitial = useMemo(() => toFormValues(editingTransaction), [editingTransaction]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/45 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <TransactionFormBody
            key={editingId ?? "create"}
            initial={formInitial}
            editingId={editingId}
            onClose={closeModal}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
