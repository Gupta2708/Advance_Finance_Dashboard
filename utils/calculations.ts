import type {
  CategoryBreakdownPoint,
  InsightSummary,
  SummaryStats,
  Transaction,
  TrendPoint,
} from "@/types/finance";
import { formatPercent } from "@/utils/formatters";

const getMonthKey = (date: string) => {
  const parsed = new Date(date);
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

const getMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
};

export const getSummaryStats = (transactions: Transaction[]): SummaryStats => {
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    totalBalance: totalIncome - totalExpenses,
    netSavings: totalIncome - totalExpenses,
  };
};

export const getTrendSeries = (transactions: Transaction[]): TrendPoint[] => {
  const map = new Map<string, { income: number; expense: number }>();

  transactions.forEach((transaction) => {
    const key = getMonthKey(transaction.date);
    const existing = map.get(key) ?? { income: 0, expense: 0 };

    if (transaction.type === "income") {
      existing.income += transaction.amount;
    } else {
      existing.expense += transaction.amount;
    }

    map.set(key, existing);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month: getMonthLabel(month),
      income: values.income,
      expense: values.expense,
      balance: values.income - values.expense,
    }));
};

export const getCategoryBreakdown = (
  transactions: Transaction[],
): CategoryBreakdownPoint[] => {
  const map = new Map<string, number>();

  transactions
    .filter((item) => item.type === "expense")
    .forEach((transaction) => {
      map.set(transaction.category, (map.get(transaction.category) ?? 0) + transaction.amount);
    });

  return Array.from(map.entries())
    .map(([category, value]) => ({
      category: category as CategoryBreakdownPoint["category"],
      value,
    }))
    .sort((a, b) => b.value - a.value);
};

export const getInsights = (transactions: Transaction[]): InsightSummary => {
  const stats = getSummaryStats(transactions);
  const expenseByCategory = getCategoryBreakdown(transactions);

  const highest = expenseByCategory[0];
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  const thisMonthExpenses = transactions
    .filter(
      (item) =>
        item.type === "expense" &&
        getMonthKey(item.date) === currentMonthKey,
    )
    .reduce((sum, item) => sum + item.amount, 0);

  const lastMonthExpenses = transactions
    .filter(
      (item) =>
        item.type === "expense" &&
        getMonthKey(item.date) === lastMonthKey,
    )
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpenseDeltaPct =
    lastMonthExpenses === 0
      ? 0
      : ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  const message = highest
    ? `You spent ${formatPercent(Math.abs(monthlyExpenseDeltaPct))} ${monthlyExpenseDeltaPct >= 0 ? "more" : "less"} on ${highest.category} this month.`
    : "Add transactions to unlock personalized insights.";

  return {
    highestSpendingCategory: highest?.category ?? "N/A",
    highestSpendingAmount: highest?.value ?? 0,
    thisMonthExpenses,
    lastMonthExpenses,
    monthlyExpenseDeltaPct,
    netSavings: stats.netSavings,
    message,
  };
};
