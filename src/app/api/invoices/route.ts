import { NextRequest, NextResponse } from 'next/server';
import { expenseOperations } from '@/lib/db';

/**
 * GET /api/invoices
 * Retrieves all invoices
 */
export async function GET() {
  try {
    const invoices = await expenseOperations.getAll();
    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices
 * Creates a new invoice
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const invoice = await expenseOperations.create(data);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}