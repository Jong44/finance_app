"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlusCircleIcon } from "lucide-react";
import BudgetForm from "@/components/savings/budget-form";
import AddEditSavingsModal from "@/components/savings/add-savings";

interface SavingsGoal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
}

const Savings = () => {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  useEffect(() => {
    const fetchSavingsGoals = async () => {
      try {
        const response = await fetch("/api/savings");
        if (!response.ok) throw new Error("Failed to fetch savings goals");

        const data: SavingsGoal[] = await response.json();
        setSavingsGoals(data);
      } catch (error) {
        console.error("Error loading savings goals:", error);
        setError("Failed to load savings goals. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsGoals();
  }, []);

  const totalTarget = savingsGoals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const overallProgress = Math.round((totalSaved / totalTarget) * 100) || 0;

  const handleSave = async (goal: SavingsGoal) => {
    try {
      const response = await fetch("/api/savings", {
        method: goal.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goal),
      });

      if (!response.ok) throw new Error("Failed to save savings goal");

      // Refresh the goal list
      const data: SavingsGoal = await response.json();
      setSavingsGoals((prevGoals) => {
        if (goal.id) {
          return prevGoals.map((g) => (g.id === data.id ? data : g));
        }
        return [...prevGoals, data];
      });

      setEditingGoal(null);
    } catch (error) {
      console.error("Error saving savings goal:", error);
      setError("Failed to save savings goal. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-10">Savings Overview</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-row-reverse justify-between w-full gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 h-fit">
          {savingsGoals.map((goal) => {
            const progress = Math.round((goal.current_amount / goal.target_amount) * 100);
            return (
              <Card key={goal.id} className="p-4 h-40">
                <CardTitle className="text-lg font-bold">
                  <p className="mb-1">{goal.name}</p>
                  <CardDescription className="text-xs text-gray-400 mb-2 font-normal">
                    {progress}% Complete
                  </CardDescription>
                </CardTitle>

                <Progress value={progress} className="h-3 rounded-full" />
                <div className="flex justify-between text-sm mt-2">
                  <span>Rp {goal.current_amount.toLocaleString()}</span>
                  <span>Rp {goal.target_amount.toLocaleString()}</span>
                </div>
              </Card>
            );
          })}

          {/* Add Savings Card */}
          <Card
            className="p-4 h-40 flex flex-col justify-center items-center cursor-pointer"
            onClick={() => setModalOpen(true)}
          >
            <PlusCircleIcon size={40} />
            <p className="mt-2 font-bold">Add Savings</p>
          </Card>
        </div>

        {/* Total Savings Card */}
        <div className="w-1/2">
          <Card className="p-4 h-40 mb-4">
            <CardTitle className="text-lg font-bold">
              <p className="mb-1">Total Savings</p>
              <CardDescription className="text-xs text-gray-400 mb-2 font-normal">
                {overallProgress}% Complete
              </CardDescription>
            </CardTitle>
            <Progress value={overallProgress} className="h-3 rounded-full" />
            <div className="flex justify-between text-sm mt-2">
              <span>Rp {totalSaved.toLocaleString()}</span>
              <span>Rp {totalTarget.toLocaleString()}</span>
            </div>
          </Card>
          <BudgetForm />
          <AddEditSavingsModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingGoal(null);
          }}
          onSave={handleSave}
          defaultValues={editingGoal || undefined}
        />
        </div>
      </div>
    </div>
  );
};

export default Savings;
