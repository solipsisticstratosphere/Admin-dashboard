/*
  Warnings:

  - A unique constraint covering the columns `[name,supplier]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_name_supplier_key" ON "products"("name", "supplier");
