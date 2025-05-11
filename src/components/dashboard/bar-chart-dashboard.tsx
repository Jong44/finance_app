"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { DollarSign, TrendingUp } from "lucide-react";

const chartData = [
  { month: "January", needs: 3500, wants: 2000, savings: 1500 },
  { month: "February", needs: 4000, wants: 2500, savings: 1000 },
  { month: "March", needs: 3800, wants: 2200, savings: 1700 },
  { month: "April", needs: 4200, wants: 2600, savings: 1200 },
  { month: "May", needs: 3900, wants: 2400, savings: 1300 },
  { month: "June", needs: 4100, wants: 2700, savings: 1200 },
];

const chartConfig = {
  needs: {
    label: "Needs (50%)",
    color: "hsl(var(--chart-needs))",
  },
  wants: {
    label: "Wants (30%)",
    color: "hsl(var(--chart-wants))",
  },
  savings: {
    label: "Savings (20%)",
    color: "hsl(var(--chart-savings))",
  },
} satisfies ChartConfig;

const BarChartDashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Balance (50/30/20)</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData} barGap={12} barCategoryGap="20%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />
            <Legend />
            <Bar dataKey="needs" fill="var(--color-level-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="wants" fill="var(--color-level-2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="savings" fill="var(--color-level-3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing budget distribution for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default BarChartDashboard;
