/**
 * This file provides a unified interface for database operations
 * combining Supabase for authentication and storage with Prisma for data modeling
 */

import { prisma } from './prisma';
import { supabase } from './supabase';

// Export both clients for direct access when needed
export { prisma, supabase };

// Helper function to get the current authenticated user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Example function for expense operations using Prisma
export const expenseOperations = {
    // Get all expenses
    getAll: async () => {
      return prisma.expense.findMany({
        include: { details: true },
        orderBy: { createdAt: 'desc' },
      });
    },
    
    // Get a single expense by ID
    getById: async (id: string) => {
      return prisma.expense.findUnique({
        where: { id },
        include: { details: true },
      });
    },
    
    // Create a new expense
    create: async (data: any) => {
      return prisma.expense.create({
        data: {
          code_receipt: data.code_receipt,
          name_supplier: data.name_supplier,
          note: data.note,
          date: new Date(data.date),
          total_price: data.total_price,
          tax_price: data.tax_price,
          details: {
            create: data.details.map((detail: any) => ({
              name_product: detail.name_product,
              category: detail.category,
              quantity: detail.quantity,
              unit: detail.unit,
              price_per_unit: detail.price_per_unit,
              total_price: detail.total_price,
            })),
          },
        },
        include: { details: true },
      });
    },
    
    // Update an existing expense
    update: async (id: string, data: any) => {
      // First delete all existing details
      await prisma.expenseDetail.deleteMany({
        where: { expenseId: id },
      });
      
      // Then update the expense with new details
      return prisma.expense.update({
        where: { id },
        data: {
          code_receipt: data.code_receipt,
          name_supplier: data.name_supplier,
          note: data.note,
          date: new Date(data.date),
          total_price: data.total_price,
          tax_price: data.tax_price,
          details: {
            create: data.details.map((detail: any) => ({
              name_product: detail.name_product,
              category: detail.category,
              quantity: detail.quantity,
              unit: detail.unit,
              price_per_unit: detail.price_per_unit,
              total_price: detail.total_price,
            })),
          },
        },
        include: { details: true },
      });
    },
    
    // Delete an expense
    delete: async (id: string) => {
      // First delete all details
      await prisma.expenseDetail.deleteMany({
        where: { expenseId: id },
      });
      
      // Then delete the expense
      return prisma.expense.delete({
        where: { id },
      });
    },
  };


// // Example function for invoice operations using Prisma
// export const invoiceOperations = {
//   // Get all invoices for the current user
//   getAll: async () => {
//     return prisma.invoice.findMany({
//       include: { items: true },
//       orderBy: { createdAt: 'desc' },
//     });
//   },
  
//   // Get a single invoice by ID
//   getById: async (id: string) => {
//     return prisma.invoice.findUnique({
//       where: { id },
//       include: { items: true },
//     });
//   },
  
//   // Create a new invoice
//   create: async (data: any) => {
//     return prisma.invoice.create({
//       data: {
//         invoiceTitle: data.invoiceTitle,
//         transactionDate: new Date(data.transactionDate),
//         items: {
//           create: data.items.map((item: any) => ({
//             description: item.description,
//             quantity: item.quantity,
//             price: item.price,
//             total: item.total,
//           })),
//         },
//       },
//       include: { items: true },
//     });
//   },
  
//   // Update an existing invoice
//   update: async (id: string, data: any) => {
//     // First delete all existing items
//     await prisma.item.deleteMany({
//       where: { invoiceId: id },
//     });
    
//     // Then update the invoice with new items
//     return prisma.invoice.update({
//       where: { id },
//       data: {
//         invoiceTitle: data.invoiceTitle,
//         transactionDate: new Date(data.transactionDate),
//         items: {
//           create: data.items.map((item: any) => ({
//             description: item.description,
//             quantity: item.quantity,
//             price: item.price,
//             total: item.total,
//           })),
//         },
//       },
//       include: { items: true },
//     });
//   },
  
//   // Delete an invoice
//   delete: async (id: string) => {
//     // First delete all items
//     await prisma.item.deleteMany({
//       where: { invoiceId: id },
//     });
    
//     // Then delete the invoice
//     return prisma.invoice.delete({
//       where: { id },
//     });
//   },
// };

