import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
  income: {
    label: "Income",
    color: "oklch(0.65 0.18 145)",
  },
  expense: {
    label: "Expenses",
    color: "oklch(0.62 0.22 25)",
  },
};

const CashFlowChart = ({ data }) => {
  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart data={data} barGap={4} barCategoryGap="30%">
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
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
          cursor={{ fill: "var(--muted)", radius: 4 }}
        />
        <Legend content={<ChartLegendContent />} />
        <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default CashFlowChart;
