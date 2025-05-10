import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip } from "@radix-ui/react-tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const data = {
  categoryFrequency: [
    { name: "Beverage", value: 1 },
    { name: "Miscellaneous", value: 2 },
    { name: "Dairy", value: 5 },
    { name: "Household", value: 5 },
    { name: "Snack", value: 2 },
    { name: "Milk", value: 10 },
  ],
  supplierFrequency: [
    { name: "Circle K", value: 1 },
    { name: "Indomaret", value: 4 },
    { name: "Bee BEC Klampis Jaya 29j", value: 3 },
  ],
  totalExpenseByCategory: [
    { name: "Beverage", value: 10000 },
    { name: "Miscellaneous", value: 20000 },
    { name: "Dairy", value: 150000 },
    { name: "Household", value: 100000 },
    { name: "Snack", value: 50000 },
    { name: "Milk", value: 200000 },
  ],
  totalExpenseBySupplier: [
    { name: "Circle K", value: 29200 },
    { name: "Bee BEC Klampis Jaya 21", value: 2138000 },
    { name: "Indomaret", value: 1069000 },
    { name: "PT. Makmur", value: 762300 },
    { name: "Bee BEC Klampis Jaya 29j", value: 488000 },
  ],
};

import React from 'react'

const Dashbord = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="font-semibold text-xl">Expense Today</CardHeader>
          <CardContent className="">Rp 0</CardContent>
        </Card>
        <Card>
          <CardHeader className="font-semibold text-xl">Expense in Week</CardHeader>
          <CardContent className="">Rp 0</CardContent>
        </Card>
        <Card>
          <CardHeader className="font-semibold text-xl">Expense in Month</CardHeader>
          <CardContent className="">Rp 1.093.400</CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
      </div>
    </div>
  )
}

export default Dashbord