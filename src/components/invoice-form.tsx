"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Trash2, Plus } from "lucide-react"

// Shadcn UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Form schema with items array
const formSchema = z.object({
    invoiceTitle: z.string().min(1, "Invoice title is required"),
    transactionDate: z.date(),
    items: z
        .array(
        z.object({
            id: z.string(),
            description: z.string().min(1, "Description is required"),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            price: z.number().min(0, "Price must be a positive number"),
            total: z.number(),
        }),
    )
    .min(1, "At least one item is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function InvoiceForm() {
  // Form setup with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        invoiceTitle: "Invoice #27346733-022",
        transactionDate: new Date(),
        items: [
            { id: "1", description: "Secret Stadium Sauce", quantity: 15, price: 8.99, total: 134.85 },
            { id: "2", description: "Secret Stadium Sauce", quantity: 15, price: 8.99, total: 134.85 },
            { id: "3", description: "Secret Stadium Sauce", quantity: 15, price: 8.99, total: 134.85 },
            { id: "4", description: "Secret Stadium Sauce", quantity: 15, price: 8.99, total: 134.85 },
            { id: "5", description: "Secret Stadium Sauce", quantity: 15, price: 8.99, total: 134.85 },
        ],
        },
    })

  // Use field array to manage dynamic items
    const { fields, append, remove } = useFieldArray({
        name: "items",
        control: form.control,
    })

    // Calculate total for an item when quantity or price changes
    const calculateItemTotal = (index: number) => {
        const quantity = form.getValues(`items.${index}.quantity`)
        const price = form.getValues(`items.${index}.price`)
        const total = Number((quantity * price).toFixed(2))
        form.setValue(`items.${index}.total`, total)
        return total
    }

    // Add new item
    const addNewItem = () => {
        append({
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        price: 0,
        total: 0,
        })
    }

    // Calculate grand total
    const calculateTotal = () => {
        const items = form.getValues("items")
        return items.reduce((sum, item) => sum + item.total, 0).toFixed(2)
    }

    // Form submission
    const onSubmit = (values: FormValues) => {
        console.log(values)
        alert("Invoice saved successfully!")
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Invoice Details Card */}
            <Card>
            <CardHeader className="bg-muted/20 border-b">
                <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Invoice Title */}
                <FormField
                    control={form.control}
                    name="invoiceTitle"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Invoice Title</FormLabel>
                        <FormControl>
                        <Input {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                {/* Transaction Date */}
                <FormField
                    control={form.control}
                    name="transactionDate"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Transaction Date</FormLabel>
                        <FormControl>
                        <Input
                            type="date"
                            value={field.value ? field.value.toISOString().split("T")[0] : ""}
                            onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : new Date()
                            field.onChange(date)
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
            </CardContent>
            </Card>

            {/* Items Card */}
            <Card>
            <CardHeader className="bg-muted/20 border-b">
                <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="w-32">Price</TableHead>
                    <TableHead className="w-32">Total Amount</TableHead>
                    <TableHead className="w-16">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                    <TableRow key={field.id}>
                        <TableCell>
                        <FormField
                            control={form.control}
                            name={`items.${index}.description`}
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </TableCell>
                        <TableCell>
                        <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => {
                                    field.onChange(Number.parseInt(e.target.value) || 0)
                                    calculateItemTotal(index)
                                    }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </TableCell>
                        <TableCell>
                        <FormField
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                    </span>
                                    <Input
                                    type="number"
                                    step="0.01"
                                    className="pl-6"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(Number.parseFloat(e.target.value) || 0)
                                        calculateItemTotal(index)
                                    }}
                                    />
                                </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        </TableCell>
                        <TableCell>
                        <FormField
                            control={form.control}
                            name={`items.${index}.total`}
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input value={`$${field.value.toFixed(2)}`} readOnly />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                        </TableCell>
                        <TableCell>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                            <Trash2 size={16} />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>

                <div className="mt-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewItem}
                    className="flex items-center gap-1"
                >
                    <Plus size={16} />
                    <span>Add Item</span>
                </Button>
                </div>

                <div className="flex justify-end mt-6">
                <div className="w-32">
                    <Label htmlFor="total" className="font-medium">
                    Total
                    </Label>
                    <Input id="total" value={`$${calculateTotal()}`} readOnly className="w-full mt-2" />
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
                Cancel
            </Button>
            <Button type="submit" className="bg-black text-white hover:bg-black/90">
                Save
            </Button>
            </div>
        </form>
        </Form>
    )
    }
