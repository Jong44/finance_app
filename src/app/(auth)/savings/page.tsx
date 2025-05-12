"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, PlusCircle, PlusCircleIcon } from "lucide-react";
import BudgetForm from "@/components/savings/budget-form";

const savingsGoals = [
  { name: "Trip to Bali", target: 10000000, saved: 7500000 },
  { name: "Emergency Fund", target: 5000000, saved: 3000000 },
  { name: "New Laptop", target: 15000000, saved: 8000000 },
];

const Savings = () => {
  const mainGoal = savingsGoals[0]; // Main savings goal (Trip to Bali)
  const remainingAmount = mainGoal.target - mainGoal.saved;
  const mainProgress = Math.round((mainGoal.saved / mainGoal.target) * 100);
  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-10">Savings Overview</h1>
      <div className="flex flex-row-reverse justify-between w-full gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 h-fit">
          {savingsGoals.map((goal, index) => {
            const progress = Math.round((goal.saved / goal.target) * 100);
            return (
              <Card
                key={index}
                className="p-4 h-40"
              >
                <CardTitle className="text-lg font-bold">
                  <p className="mb-1">{goal.name}</p>
                  <CardDescription className="text-xs text-gray-400 mb-2 font-normal">
                    {progress}% Complete
                  </CardDescription>
                </CardTitle>

                <Progress value={progress} className="h-3 rounded-full" />
                <div className="flex justify-between text-sm mt-2">
                  <span>Rp {goal.saved.toLocaleString()}</span>
                  <span>Rp {goal.target.toLocaleString()}</span>
                </div>
              </Card>
            );
          })}
          <Card
                className="p-4 h-40 flex justify-center items-center text-lg font-bold"
              >
                <PlusCircleIcon size={'40'}/>
                  <p className="mb-1">Add Savings</p>
              </Card>
        </div>
        <div className="w-1/2">
          <Card
            className="p-4 h-40 mb-4"
          >
            <CardTitle className="text-lg font-bold">
              <p className="mb-1">Total Savings</p>
              <CardDescription className="text-xs text-gray-400 mb-2 font-normal">
                {mainProgress}% Complete
              </CardDescription>
            </CardTitle>
            <Progress value={mainProgress} className="h-3 rounded-full" />
            <div className="flex justify-between text-sm mt-2">
              <span>Rp {mainGoal.saved.toLocaleString()}</span>
              <span>Rp {mainGoal.target.toLocaleString()}</span>
            </div>
          </Card>
          <BudgetForm />
        </div>
      </div>
    </div>
  )
}

export default Savings