"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table as TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface ExpenseDetail {
  id: string;
  name_product: string;
  category: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_price: number;
  expenseId: string;
}

interface ProductTableProps {
  data: ExpenseDetail[];
}

const ProductTable: React.FC<ProductTableProps> = ({ data }) => {
  const [search, setSearch] = useState("");

  // Filter berdasarkan nama produk, kategori, atau ID expense
  const filteredProducts = data.filter(
    (product) =>
      product.name_product.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.expenseId.toLowerCase().includes(search.toLowerCase())
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
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price per Unit</TableHead>
                <TableHead>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.name_product}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>
                    Rp {product.price_per_unit.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    Rp {product.total_price.toLocaleString()}
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
