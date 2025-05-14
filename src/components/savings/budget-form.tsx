"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // for navigation after submit
import { parse } from "path";

const BudgetForm = ({ income = 0 }: { income: number }) => {
  const budgetId = "117c88fc-849e-4792-a161-d1a3295c50b0";
  
  const router = useRouter();
  const [needs, setNeeds] = useState("");
  const [wants, setWants] = useState("");
  const [savings, setSavings] = useState("");

  const [customSavings, setCustomSavings] = useState("");
  const [customNeeds, setCustomNeeds] = useState("");
  const [customWants, setCustomWants] = useState("");

  useEffect(() => {
    if (budgetId) {
      // Fetch existing budget overview for editing
      const fetchBudgetOverview = async () => {
        const response = await fetch(`/api/budget/${budgetId}`);
        const data = await response.json();

        console.log("Fetched budget overview:", data);
        setCustomNeeds(data.needs);
        setCustomWants(data.wants);
        setCustomSavings(data.savings);
      };
      fetchBudgetOverview();
    }
    handleCalculate(); // Calculate initial values based on income
  }, [budgetId, income]);

  const handleCalculate = () => {
    console.log("Calculating budget...");
    if (!income || isNaN(Number(income))) return;

    if (
      parseFloat(customSavings) +
        parseFloat(customNeeds) +
        parseFloat(customWants) >
      income
    ) {
      alert("Total budget cannot exceed income");
      return;
    }

    // Calculate the actual amounts based on percentages and income
    const totalIncome = Number(income);
    setSavings(
      ((totalIncome * (parseFloat(customSavings) || 20)) / 100).toLocaleString()
    );
    setNeeds(
      ((totalIncome * (parseFloat(customNeeds) || 50)) / 100).toLocaleString()
    );
    setWants(
      ((totalIncome * (parseFloat(customWants) || 30)) / 100).toLocaleString()
    );
  };

  const handleSubmit = async () => {
    const method = budgetId ? "PUT" : "POST"; // If budgetId exists, update, else create

    const data = {
      savings: customSavings ? parseFloat(customSavings) : 20,
      needs: customNeeds ? parseFloat(customNeeds) : 50,
      wants: customWants ? parseFloat(customWants) : 30,
    };

    const response = await fetch(
      `/api/budget${budgetId ? `/${budgetId}` : ""}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      // After success, navigate back to the overview page or the desired route
      alert("Budget overview submitted successfully!");
    } else {
      console.error("Error submitting budget overview");
    }
  };

  return (
    <Card className="p-6 my-5">
      {/* Input Income */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Budgeting Form</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Calculate your budget using the 50/30/20 rule or set your own custom
          rules.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* 50/30/20 Recommendation */}
        <CardTitle className="text-md font-semibold mb-2">
          Recommendation using 50/30/20 rules
        </CardTitle>
        <label className="block mb-2 text-sm font-medium">Savings</label>
        <Input value={savings} readOnly placeholder="Rp -" className="mb-4" />

        <label className="block mb-2 text-sm font-medium">Needs</label>
        <Input value={needs} readOnly placeholder="Rp -" className="mb-4" />

        <label className="block mb-2 text-sm font-medium">Wants</label>
        <Input value={wants} readOnly placeholder="Rp -" className="mb-6" />

        {/* Custom Rules */}
        <CardTitle className="text-md font-semibold mb-2">
          Custom Rules
        </CardTitle>
        <div className="grid grid-cols-3 gap-2">
          <Input
            max={100}
            min={0}
            placeholder="Savings - %"
            value={customSavings}
            onChange={(e) => {
              setCustomSavings(e.target.value);
              handleCalculate();
            }}
          />
          <Input
            max={100}
            min={0}
            placeholder="Needs - %"
            value={customNeeds}
            onChange={(e) => {
              setCustomNeeds(e.target.value);
              handleCalculate();
            }}
          />
          <Input
            max={100}
            min={0}
            placeholder="Wants - %"
            value={customWants}
            onChange={(e) => {
              setCustomWants(e.target.value);
              handleCalculate();
            }}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSubmit}
            className="mt-6 bg-black text-white py-2"
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;
