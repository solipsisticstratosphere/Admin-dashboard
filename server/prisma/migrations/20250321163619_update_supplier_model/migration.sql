/*
  Warnings:

  - You are about to rename the column `supplier` on the `suppliers` table to `company`.

*/
-- AlterTable
ALTER TABLE "suppliers" RENAME COLUMN "supplier" TO "company";
ALTER TABLE "suppliers" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "suppliers" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
