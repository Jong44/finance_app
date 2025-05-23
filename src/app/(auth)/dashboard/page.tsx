"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import BarChartDashboard from "@/components/dashboard/bar-chart-dashboard";
import PieChartDashboard from "@/components/dashboard/pie-chart-dashboard";
import TableDashboard from "@/components/dashboard/table-dashboard";
import { useRouter } from "next/navigation";

interface ExpenseDetail {
  id: string;
  name_product: string;
  category: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
  expenseId: string;
}

interface Invoice {
  id: string;
  code_receipt: string;
  name_supplier: string;
  note: string | null;
  date: string;
  details: ExpenseDetail[];
}

const Dashboard = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalMoney, setTotalMoney] = useState(0);
  const [dailyExpenses, setDailyExpenses] = useState(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [savingsGoal, setSavingsGoal] = useState(5000000); // Default savings goal
  const [budgetStatus, setBudgetStatus] = useState("On Track");
  const [budgetProgress, setBudgetProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const responsePersonality = await fetch("/api/personality");
        const response = await fetch("/api/invoices");
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        if (!responsePersonality.ok) {
          throw new Error("Failed to fetch personality");
        }

        const personalityData = await responsePersonality.json();
        const personality = personalityData[0] || null;
        const data = await response.json();
        const invoicesData: Invoice[] = data.invoices || [];

        console.log("Invoices Data:", invoicesData);

        // Ambil semua detail expense
        const allExpenseDetails: ExpenseDetail[] = [];
        let total = 0;

        for (const invoice of invoicesData) {
          // Fetch expense details for each invoice
          const details = invoice.details;
          invoice.details = invoice.details;
          allExpenseDetails.push(...details);
          total += details.reduce((sum, item) => sum + item.total_price, 0);
        }

        // Process the invoice data for chart
        const chartData = processInvoiceData(invoicesData);
        setChartData(chartData);

        // Hitung Daily Expenses
        const dailyExpenses = allExpenseDetails.reduce(
          (sum, item) => sum + item.total_price,
          0
        );

        // Hitung total money
        const totalMoney =
          personality.income -
          allExpenseDetails.reduce((sum, item) => sum + item.total_price, 0);

        // Hitung Weekly Expenses
        const weeklyExpenses = allExpenseDetails.reduce(
          (sum, item) => sum + item.total_price,
          0
        );

        // Hitung Monthly Savings
        const savings = savingsGoal - total;

        // Hitung Budget Status
        const progress = ((savingsGoal - savings) / savingsGoal) * 100;
        const status =
          progress >= 100 ? "Achieved" : progress >= 75 ? "On Track" : "Behind";

        setInvoices(invoicesData);
        setExpenseDetails(allExpenseDetails);
        setDailyExpenses(dailyExpenses);
        setWeeklyExpenses(weeklyExpenses);
        setTotalMoney(totalMoney);
        setBudgetProgress(progress);
        setBudgetStatus(status);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const processInvoiceData = (invoiceData) => {
    const chartData = [];

    // Process each invoice
    invoiceData.forEach((invoice) => {
      const month = new Date(invoice.date).toLocaleString("default", {
        month: "long",
      });

      invoice.details.forEach((item) => {
        const existingMonthData = chartData.find(
          (data) => data.month === month
        );

        if (existingMonthData) {
          // Update existing month data
          if (item.category_budget === "Needs") {
            existingMonthData.needs += item.total_price;
          } else if (item.category_budget === "Wants") {
            existingMonthData.wants += item.total_price;
          }
          // Optionally add savings logic here, depending on your data
          existingMonthData.savings += 1000; // Static savings example
        } else {
          // Create new entry for this month
          const newMonthData = {
            month,
            needs: item.category_budget === "Needs" ? item.total_price : 0,
            wants: item.category_budget === "Wants" ? item.total_price : 0,
            savings: 1000, // Static savings example
          };
          chartData.push(newMonthData);
        }
      });
    });

    return chartData;
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-10">Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Total Money</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            Rp {totalMoney.toLocaleString()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Daily Expenses</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            Rp {dailyExpenses.toLocaleString()}{" "}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Weekly Expenses</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            Rp {weeklyExpenses.toLocaleString()}{" "}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <BarChartDashboard chart_data={chartData} />
        <PieChartDashboard data={expenseDetails} />
      </div>

      <TableDashboard data={expenseDetails} />
    </div>
  );
};

export default Dashboard;
