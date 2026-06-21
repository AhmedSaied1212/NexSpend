import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  rate: {
    label: "Savings Rate",
    color: "oklch(0.60 0.22 250)",
  },
};

const SavingsRateChart = ({ data }) => {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          domain={["auto", "auto"]}
        />
        <Tooltip
          content={
            <ChartTooltipContent
              formatter={(val) => [`${val}%`, "Savings Rate"]}
            />
          }
        />
        <ReferenceLine y={0} stroke="var(--destructive)" strokeDasharray="4 2" />
        <Line
          type="monotone"
          dataKey="rate"
          stroke="var(--color-rate)"
          strokeWidth={2.5}
          dot={{ fill: "var(--color-rate)", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default SavingsRateChart;
