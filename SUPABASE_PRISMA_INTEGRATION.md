# Supabase and Prisma Integration

This document explains how Supabase and Prisma have been integrated into the Finance App project.

## Overview

This integration combines:
- **Supabase**: For authentication, real-time features, and storage
- **Prisma**: For type-safe database access and schema management

## Setup Details

### Environment Variables

The project uses the following environment variables (already configured in `.env`):

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mpyaztlxjubzeikkulbl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Prisma Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.mpyaztlxjubzeikkulbl:%2F22Maret2005@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.mpyaztlxjubzeikkulbl:%2F22Maret2005@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### Key Files

1. **`src/lib/supabase.ts`**: Initializes the Supabase client
2. **`src/lib/prisma.ts`**: Initializes the Prisma client with best practices for Next.js
3. **`src/lib/db.ts`**: Combines Supabase and Prisma functionality for database operations
4. **`src/lib/auth.ts`**: Authentication utilities using Supabase Auth
5. **`src/middleware.ts`**: Protects routes and handles session management

## Database Schema

The Prisma schema (`prisma/schema.prisma`) defines the following models:

- **Invoice**: For storing invoice information
- **Item**: For storing invoice line items
- **Expense**: For tracking expenses
- **ExpenseDetail**: For storing expense line items

## API Routes

The following API routes have been implemented:

- **`/api/invoices`**: GET (list all), POST (create new)
- **`/api/invoices/[id]`**: GET (single), PUT (update), DELETE (remove)

## Usage Examples

### Authentication

```typescript
import { signIn, signUp, signOut } from '@/lib/auth';

// Sign in
await signIn({ email: 'user@example.com', password: 'password' });

// Sign up
await signUp({ 
  email: 'newuser@example.com', 
  password: 'password',
  name: 'New User' 
});

// Sign out
await signOut();
```

### Database Operations

```typescript
import { invoiceOperations, expenseOperations } from '@/lib/db';

// Get all invoices
const invoices = await invoiceOperations.getAll();

// Create a new invoice
const newInvoice = await invoiceOperations.create({
  invoiceTitle: 'New Invoice',
  transactionDate: '2023-05-15',
  items: [
    {
      description: 'Item 1',
      quantity: 2,
      price: 10.99,
      total: 21.98
    }
  ]
});
```

## Next Steps

1. Implement UI components for authentication
2. Create forms for invoice and expense management
3. Add data visualization for financial reporting
4. Implement user profile management

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)