import { NextRequest, NextResponse } from 'next/server';
import { expenseOperations } from '@/lib/db';

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET /api/invoices/[id]
 * Retrieves a specific invoice by ID
 */
export async function GET(request: NextRequest, { params }: Params) {
    try {
        const { id } = params;
        const invoice = await expenseOperations.getById(id);
        
        if (!invoice) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ invoice });
    } catch (error) {
        console.error(`Error fetching invoice:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/invoices/[id]
 * Updates a specific invoice by ID
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const data = await request.json();
    const invoice = await expenseOperations.update(id, data);
    
    return NextResponse.json({ invoice });
  } catch (error) {
    console.error(`Error updating invoice:`, error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/invoices/[id]
 * Deletes a specific invoice by ID
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    await expenseOperations.delete(id);
    
    return NextResponse.json(
      { message: 'Invoice deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting invoice:`, error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}