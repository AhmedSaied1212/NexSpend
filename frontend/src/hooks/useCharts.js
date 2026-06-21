import { useMemo } from "react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";

/**
 * Derives all chart-ready datasets from a flat transactions array.
 * Zero API calls – everything is computed client-side from the data
 * already fetched by useTransactions.
 */
const useCharts = (transactions = []) => {
  // ── 1. Monthly Cash-Flow (last 6 months) ─────────────────────────────────
  const monthlyCashFlow = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const monthDate = subMonths(now, 5 - i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const label = format(monthDate, "MMM yy");

      const inRange = transactions.filter((t) => {
        const d = typeof t.date === "string" ? parseISO(t.date) : new Date(t.date);
        return isWithinInterval(d, { start, end });
      });

      const income = inRange
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);

      const expense = inRange
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);

      return { month: label, income, expense, net: income - expense };
    });
  }, [transactions]);

  // ── 2. Expense Breakdown by Category (pie / donut) ───────────────────────
  const expenseByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // top 8 categories
  }, [transactions]);

  // ── 3. Income Breakdown by Category ──────────────────────────────────────
  const incomeByCategory = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === "income")
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount);
      });

    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [transactions]);

  // ── 4. Daily Spending Trend (last 30 days) ───────────────────────────────
  const dailyTrend = useMemo(() => {
    const now = new Date();
    const days = 30;
    const map = {};

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = format(d, "MMM d");
      map[key] = { day: key, expense: 0, income: 0 };
    }

    transactions.forEach((t) => {
      const d = typeof t.date === "string" ? parseISO(t.date) : new Date(t.date);
      const key = format(d, "MMM d");
      if (map[key]) {
        if (t.type === "expense") map[key].expense += Number(t.amount);
        else map[key].income += Number(t.amount);
      }
    });

    return Object.values(map);
  }, [transactions]);

  // ── 5. Summary KPIs ──────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);

    const savingsRate =
      totalIncome > 0
        ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
        : 0;

    return {
      totalIncome,
      totalExpense,
      net: totalIncome - totalExpense,
      savingsRate,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // ── 6. Savings Rate trend (last 6 months) ────────────────────────────────
  const savingsRateTrend = useMemo(() => {
    return monthlyCashFlow.map(({ month, income, expense }) => ({
      month,
      rate: income > 0 ? parseFloat((((income - expense) / income) * 100).toFixed(1)) : 0,
    }));
  }, [monthlyCashFlow]);

  return {
    monthlyCashFlow,
    expenseByCategory,
    incomeByCategory,
    dailyTrend,
    summary,
    savingsRateTrend,
  };
};

export default useCharts;
