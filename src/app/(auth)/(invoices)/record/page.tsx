"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Edit, Trash2, Search, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { set } from "zod";

interface ExpenseDetail {
  id?: string;
  name_product: string;
  category: string;
  category_budget: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
}

interface Expense {
  id?: string;
  code_receipt: string;
  name_supplier: string;
  note?: string;
  date: string;
  total_price: number;
  tax_price: number;
  details: ExpenseDetail[];
}

export default function RecordPage() {
  const [needs, setNeeds] = useState<number>(0);
  const [wants, setWants] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);

  const [targetNeeds, setTargetNeeds] = useState<string>("");
  const [targetWants, setTargetWants] = useState<string>("");
  const [targetSavings, setTargetSavings] = useState<string>("");

  const budgetId = "117c88fc-849e-4792-a161-d1a3295c50b0";
  const personalityId = "bff9f281-1162-4a2f-a501-1ff8f0616205";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const responsePersonality = await fetch(
          `/api/personality/${personalityId}`
        );
        if (!responsePersonality.ok) {
          throw new Error("Failed to fetch personality");
        }
        const dataPersonality = await responsePersonality.json();
        const income = dataPersonality.income;

        const responseBudget = await fetch(`/api/budget/${budgetId}`);
        if (!responseBudget.ok) {
          throw new Error("Failed to fetch budget");
        }
        const dataBudget = await responseBudget.json();
        console.log("Fetched budget:", dataBudget);

        setTargetNeeds(
          (
            (income * (parseFloat(dataBudget.needs) || 50)) /
            100
          ).toLocaleString()
        );

        setTargetWants(
          (
            (income * (parseFloat(dataBudget.wants) || 30)) /
            100
          ).toLocaleString()
        );

        setTargetSavings(
          (
            (income * (parseFloat(dataBudget.savings) || 20)) /
            100
          ).toLocaleString()
        );

        const response = await fetch("/api/invoices");
        if (!response.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const data = await response.json();
        setExpenses(data.invoices || []);
        console.log("Fetched expenses:", data.invoices);

        data.invoices.forEach((expense: Expense) => {
          if (expense.details) {
            expense.details.forEach((detail: ExpenseDetail) => {
              if (detail.category_budget === "Needs") {
                setNeeds((prev) => prev + detail.total_price);
              } else if (detail.category_budget === "Wants") {
                setWants((prev) => prev + detail.total_price);
              }
            });
          }
        });
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.code_receipt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.name_supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle view expense details
  const handleViewExpense = (id: string) => {
    if (id) {
      // Navigate to the invoice detail page with the ID in the URL
      router.push(`/invoice/${id}`, { scroll: false });
    }
  };

  // Handle edit expense
  const handleEditExpense = (id: string) => {
    console.log(filteredExpenses.map((expense) => expense.id));
    if (id) {
      // Navigate to the invoice edit page with the ID in the URL
      router.push(`/invoice/edit/${id}`, { scroll: false });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expense Records</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Total Needs Expanses</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            Rp {needs ? needs.toLocaleString() : 0}
            <span className="text-sm text-muted-foreground">
              / Rp {targetNeeds}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Total Wants Expenses</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            Rp {wants.toLocaleString()}
            <span className="text-sm text-muted-foreground">
              / Rp {targetWants}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Total Savings</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            Rp {1000000}
            <span className="text-sm text-muted-foreground">
              / Rp {1000000}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="bg-muted/20 border-b">
          <div className="flex justify-between items-center">
            <CardTitle>All Expenses</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading expenses...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No matching expenses found"
                  : "No expenses recorded yet"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt Code</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {expense.code_receipt}
                    </TableCell>
                    <TableCell>{formatDate(expense.date)}</TableCell>
                    <TableCell>{expense.name_supplier}</TableCell>
                    <TableCell className="text-right">
                      ${expense.total_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${expense.tax_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewExpense(expense.id || "")}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditExpense(expense.id || "")}
                          title="Edit Expense"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
