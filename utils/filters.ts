import type {
  FilterState,
  SortField,
  SortOrder,
  Transaction,
  TransactionCategory,
  TransactionType,
} from "@/types/finance";

const sortBy = (items: Transaction[], sortField: SortField, sortOrder: SortOrder) => {
  return [...items].sort((a, b) => {
    const direction = sortOrder === "asc" ? 1 : -1;

    if (sortField === "date") {
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
    }

    return (a.amount - b.amount) * direction;
  });
};

export const applyFilters = (
  transactions: Transaction[],
  filters: FilterState,
): Transaction[] => {
  const query = filters.search.trim().toLowerCase();

  const filtered = transactions.filter((transaction) => {
    const matchesSearch =
      query.length === 0 ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query) ||
      transaction.merchant.toLowerCase().includes(query);

    const matchesType =
      filters.typeFilter === "all" || transaction.type === filters.typeFilter;

    const matchesCategory =
      filters.categoryFilter === "all" ||
      transaction.category === filters.categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  return sortBy(filtered, filters.sortField, filters.sortOrder);
};

export const getCategoriesFromTransactions = (
  transactions: Transaction[],
): TransactionCategory[] => {
  return Array.from(new Set(transactions.map((item) => item.category)));
};

export const getTypeOptions = (): Array<"all" | TransactionType> => [
  "all",
  "income",
  "expense",
];
