-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "photo" TEXT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "products" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "order_date" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
