"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import React, { useEffect } from "react";
import { DollarSign } from "lucide-react";
import BarChartDashboard from "@/components/dashboard/bar-chart-dashboard";
import PieChartDashboard from "@/components/dashboard/pie-chart-dashboard";
import TableDashboard from "@/components/dashboard/table-dashboard";
import BarChartMixedDashboard from "@/components/dashboard/bar-chart-mixed-dashboad";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/router";
const Dashbord = () => {
  const router = useRouter();
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };
    checkSession();
  }, [router]);
  return (
    <div className="p-6">
      <h1 className="font-bold text-3xl mb-10">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Total Daily Expenses</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">Rp 150,000</CardContent>
        </Card>

        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Monthly Savings Progress</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            Rp 2,500,000 <span className="text-sm text-muted-foreground">/ Rp 5,000,000</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-sm flex justify-between items-center">
            <p>Budget Status</p>
            <DollarSign size={"16"} />
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            On Track <span className="text-sm text-chart-5">+10%</span>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <BarChartDashboard />
        <PieChartDashboard />
      </div>
      <TableDashboard />
    </div>
  );
};

export default Dashbord;
