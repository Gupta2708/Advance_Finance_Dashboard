export type TransactionType = "income" | "expense";

export const PAYMENT_METHODS = ["UPI", "Card", "NetBanking", "Wallet", "Cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Salary",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
] as const;

export type TransactionCategory = (typeof CATEGORIES)[number];

export type UserRole = "viewer" | "admin";

export type SortField = "date" | "amount";
export type SortOrder = "asc" | "desc";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface FilterState {
  search: string;
  typeFilter: "all" | TransactionType;
  categoryFilter: "all" | TransactionCategory;
  sortField: SortField;
  sortOrder: SortOrder;
}

export interface SummaryStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
}

export interface InsightSummary {
  highestSpendingCategory: TransactionCategory | "N/A";
  highestSpendingAmount: number;
  thisMonthExpenses: number;
  lastMonthExpenses: number;
  monthlyExpenseDeltaPct: number;
  netSavings: number;
  message: string;
}

export interface TrendPoint {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryBreakdownPoint {
  category: TransactionCategory;
  value: number;
}

export interface DescriptionBreakdownPoint {
  description: string;
  normalizedKey: string;
  occurrences: number;
  income: number;
  expense: number;
  total: number;
}

export interface PaymentMethodBreakdownPoint {
  paymentMethod: PaymentMethod;
  income: number;
  expense: number;
  total: number;
  transactionCount: number;
}
