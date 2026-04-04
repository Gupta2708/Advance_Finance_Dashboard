# Zorvyn

A modern, production-quality fintech dashboard built with **Next.js App Router** that focuses on frontend architecture, clean UX, and interactive financial analytics.

## Project Overview

This project simulates a real fintech product experience with:
- dynamic summary metrics
- chart-driven insights
- advanced transaction controls
- role-based UI behavior (Viewer/Admin)
- polished responsive design across mobile, tablet, and desktop

No backend is used. All logic is frontend-driven using mock data and client state.

## Features

### Dashboard Overview
- Summary cards for Total Balance, Income, Expenses, and Net Savings
- Interactive monthly trend chart (Income vs Expense vs Balance)
- Category spending pie chart
- Real-time updates based on active search/filter/sort state

### Transactions
- Search by merchant, description, or category
- Filter by transaction type and category
- Sort by date or amount
- Responsive UI:
  - desktop table
  - mobile stacked cards
- Empty-state UI when no results match
- Color-coded transaction amounts and type badges

### Role-Based UI Simulation
- `Viewer`: read-only access
- `Admin`: full CRUD operations
  - add transaction (modal form)
  - edit transaction
  - delete with confirmation dialog

### Insights Panel
Computed from current filtered transactions:
- Highest spending category
- Current vs previous month expense comparison
- Net savings
- Insight narrative message (e.g., monthly spend trend)

### Enhancements Included
- Dark mode toggle
- LocalStorage persistence (transactions, role, theme)
- Framer Motion animations
- Toast notifications
- Export filtered transactions to CSV and JSON

## Tech Stack

- **Next.js** (App Router, latest)
- **React** (Client Components for interactivity)
- **Tailwind CSS**
- **Zustand** + persist middleware
- **Recharts**
- **Framer Motion**
- **Sonner** (toast notifications)
- **Lucide React** (icons)

## Folder Structure

```txt
app/
  layout.tsx
  page.tsx
  globals.css

components/
  dashboard/
    SummaryCards.tsx
    TrendChart.tsx
    CategoryChart.tsx
    InsightsPanel.tsx
  transactions/
    TransactionTable.tsx
    TransactionRow.tsx
    TransactionFilters.tsx
    TransactionFormModal.tsx
  shared/
    Navbar.tsx
    RoleSwitcher.tsx
    ThemeToggle.tsx
    EmptyState.tsx
    StatCard.tsx

data/
  mockTransactions.ts

store/
  useStore.ts

types/
  finance.ts

utils/
  calculations.ts
  filters.ts
  formatters.ts
  exporters.ts
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open:
   ```txt
   http://localhost:3000
   ```

## Role-Based UI Behavior

- Use the role switcher in the top navbar.
- `Viewer` can inspect metrics, charts, and transactions only.
- `Admin` can add, edit, delete transactions; all changes persist in LocalStorage.

## Scripts

- `npm run dev` - start local development server
- `npm run lint` - run ESLint
- `npm run build` - create production build

## Screenshots / Demo

Add your screenshots here for portfolio submission:
- `public/screenshots/dashboard-overview.png`
- `public/screenshots/transactions-mobile.png`
- `public/screenshots/dark-mode.png`

Or include a deployed demo link in this section.

## Future Improvements

- Add recurring transaction templates
- Add budget goals with progress indicators
- Add per-category drill-down pages
- Add PWA support and offline sync
- Integrate real backend/auth for multi-user data
