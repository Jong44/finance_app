"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const BudgetForm = () => {
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [needs, setNeeds] = useState("");
  const [wants, setWants] = useState("");

  const handleCalculate = () => {
    if (!income || isNaN(Number(income))) return;

    // Calculate 50/30/20
    const totalIncome = Number(income);
    setSavings((totalIncome * 0.2).toLocaleString());
    setNeeds((totalIncome * 0.5).toLocaleString());
    setWants((totalIncome * 0.3).toLocaleString());
  };

  return (
    <Card className="p-6">
      {/* Input Income */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Input Income</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Input your income and get your financial balance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <label className="block mb-2 text-sm font-medium">Nominal</label>
        <Input
          placeholder="Rp -"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          className="mb-6"
        />

        {/* 50/30/20 Recommendation */}
        <CardTitle className="text-md font-semibold mb-2">Recommendation using 50/30/20 rules</CardTitle>
        <label className="block mb-2 text-sm font-medium">Savings</label>
        <Input value={savings} readOnly placeholder="Rp -" className="mb-4" />

        <label className="block mb-2 text-sm font-medium">Needs</label>
        <Input value={needs} readOnly placeholder="Rp -" className="mb-4" />

        <label className="block mb-2 text-sm font-medium">Wants</label>
        <Input value={wants} readOnly placeholder="Rp -" className="mb-6" />

        {/* Custom Rules */}
        <CardTitle className="text-md font-semibold mb-2">Custom Rules</CardTitle>
        <div className="grid grid-cols-3 gap-2">
          <Input placeholder="Savings - %" />
          <Input placeholder="Needs - %" />
          <Input placeholder="Wants - %" />
        </div>

        {/* Submit Button */}
        <Button onClick={handleCalculate} className="w-full mt-6 bg-black text-white py-2">
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

export default BudgetForm;
