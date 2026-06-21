import React, { useEffect, useState } from "react";
import useTransactions from "@/hooks/useTransactions";
import useCharts from "@/hooks/useCharts";
import { formatCurrency } from "@/utils/FormateCurrency";

import ChartCard from "@/components/charts/ChartCard";
import CashFlowChart from "@/components/charts/CashFlowChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import DailyTrendChart from "@/components/charts/DailyTrendChart";
import SavingsRateChart from "@/components/charts/SavingsRateChart";

import ExportPdf from "@/components/charts/ExportPdf";
import ExportExcel from "@/components/charts/ExportExcel";

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── KPI Card ──────────────────────────────────────────────────────────────────
const KpiCard = ({ label, value, sub, icon: Icon, colorClass }) => (
  <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
    <div className={cn("rounded-xl p-3 shrink-0", colorClass)}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground font-medium truncate">{label}</p>
      <p className="text-xl font-bold text-foreground mt-0.5 truncate">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Tab Pill ──────────────────────────────────────────────────────────────────
const TabPill = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
      active
        ? "bg-foreground text-background shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    )}
  >
    {children}
  </button>
);

// ─── Page ──────────────────────────────────────────────────────────────────────
const Charts = () => {
  const { transactions, getTransactions, isLoading } = useTransactions();
  const {
    monthlyCashFlow,
    expenseByCategory,
    incomeByCategory,
    dailyTrend,
    summary,
    savingsRateTrend,
  } = useCharts(transactions);

  const [donutTab, setDonutTab] = useState("expense");

  useEffect(() => {
    getTransactions();
  }, []);

  const netPositive = summary.net >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-muted-foreground" />
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Financial insights from your transaction history
          </p>
        </div>
        <button
          onClick={getTransactions}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          {isLoading ? "Loading…" : "Refresh"}
        </button>
      </div>
      <div className="flex justify-end items-center p-6 gap-2">
        <ExportExcel transactions={transactions}/>
        <ExportPdf transactions={transactions}/>
      </div>
      <div className="p-6 space-y-6">
        {/* ── KPI Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Income"
            value={formatCurrency(summary.totalIncome)}
            sub={`${transactions.filter((t) => t.type === "income").length} transactions`}
            icon={TrendingUp}
            colorClass="bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400"
          />
          <KpiCard
            label="Total Expenses"
            value={formatCurrency(summary.totalExpense)}
            sub={`${transactions.filter((t) => t.type === "expense").length} transactions`}
            icon={TrendingDown}
            colorClass="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
          />
          <KpiCard
            label="Net Balance"
            value={formatCurrency(summary.net)}
            sub={netPositive ? "Positive cash flow" : "Negative cash flow"}
            icon={Wallet}
            colorClass={
              netPositive
                ? "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                : "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400"
            }
          />
          <KpiCard
            label="Savings Rate"
            value={`${summary.savingsRate}%`}
            sub="of income saved"
            icon={PiggyBank}
            colorClass="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400"
          />
        </div>

        {/* ── Cash Flow Bar Chart ─────────────────────────────────── */}
        <ChartCard
          title="Monthly Cash Flow"
          description="Income vs. expenses over the last 6 months"
        >
          <CashFlowChart data={monthlyCashFlow} />
        </ChartCard>

        {/* ── Category Breakdown + Savings Rate ──────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartCard
            title="Category Breakdown"
            description="Top categories by amount"
            action={
              <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                <TabPill
                  active={donutTab === "expense"}
                  onClick={() => setDonutTab("expense")}
                >
                  Expenses
                </TabPill>
                <TabPill
                  active={donutTab === "income"}
                  onClick={() => setDonutTab("income")}
                >
                  Income
                </TabPill>
              </div>
            }
          >
            <CategoryDonutChart
              data={donutTab === "expense" ? expenseByCategory : incomeByCategory}
              type={donutTab}
            />
          </ChartCard>

          <ChartCard
            title="Savings Rate Trend"
            description="Monthly savings rate (%) — negative means overspending"
          >
            <SavingsRateChart data={savingsRateTrend} />
          </ChartCard>
        </div>

        {/* ── Daily Trend Area Chart ──────────────────────────────── */}
        <ChartCard
          title="Daily Activity — Last 30 Days"
          description="Day-by-day income and spending"
        >
          <DailyTrendChart data={dailyTrend} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Charts;