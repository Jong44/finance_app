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
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [monthlySavings, setMonthlySavings] = useState(0);
    const [savingsGoal, setSavingsGoal] = useState(5000000); // Default savings goal
    const [budgetStatus, setBudgetStatus] = useState("On Track");
    const [budgetProgress, setBudgetProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch("/api/invoices");
                if (!response.ok) {
                    throw new Error("Failed to fetch invoices");
                }
                const data = await response.json();
                const invoicesData: Invoice[] = data.invoices || [];

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


                // Hitung Monthly Savings
                const savings = savingsGoal - total;

                // Hitung Budget Status
                const progress = ((savingsGoal - savings) / savingsGoal) * 100;
                const status = progress >= 100 ? "Achieved" : progress >= 75 ? "On Track" : "Behind";

                setInvoices(invoicesData);
                setExpenseDetails(allExpenseDetails);
                setTotalExpenses(total);
                setMonthlySavings(savings);
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

    return (
        <div className="p-6">
            <h1 className="font-bold text-3xl mb-10">Dashboard</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                <Card>
                    <CardHeader className="text-sm flex justify-between items-center">
                        <p>Total Daily Expenses</p>
                        <DollarSign size={"16"} />
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        Rp {totalExpenses.toLocaleString()}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="text-sm flex justify-between items-center">
                        <p>Monthly Savings Progress</p>
                        <DollarSign size={"16"} />
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        Rp {monthlySavings.toLocaleString()} <span className="text-sm text-muted-foreground">/ Rp {savingsGoal.toLocaleString()}</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="text-sm flex justify-between items-center">
                        <p>Budget Status</p>
                        <DollarSign size={"16"} />
                    </CardHeader>
                    <CardContent className="text-2xl font-semibold">
                        {budgetStatus} <span className="text-sm text-chart-5">+{budgetProgress.toFixed(2)}%</span>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
                <BarChartDashboard data={expenseDetails} />
                <PieChartDashboard data={expenseDetails} />
            </div>

            <TableDashboard data={expenseDetails} />
        </div>
    );
};

export default Dashboard;
