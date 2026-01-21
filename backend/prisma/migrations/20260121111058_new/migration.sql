/*
  Warnings:

  - Added the required column `amount` to the `BillPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BillPayment" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Paymentbill" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "goalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Paymentbill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Paymentbill" ADD CONSTRAINT "Paymentbill_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paymentbill" ADD CONSTRAINT "Paymentbill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
