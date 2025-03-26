import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting data export...');

    const users = await prisma.user.findMany();
    fs.writeFileSync(
      path.join(process.cwd(), 'export', 'users.json'),
      JSON.stringify(users, null, 2),
    );
    console.log(`Exported ${users.length} users`);

    const customers = await prisma.customer.findMany();
    fs.writeFileSync(
      path.join(process.cwd(), 'export', 'customers.json'),
      JSON.stringify(customers, null, 2),
    );
    console.log(`Exported ${customers.length} customers`);

    const products = await prisma.product.findMany();
    fs.writeFileSync(
      path.join(process.cwd(), 'export', 'products.json'),
      JSON.stringify(products, null, 2),
    );
    console.log(`Exported ${products.length} products`);

    const suppliers = await prisma.supplier.findMany();
    fs.writeFileSync(
      path.join(process.cwd(), 'export', 'suppliers.json'),
      JSON.stringify(suppliers, null, 2),
    );
    console.log(`Exported ${suppliers.length} suppliers`);

    const transactions = await prisma.transaction.findMany();
    fs.writeFileSync(
      path.join(process.cwd(), 'export', 'transactions.json'),
      JSON.stringify(transactions, null, 2),
    );
    console.log(`Exported ${transactions.length} transactions`);

    const orders = await prisma.order.findMany();
    fs.writeFileSync(
      path.join(process.cwd(), 'export', 'orders.json'),
      JSON.stringify(orders, null, 2),
    );
    console.log(`Exported ${orders.length} orders`);

    console.log('Export completed successfully!');
  } catch (error) {
    console.error('Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Create export directory if it doesn't exist
if (!fs.existsSync(path.join(process.cwd(), 'export'))) {
  fs.mkdirSync(path.join(process.cwd(), 'export'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
