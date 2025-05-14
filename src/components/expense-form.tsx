"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Trash2,
  Plus,
  Receipt,
  User,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";

import { expenseOperations } from "@/lib/db";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to format numbers to IDR currency
const formatToIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Form schema for expense and expense_detail
const formSchema = z.object({
  // Expense fields
  id_expense: z.string().optional(),
  code_receipt: z.string().min(1, "Receipt code is required"),
  name_supplier: z.string().min(1, "Supplier name is required"),
  note: z.string().optional(),
  date: z.date(),
  total_price: z.number().min(0),
  tax_price: z.number().min(0),

  // Expense details
  expense_details: z
    .array(
      z.object({
        id_expense_detail: z.string().optional(),
        name_product: z.string().min(1, "Product name is required"),
        category: z.string().min(1, "Category is required"),
        category_budget: z.string().optional(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unit: z.string().min(1, "Unit is required"),
        price_per_unit: z.number().min(0, "Price must be a positive number"),
        total_price: z.number().min(0),
      })
    )
    .min(1, "At least one item is required"),
});

type FormValues = z.infer<typeof formSchema>;

// Sample categories and units for the dropdowns
const categories = [
  "Office Supplies",
  "Equipment",
  "Services",
  "Travel",
  "Utilities",
  "Food & Beverages",
  "Other",
];
const units = [
  "Piece",
  "Box",
  "Pack",
  "Kg",
  "Liter",
  "Hour",
  "Day",
  "Month",
  "Service",
];

interface ExpenseFormProps {
  router: any;
  initialData?: FormValues;
  isEditing?: boolean;
}

const ExpenseForm = React.forwardRef(
  ({ router, initialData, isEditing = false }: ExpenseFormProps, ref) => {
    // Form setup with default values
    // Set default values based on whether we're editing or creating a new expense
    const defaultValues =
      isEditing && initialData
        ? {
            ...initialData,
            // Convert string date to Date object if needed
            date:
              initialData.date instanceof Date
                ? initialData.date
                : new Date(initialData.date),
          }
        : {
            id_expense: generateId(),
            code_receipt: `RCP-${generateRandomCode()}`,
            name_supplier: "",
            note: "",
            date: new Date(),
            total_price: 0,
            tax_price: 0,
            expense_details: [
              {
                id_expense_detail: generateId(),
                name_product: "",
                category: "Office Supplies",
                category_budget: "Wants",
                quantity: 1,
                unit: "Piece",
                price_per_unit: 0,
                total_price: 0,
              },
            ],
          };

    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues,
    });

    // Use field array to manage dynamic expense details
    const { fields, append, remove } = useFieldArray({
      name: "expense_details",
      control: form.control,
    });

    // Calculate total for an item when quantity or price changes
    const calculateItemTotal = (index: number) => {
      const quantity = form.getValues(`expense_details.${index}.quantity`);
      const pricePerUnit = form.getValues(
        `expense_details.${index}.price_per_unit`
      );
      const total = Number((quantity * pricePerUnit).toFixed(2));
      form.setValue(`expense_details.${index}.total_price`, total);

      // Recalculate the overall totals
      calculateTotals();

      return total;
    };

    // Calculate subtotal, tax, and grand total
    const calculateTotals = () => {
      const items = form.getValues("expense_details");
      const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);

      // Assuming tax is 10% of subtotal, but you can adjust this
      const taxRate = 0.1;
      const taxAmount = Number((subtotal * taxRate).toFixed(2));

      form.setValue("total_price", subtotal);
      form.setValue("tax_price", taxAmount);

      return { subtotal, taxAmount, grandTotal: subtotal + taxAmount };
    };

    // Add new item
    const addNewItem = () => {
      append({
        id_expense_detail: generateId(),
        name_product: "",
        category: "Office Supplies",
        category_budget: "Wants",
        quantity: 1,
        unit: "Piece",
        price_per_unit: 0,
        total_price: 0,
      });
    };

    // Form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // const router = useRouter()

    const onSubmit = async (values: FormValues) => {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      try {
        // Format the data to match the expected structure in expenseOperations
        const formattedData = {
          ...values,
          details: values.expense_details.map((detail) => ({
            name_product: detail.name_product,
            category: detail.category,
            category_budget: detail.category_budget,
            quantity: detail.quantity,
            unit: detail.unit,
            price_per_unit: detail.price_per_unit,
            total_price: detail.total_price,
          })),
        };

        // Use different endpoint for create vs update
        const url = isEditing
          ? `api/invoices/${values.id_expense}`
          : "api/invoices";
        const method = isEditing ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        });

        if (response.ok) {
          // Set success message
          setSuccess(
            isEditing
              ? "Expense invoice updated successfully!"
              : "Expense invoice saved successfully to database!"
          );

          if (!isEditing) {
            // Reset the form only for new expenses
            form.reset({
              id_expense: generateId(),
              code_receipt: `RCP-${generateRandomCode()}`,
              name_supplier: "",
              note: "",
              date: new Date(),
              total_price: 0,
              tax_price: 0,
              expense_details: [
                {
                  id_expense_detail: generateId(),
                  name_product: "",
                  category: "Office Supplies",
                  category_budget: "Wants",
                  quantity: 1,
                  unit: "Piece",
                  price_per_unit: 0,
                  total_price: 0,
                },
              ],
            });
          }

          // Navigate back to records page
          router.push("/record");
        }

        // // Save to database using Prisma client via expenseOperations
        // await expenseOperations.create(formattedData)
      } catch (err) {
        console.error("Error saving expense:", err);
        setError("Failed to save expense. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    // Helper function to generate IDs
    function generateId() {
      return Math.random().toString(36).substring(2, 15);
    }

    // Helper function to generate random receipt code
    function generateRandomCode() {
      return Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Expose the populateForm method to parent components via ref
    React.useImperativeHandle(ref, () => ({
      populateForm: (data: Partial<FormValues>) => {
        // Reset the form with the new data
        const currentValues = form.getValues();

        // Prepare the new form values by merging current values with scanned data
        const newValues = {
          ...currentValues,
          ...data,
          // Ensure we keep the ID if it exists
          id_expense: currentValues.id_expense,
        };

        // Reset the form with the new values
        form.reset(newValues);

        // Recalculate totals
        calculateTotals();
      },
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Expense Details Card */}
          <Card>
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle>Expense Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Receipt Code */}
                <FormField
                  control={form.control}
                  name="code_receipt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt size={16} />
                        Receipt Code
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar size={16} />
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={
                            field.value
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value)
                              : new Date();
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Supplier Name */}
                <FormField
                  control={form.control}
                  name="name_supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User size={16} />
                        Supplier Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Note */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText size={16} />
                        Note
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Additional notes about this expense"
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Expense Items Card */}
          <Card>
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle>Expense Items</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Category Budget</TableHead>
                    <TableHead className="w-20">Qty</TableHead>
                    <TableHead className="w-24">Unit</TableHead>
                    <TableHead className="w-32">Price/Unit</TableHead>
                    <TableHead className="w-32">Total</TableHead>
                    <TableHead className="w-16">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow key={field.id}>
                      {/* Product Name */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`expense_details.${index}.name_product`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input {...field} placeholder="Product name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`expense_details.${index}.category`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Category Budget */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`expense_details.${index}.category_budget`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category budget" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {["Wants", "Needs"].map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Quantity */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`expense_details.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(
                                      Number.parseInt(e.target.value) || 0
                                    );
                                    calculateItemTotal(index);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Unit */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`expense_details.${index}.unit`}
                          render={({ field }) => (
                            <FormItem>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {units.map((unit) => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Price Per Unit */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`expense_details.${index}.price_per_unit`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                  </span>
                                  <Input
                                    type="number"
                                    className="pl-8"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(
                                        Number.parseFloat(e.target.value) || 0
                                      );
                                      calculateItemTotal(index);
                                    }}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Total Price */}
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`expense_details.${index}.total_price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  value={formatToIDR(field.value)}
                                  readOnly
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      {/* Remove Button */}
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            remove(index);
                            // Recalculate totals after removing an item
                            setTimeout(() => calculateTotals(), 0);
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          disabled={fields.length === 1}
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

              {/* Summary Section */}
              <div className="flex justify-end mt-6">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Subtotal:</Label>
                    <FormField
                      control={form.control}
                      name="total_price"
                      render={({ field }) => (
                        <div className="text-right">
                          {formatToIDR(field.value)}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Label className="font-medium flex items-center gap-1">
                      <Tag size={14} />
                      Tax:
                    </Label>
                    <FormField
                      control={form.control}
                      name="tax_price"
                      render={({ field }) => (
                        <div className="text-right">
                          {formatToIDR(field.value)}
                        </div>
                      )}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <Label className="font-bold flex items-center gap-1">
                      <DollarSign size={14} />
                      Grand Total:
                    </Label>
                    <div className="text-right font-bold">
                      {formatToIDR(
                        form.getValues("total_price") +
                          form.getValues("tax_price")
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          {error && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">
              {success}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-black/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  }
);

ExpenseForm.displayName = "ExpenseForm";

export default ExpenseForm;
