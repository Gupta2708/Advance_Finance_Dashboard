export type TransactionType = "income" | "expense";

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
