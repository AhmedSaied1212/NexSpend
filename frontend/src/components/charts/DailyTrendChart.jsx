import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  expense: {
    label: "Daily Spending",
    color: "oklch(0.62 0.22 25)",
  },
  income: {
    label: "Daily Income",
    color: "oklch(0.65 0.18 145)",
  },
};

// Show only every 5th tick to avoid crowding
const tickFormatter = (_, index) => (index % 5 === 0 ? _ : "");

const DailyTrendChart = ({ data }) => {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-expense)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--color-expense)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-income)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--color-income)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 10 }}
          tickFormatter={tickFormatter}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) =>
            v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
          }
        />
        <Tooltip
          content={
            <ChartTooltipContent
              formatter={(val) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val)
              }
            />
          }
        />
        <Area
          type="monotone"
          dataKey="income"
          stroke="var(--color-income)"
          strokeWidth={2}
          fill="url(#incomeGrad)"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="var(--color-expense)"
          strokeWidth={2}
          fill="url(#expenseGrad)"
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default DailyTrendChart;
