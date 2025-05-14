"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../ui/chart";
import { DollarSign, TrendingUp } from "lucide-react";

// Define chartConfig object for consistent chart styling
const chartConfig = {
  needs: {
    label: "Needs (50%)",
    color: "var(--color-level-1)",
  },
  wants: {
    label: "Wants (30%)",
    color: "var( --color-level-2)",
  },
  savings: {
    label: "Savings (20%)",
    color: "var( --color-level-3)",
  },
} satisfies ChartConfig;

interface BarChartDashboardProps {
  chart_data: {
    month: string;
    needs: number;
    wants: number;
    savings: number;
  }[];
}

const BarChartDashboard = ({ chart_data }: BarChartDashboardProps) => {
  console.log("BarChartDashboard data:", chart_data);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Balance (50/30/20)</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chart_data} barGap={12} barCategoryGap="20%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Shorten month names
            />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Legend />
            {/* Render dynamic bars */}
            <Bar
              dataKey="needs"
              fill={chartConfig.needs.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="wants"
              fill={chartConfig.wants.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="savings"
              fill={chartConfig.savings.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartDashboard;
