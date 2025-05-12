"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, Edit, Trash2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ExpenseDetail {
    id?: string
    name_product: string
    category: string
    quantity: number
    unit: string
    price_per_unit: number
    total_price: number
}

interface Expense {
    id?: string
    code_receipt: string
    name_supplier: string
    note?: string
    date: string
    total_price: number
    tax_price: number
    expense_details: ExpenseDetail[]
}

export default function RecordPage() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const router = useRouter()

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const response = await fetch("/api/invoices")
                if (!response.ok) {
                throw new Error("Failed to fetch expenses")
                }
                const data = await response.json()
                setExpenses(data.invoices || [])
            } catch (err) {
                console.error("Error fetching expenses:", err)
                setError("Failed to load expenses. Please try again.")
            } finally {
                setLoading(false)
            }
        }

    fetchExpenses()
    }, [])

  // Filter expenses based on search term
    const filteredExpenses = expenses.filter(
        (expense) =>
        expense.code_receipt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.name_supplier.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString()
    }

  // Handle view expense details
    const handleViewExpense = (id: string) => {
        if (id) {
            // Navigate to the invoice detail page with the ID in the URL
            router.push(`/invoice/${id}`, { scroll: false })
        }
    }

  // Handle edit expense
    const handleEditExpense = (id: string) => {
        console.log(filteredExpenses.map((expense) => expense.id))
        if (id) {
            // Navigate to the invoice edit page with the ID in the URL
            router.push(`/invoice/edit/${id}`, { scroll: false })
        }
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Expense Records</h1>
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
                    {searchTerm ? "No matching expenses found" : "No expenses recorded yet"}
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
                        <TableCell className="font-medium">{expense.code_receipt}</TableCell>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>{expense.name_supplier}</TableCell>
                        <TableCell className="text-right">${expense.total_price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${expense.tax_price.toFixed(2)}</TableCell>
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
    )
}