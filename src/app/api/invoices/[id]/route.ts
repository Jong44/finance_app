import { NextRequest, NextResponse } from 'next/server';
import { expenseOperations } from '@/lib/db';
import { getCurrentUser } from '@/lib/db';

/**
 * GET /api/invoices
 * Retrieves all invoices
 */

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET /api/invoices/[id]
 * Retrieves a specific invoice by ID
 */
export async function GET(request: NextRequest, Params:any) {
    try {
        const { id } = Params;
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const invoice = await expenseOperations.getById(id, currentUser.id);
        
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
export async function PUT(request: NextRequest,  Params: any) {
  try {
    const { id } = Params;
    const data = await request.json();

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const invoice = await expenseOperations.update(id, data, currentUser.id);
    
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
export async function DELETE(request: NextRequest, Params:any) {
  try {
    const { id } = Params;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    await expenseOperations.delete(id, currentUser.id);
    
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