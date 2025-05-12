/**
 * This file provides a unified interface for database operations
 * combining Supabase for authentication and storage with Prisma for data modeling
 */

import { prisma } from './prisma';
import { supabase } from './supabase';

// Export both clients for direct access when needed
export { prisma, supabase };

// Helper function to get the current authenticated user and ensure they exist in the database
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  
  const supabaseUser = data.user;
  if (!supabaseUser) return null;
  
  // Check if user exists in our database, if not create them
  let user = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
  });
  
  if (!user) {
    // Create new user record
    user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
      },
    });
  }
  
  return user;
}

// Example function for expense operations using Prisma
export const expenseOperations = {
    // Get all expenses for a specific user
    getAll: async (userId: string) => {
      return prisma.expense.findMany({
        where: { userId },
        include: { details: true },
        orderBy: { createdAt: 'desc' },
      });
    },
    
    // Get a single expense by ID (ensuring it belongs to the user)
    getById: async (id: string, userId: string) => {
      return prisma.expense.findUnique({
        where: { id, userId },
        include: { details: true },
      });
    },
    
    // Create a new expense for a user
    create: async (data: any, userId: string) => {
      return prisma.expense.create({
        data: {
          code_receipt: data.code_receipt,
          name_supplier: data.name_supplier,
          note: data.note,
          date: new Date(data.date),
          total_price: data.total_price,
          tax_price: data.tax_price,
          userId,
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
    
    // Update an existing expense (ensuring it belongs to the user)
    update: async (id: string, data: any, userId: string) => {
      // First verify the expense belongs to the user
      const expense = await prisma.expense.findUnique({
        where: { id, userId },
      });
      
      if (!expense) {
        throw new Error('Expense not found or you do not have permission to update it');
      }
      
      // Delete all existing details
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
    
    // Delete an expense (ensuring it belongs to the user)
    delete: async (id: string, userId: string) => {
      // First verify the expense belongs to the user
      const expense = await prisma.expense.findUnique({
        where: { id, userId },
      });
      
      if (!expense) {
        throw new Error('Expense not found or you do not have permission to delete it');
      }
      
      // Delete all details
      await prisma.expenseDetail.deleteMany({
        where: { expenseId: id },
      });
      
      // Then delete the expense
      return prisma.expense.delete({
        where: { id },
      });
    },
  };


// Example function for invoice operations using Prisma
export const invoiceOperations = {
  // Get all invoices for a specific user
  getAll: async (userId: string) => {
    return prisma.invoice.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  },
  
  // Get a single invoice by ID (ensuring it belongs to the user)
  getById: async (id: string, userId: string) => {
    return prisma.invoice.findUnique({
      where: { id, userId },
      include: { items: true },
    });
  },
  
  // Create a new invoice for a user
  create: async (data: any, userId: string) => {
    return prisma.invoice.create({
      data: {
        invoiceTitle: data.invoiceTitle,
        transactionDate: new Date(data.transactionDate),
        userId,
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });
  },
  
  // Update an existing invoice (ensuring it belongs to the user)
  update: async (id: string, data: any, userId: string) => {
    // First verify the invoice belongs to the user
    const invoice = await prisma.invoice.findUnique({
      where: { id, userId },
    });
    
    if (!invoice) {
      throw new Error('Invoice not found or you do not have permission to update it');
    }
    
    // Delete all existing items
    await prisma.item.deleteMany({
      where: { invoiceId: id },
    });
    
    // Then update the invoice with new items
    return prisma.invoice.update({
      where: { id },
      data: {
        invoiceTitle: data.invoiceTitle,
        transactionDate: new Date(data.transactionDate),
        items: {
          create: data.items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
      include: { items: true },
    });
  },
  
  // Delete an invoice (ensuring it belongs to the user)
  delete: async (id: string, userId: string) => {
    // First verify the invoice belongs to the user
    const invoice = await prisma.invoice.findUnique({
      where: { id, userId },
    });
    
    if (!invoice) {
      throw new Error('Invoice not found or you do not have permission to delete it');
    }
    
    // Delete all items
    await prisma.item.deleteMany({
      where: { invoiceId: id },
    });
    
    // Then delete the invoice
    return prisma.invoice.delete({
      where: { id },
    });
  },
};

