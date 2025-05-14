"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { Receipt, Calendar, User, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// lib/zod-schema.ts
import { z } from "zod";
import { Button } from "@/components/ui/button";
import BudgetForm from "@/components/savings/budget-form";

// Define the Zod validation schema
export const personalitySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age: z
    .number()
    .min(18, { message: "Age must be at least 18" })
    .max(120, { message: "Age must be under 120" }),
  profession: z.string().min(1, { message: "Profession is required" }),
  income: z.number().min(0, { message: "Income must be a positive number" }),
  expenses_foods: z
    .number()
    .min(0, { message: "Expenses (Food) must be a positive number" }),
  expenses_transportation: z
    .number()
    .min(0, { message: "Expenses (Transportation) must be a positive number" }),
  expenses_entertainment: z
    .number()
    .min(0, { message: "Expenses (Entertainment) must be a positive number" }),
  expenses_others: z
    .number()
    .min(0, { message: "Expenses (Other) must be a positive number" }),
  is_saving: z.boolean(),
});

const Page = () => {
  const personalityId = "bff9f281-1162-4a2f-a501-1ff8f0616205"; // Replace with actual ID from URL or state
  const [personalityData, setPersonalityData] = useState<any | null>(null);
  const [income, setIncome] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const form = useForm({
    resolver: zodResolver(personalitySchema),
    defaultValues: {
      name: "",
      age: 0,
      profession: "",
      income: 0,
      expenses_foods: 0,
      expenses_transportation: 0,
      expenses_entertainment: 0,
      expenses_others: 0,
      is_saving: false,
    },
  });

  // Fetch the existing personality data when the page loads
  useEffect(() => {
    const fetchPersonality = async () => {
      try {
        const response = await fetch(`/api/personality/${personalityId}`);

        console.log("Response from API:", response);

        // Check if the response is okay (status code 2xx)
        if (!response.ok) {
          throw new Error("Failed to fetch personality data");
        }

        const data = await response.json();

        // Check if the data is valid
        if (data) {
          setIncome(data.income);
          setPersonalityData(data);
          form.reset(data); // Pre-fill the form with fetched data
        } else {
          console.error("No data returned from the API");
        }
      } catch (error) {
        console.error("Error fetching personality data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (personalityId) {
      fetchPersonality();
    }
  }, [personalityId, form]);

  // Handle form submission (Create or Update)
  const onSubmit = async (data: any) => {
    try {
      const method = personalityData ? "PUT" : "POST"; // Use PUT if editing existing, otherwise POST for creating new
      const url = personalityData
        ? `/api/personality/${personalityId}` // Update existing
        : "/api/personality"; // Create new

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error("Failed to save personality data");
      }

      const result = await response.json();

      // Handle the response from the backend
      console.log("Personality data saved successfully:", result);
    } catch (error) {
      console.error("An error occurred during submission:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="flex flex-col">
      <div className="w-full p-4 rounded-lg">
        <h1 className="text-2xl font-bold">
          {personalityData ? "Edit" : "Create"} Personality
        </h1>
        <p className="text-gray-600">This personality page!</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personality Details Card */}
          <Card>
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle>Personality Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User size={16} />
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Age */}
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar size={16} />
                        Age
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Profession */}
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User size={16} />
                        Profession
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Income */}
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt size={16} />
                        Income
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                            setIncome(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expenses: Foods */}
                <FormField
                  control={form.control}
                  name="expenses_foods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt size={16} />
                        Expenses (Food)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expenses: Transportation */}
                <FormField
                  control={form.control}
                  name="expenses_transportation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt size={16} />
                        Expenses (Transportation)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expenses: Entertainment */}
                <FormField
                  control={form.control}
                  name="expenses_entertainment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt size={16} />
                        Expenses (Entertainment)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Expenses: Others */}
                <FormField
                  control={form.control}
                  name="expenses_others"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Receipt size={16} />
                        Expenses (Other)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(parseFloat(e.target.value) || 0);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Saving Status */}
                <FormField
                  control={form.control}
                  name="is_saving"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText size={16} />
                        Is Saving?
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-4 h-4"
                          type="checkbox"
                          checked={field.value}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  className="btn btn-primary"
                  title="Submit"
                >
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <BudgetForm income={income} />
    </div>
  );
};

export default Page;
