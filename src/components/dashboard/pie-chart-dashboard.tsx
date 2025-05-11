"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import React from "react";
import { TrendingUp } from "lucide-react";

// Data untuk breakdown pengeluaran per kategori
const chartDataPie = [
  { category: "Food & Drinks", amount: 5000000, fill: "var(--color-level-1)" },
  { category: "Transportation", amount: 3000000, fill: "var(--color-level-2)" },
  { category: "Bills & Utilities", amount: 2000000, fill: "var(--color-level-3)" },
  { category: "Entertainment", amount: 1500000, fill: "var(--color-level-4)" },
  { category: "Savings", amount: 2500000, fill: "var(--color-level-5)" },
];

const chartConfigPie = {
  food: {
    label: "Food & Drinks",
    color: "hsl(var(--chart-food))",
  },
  transport: {
    label: "Transportation",
    color: "hsl(var(--chart-transport))",
  },
  bills: {
    label: "Bills & Utilities",
    color: "hsl(var(--chart-bills))",
  },
  entertainment: {
    label: "Entertainment",
    color: "hsl(var(--chart-entertainment))",
  },
  savings: {
    label: "Savings",
    color: "hsl(var(--chart-savings))",
  },
} satisfies ChartConfig;

const PieChartDashboard = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Breakdown Weekly</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfigPie}>
          <PieChart>
            <Tooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartDataPie}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name} (${value.toLocaleString()})`}
              labelLine={false}
            >
              {chartDataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing expense distribution for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default PieChartDashboard;
