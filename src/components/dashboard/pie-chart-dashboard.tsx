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
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface ExpenseDetail {
  id: string;
  category: string;
  total_price: number;
}

interface PieChartDashboardProps {
  data: ExpenseDetail[];
}

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

const PieChartDashboard: React.FC<PieChartDashboardProps> = ({ data }) => {
  const [chartData, setChartData] = useState<{ category: string; amount: number; fill: string }[]>([]);

  useEffect(() => {
    // Group expenses by category
    const categoryTotals: { [key: string]: number } = {};

    data.forEach((expense) => {
      const category = expense.category.toLowerCase();
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += expense.total_price;
      console.log(category)
    });


    // Convert to array for PieChart
    const formattedData = Object.entries(categoryTotals).map(([category, amount]) => {
      const config = chartConfigPie[category] || {
        label: category,
        color: "hsl(var(--chart-unknown))",
      };
      return {
        category: config.label,
        amount,
        fill: config.color,
      };
    });

    setChartData(formattedData);
  }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Breakdown Weekly</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfigPie}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name} (${value.toLocaleString()})`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
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
