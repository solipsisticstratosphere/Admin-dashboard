import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface OrderData {
  photo: string;
  name: string;
  address: string;
  products: string;
  price: string;
  status: string;
  order_date: string;
}

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log('Starting order seeding script...');

    const ordersCount = await prisma.order.count();
    console.log(`Found ${ordersCount} existing orders`);

    if (ordersCount > 0) {
      console.log('Orders already exist. Deleting existing orders...');
      await prisma.order.deleteMany({});
      console.log('All existing orders deleted');
    }

    const possiblePaths = [
      path.join(process.cwd(), 'server', 'json', 'orders.json'),
      path.join(process.cwd(), 'json', 'orders.json'),
      path.resolve(__dirname, '..', 'json', 'orders.json'),
    ];

    let ordersData: OrderData[] = [];
    let filePath = '';

    for (const potentialPath of possiblePaths) {
      try {
        if (fs.existsSync(potentialPath)) {
          filePath = potentialPath;
          console.log(`Found orders.json at: ${filePath}`);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          ordersData = JSON.parse(fileContent);
          break;
        }
      } catch (e) {
        console.error(`Error checking path ${potentialPath}:`, e);
      }
    }

    if (!filePath || ordersData.length === 0) {
      console.error(
        'Could not find orders.json file or file is empty. Checked paths:',
        possiblePaths,
      );
      return;
    }

    console.log(`Parsed ${ordersData.length} orders from JSON file`);

    console.log('Inserting orders...');
    for (let i = 0; i < ordersData.length; i++) {
      const order = ordersData[i];
      await prisma.order.create({
        data: {
          id: i + 1,
          photo: order.photo,
          name: order.name,
          address: order.address,
          products: order.products,
          price: order.price,
          status: order.status,
          order_date: order.order_date,
        },
      });
      console.log(`Created order ${i + 1}/${ordersData.length}`);
    }

    console.log('Order seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Seeding script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running seed script:', error);
    process.exit(1);
  });
