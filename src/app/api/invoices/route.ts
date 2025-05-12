import { NextRequest, NextResponse } from 'next/server';
import { expenseOperations } from '@/lib/db';
import { getCurrentUser } from '@/lib/db';

/**
 * GET /api/invoices
 * Retrieves all invoices
 */

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }
    const invoices = await expenseOperations.getAll(currentUser.id);
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
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    console.log(currentUser);

    const invoice = await expenseOperations.create(data, currentUser.id);
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}