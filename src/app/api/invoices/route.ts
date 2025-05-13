import { NextRequest, NextResponse } from 'next/server';
import { expenseOperations } from '@/lib/db';
import { getCurrentUser } from '@/lib/db';

/**
 * GET /api/invoices
 * Retrieves all invoices
 */

export async function GET() {
  try {
    const invoices = await expenseOperations.getAll("e668ff86-da33-4265-91c8-dea37a4432fc");
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
  
  // console.log(request); // Add this line to log the request detai

  try {
    const data = await request.json();


    const invoice = await expenseOperations.create(data, "e668ff86-da33-4265-91c8-dea37a4432fc");
    return NextResponse.json({ success: true, data: invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return  NextResponse.json({
    status: false,
    data: error
  })
  }
}