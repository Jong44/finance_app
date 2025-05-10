"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import React from "react";
import { DollarSign } from "lucide-react";
import BarChartDashboard from "@/components/dashboard/bar-chart-dashboard";
import PieChartDashboard from "@/components/dashboard/pie-chart-dashboard";
import TableDashboard from "@/components/dashboard/table-dashboard";
const Dashbord = () => {
  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-10">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Expense Today</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp 0</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Expense Today</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp 0</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Expense Today</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp 0</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Expense Today</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp 0</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <BarChartDashboard />
        <PieChartDashboard/>
      </div>
      <TableDashboard/>
    </div>
  );
};

export default Dashbord;
