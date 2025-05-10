"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table as TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';


const products = [
  {
    no: 1,
    code: "P1001",
    name: "Battery Terminal",
    price: 85.0,
    qty: 10,
    unit: "pcs",
    category: "Electrical",
    totalPrice: 850.0,
    status: "Processing",
  },
  {
    no: 2,
    code: "P1002",
    name: "Windshield Wiper",
    price: 95.0,
    qty: 5,
    unit: "pcs",
    category: "Accessories",
    totalPrice: 475.0,
    status: "Paid",
  },
  {
    no: 3,
    code: "P1003",
    name: "Transmission Fluid",
    price: 120.0,
    qty: 3,
    unit: "L",
    category: "Fluids",
    totalPrice: 360.0,
    status: "Paid",
  },
  {
    no: 4,
    code: "P1004",
    name: "Spark Plug",
    price: 150.0,
    qty: 4,
    unit: "pcs",
    category: "Electrical",
    totalPrice: 600.0,
    status: "Success",
  },
  {
    no: 5,
    code: "P1005",
    name: "Air Filter",
    price: 180.0,
    qty: 2,
    unit: "pcs",
    category: "Filters",
    totalPrice: 360.0,
    status: "Paid",
  },
  {
    no: 6,
    code: "P1006",
    name: "Brake Pad",
    price: 200.0,
    qty: 1,
    unit: "pcs",
    category: "Brakes",
    totalPrice: 200.0,
    status: "Success",
  },
  {
    no: 7,
    code: "P1007",
    name: "Oil Filter",
    price: 220.0,
    qty: 3,
    unit: "pcs",
    category: "Filters",
    totalPrice: 660.0,
    status: "Success",
  },
  {
    no: 8,
    code: "P1008",
    name: "Radiator Cap",
    price: 290.0,
    qty: 2,
    unit: "pcs",
    category: "Cooling",
    totalPrice: 580.0,
    status: "Processing",
  },
];

const ProductTable = () => {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.code.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
     <Card className="p-6">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Product Table</h2>
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[450px]">
          <TableContainer>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Name Product</TableHead>
                <TableHead>Price per Unit</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.code}>
                  <TableCell>{product.no}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.qty}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>
        </ScrollArea>
      </CardContent>
      <div className="flex justify-end mt-4">
        <Button variant="outline">Export</Button>
      </div>
    </Card>
  );
};

export default ProductTable;
