import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

// Define the extended PrismaClient type that includes all models
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Make sure Prisma Client is properly typed with all models including User

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
      log: ['query', 'error', 'warn'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;