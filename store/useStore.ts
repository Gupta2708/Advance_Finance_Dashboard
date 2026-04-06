"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockTransactions } from "@/data/mockTransactions";
import type {
  FilterState,
  InsightSummary,
  SummaryStats,
  Transaction,
  TransactionCategory,
  TransactionType,
  TrendPoint,
  UserRole,
  CategoryBreakdownPoint,
  SortField,
  SortOrder,
} from "@/types/finance";
import { getCategoryBreakdown, getInsights, getSummaryStats, getTrendSeries } from "@/utils/calculations";
import { applyFilters } from "@/utils/filters";

interface ModalState {
  isFormOpen: boolean;
  editingId: string | null;
  deletingId: string | null;
}

interface FinanceStore {
  transactions: Transaction[];
  role: UserRole;
  theme: "light" | "dark";
  filters: FilterState;
  modal: ModalState;
  setRole: (role: UserRole) => void;
  setTheme: (theme: "light" | "dark") => void;
  setSearch: (search: string) => void;
  setTypeFilter: (typeFilter: "all" | TransactionType) => void;
  setCategoryFilter: (categoryFilter: "all" | TransactionCategory) => void;
  setSort: (sortField: SortField, sortOrder: SortOrder) => void;
  addTransaction: (payload: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, payload: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  openModal: (mode: "create" | "edit", id?: string) => void;
  closeModal: () => void;
  openDeleteDialog: (id: string) => void;
  closeDeleteDialog: () => void;
  getFilteredTransactions: () => Transaction[];
  getSummaryStats: () => SummaryStats;
  getTrendSeries: () => TrendPoint[];
  getCategoryBreakdown: () => CategoryBreakdownPoint[];
  getInsights: () => InsightSummary;
}

const defaultFilters: FilterState = {
  search: "",
  typeFilter: "all",
  categoryFilter: "all",
  sortField: "date",
  sortOrder: "desc",
};

export const useStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: "admin",
      theme: "light",
      filters: defaultFilters,
      modal: {
        isFormOpen: false,
        editingId: null,
        deletingId: null,
      },
      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),
      setTypeFilter: (typeFilter) =>
        set((state) => ({ filters: { ...state.filters, typeFilter } })),
      setCategoryFilter: (categoryFilter) =>
        set((state) => ({ filters: { ...state.filters, categoryFilter } })),
      setSort: (sortField, sortOrder) =>
        set((state) => ({ filters: { ...state.filters, sortField, sortOrder } })),
      addTransaction: (payload) =>
        set((state) => ({
          transactions: [
            {
              ...payload,
              id: `tx_${Date.now()}`,
            },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, payload) =>
        set((state) => ({
          transactions: state.transactions.map((item) =>
            item.id === id ? { ...payload, id } : item,
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((item) => item.id !== id),
          modal: { ...state.modal, deletingId: null },
        })),
      openModal: (mode, id) =>
        set((state) => ({
          modal: {
            ...state.modal,
            isFormOpen: true,
            editingId: mode === "edit" ? id ?? null : null,
          },
        })),
      closeModal: () =>
        set((state) => ({
          modal: {
            ...state.modal,
            isFormOpen: false,
            editingId: null,
          },
        })),
      openDeleteDialog: (id) =>
        set((state) => ({
          modal: {
            ...state.modal,
            deletingId: id,
          },
        })),
      closeDeleteDialog: () =>
        set((state) => ({
          modal: {
            ...state.modal,
            deletingId: null,
          },
        })),
      getFilteredTransactions: () => applyFilters(get().transactions, get().filters),
      getSummaryStats: () => getSummaryStats(get().getFilteredTransactions()),
      getTrendSeries: () => getTrendSeries(get().getFilteredTransactions()),
      getCategoryBreakdown: () => getCategoryBreakdown(get().getFilteredTransactions()),
      getInsights: () => getInsights(get().getFilteredTransactions()),
    }),
    {
      name: "finance-dashboard-store",
      version: 2,
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        theme: state.theme,
      }),
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<FinanceStore> | undefined;
        if (!state?.transactions) {
          return persistedState as FinanceStore;
        }

        return {
          ...state,
          transactions: state.transactions.map((transaction) => ({
            ...transaction,
            paymentMethod: transaction.paymentMethod ?? "UPI",
          })),
        } as FinanceStore;
      },
    },
  ),
);
