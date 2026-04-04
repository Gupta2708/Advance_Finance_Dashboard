import type { Transaction } from "@/types/finance";

export const formatCurrency = (value: number, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const formatMonth = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });

export const formatPercent = (value: number) =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const toInputDate = (value: string) =>
  new Date(value).toISOString().slice(0, 10);

export const getSignedAmount = (transaction: Transaction) =>
  transaction.type === "expense" ? -transaction.amount : transaction.amount;
