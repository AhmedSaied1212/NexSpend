import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent, ChartLegendContent } from "@/components/ui/chart";

// A rich, vibrant palette for up to 8 categories
const COLORS = [
  "oklch(0.62 0.22 25)",   // red-ish
  "oklch(0.65 0.19 55)",   // orange
  "oklch(0.72 0.19 95)",   // yellow-green
  "oklch(0.65 0.18 145)",  // green
  "oklch(0.62 0.22 200)",  // cyan
  "oklch(0.60 0.22 250)",  // blue
  "oklch(0.58 0.22 295)",  // violet
  "oklch(0.62 0.22 340)",  // pink
];

const buildConfig = (data) =>
  Object.fromEntries(
    data.map((item, i) => [
      item.name,
      { label: item.name, color: COLORS[i % COLORS.length] },
    ])
  );

const CategoryDonutChart = ({ data, type = "expense" }) => {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
        No {type} data yet
      </div>
    );
  }

  const config = buildConfig(data);
  const total = data.reduce((s, d) => s + d.value, 0);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ChartContainer config={config} className="h-72 w-full">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          innerRadius={55}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip
          content={
            <ChartTooltipContent
              formatter={(val, name) => [
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(val),
                name,
              ]}
            />
          }
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
      </PieChart>
    </ChartContainer>
  );
};

export default CategoryDonutChart;
