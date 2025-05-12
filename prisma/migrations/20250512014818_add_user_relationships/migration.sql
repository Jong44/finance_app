-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create a default user for existing records
INSERT INTO "User" ("id", "email", "updatedAt") 
VALUES ('default-user-id', 'default@example.com', CURRENT_TIMESTAMP);

-- AlterTable: Add userId columns as nullable first
ALTER TABLE "Expense" ADD COLUMN "userId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "userId" TEXT;

-- Update existing records to use the default user
UPDATE "Expense" SET "userId" = 'default-user-id' WHERE "userId" IS NULL;
UPDATE "Invoice" SET "userId" = 'default-user-id' WHERE "userId" IS NULL;

-- Now make the columns NOT NULL
ALTER TABLE "Expense" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Invoice" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
