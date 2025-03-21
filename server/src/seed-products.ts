import { PrismaClient } from '@prisma/client';
import * as fs from 'fs/promises';
import * as path from 'path';

interface JsonProduct {
  id: string;
  photo: string;
  name: string;
  suppliers: string;
  stock: string;
  price: string;
  category: string;
}

async function main() {
  const prisma = new PrismaClient();

  try {
    // Clear existing products to avoid duplicates
    await prisma.product.deleteMany({});
    console.log('Cleared existing products');

    // Read products from JSON file
    const productsFilePath = path.join(process.cwd(), 'server/json/products.json');
    const data = await fs.readFile(productsFilePath, 'utf8');
    const jsonProducts = JSON.parse(data) as JsonProduct[];

    // Track unique product names to avoid duplicates
    const uniqueNames = new Set<string>();
    const uniqueProducts: JsonProduct[] = [];

    // Filter out duplicate products (based on name)
    jsonProducts.forEach((product) => {
      if (!uniqueNames.has(product.name)) {
        uniqueNames.add(product.name);
        uniqueProducts.push(product);
      }
    });

    // Create products in database
    for (const product of uniqueProducts) {
      await prisma.product.create({
        data: {
          name: product.name,
          photo: product.photo,
          supplier: product.suppliers,
          stock: product.stock,
          price: product.price,
          category: product.category,
        },
      });
    }

    console.log(`Seeded ${uniqueProducts.length} products`);
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Products seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during products seeding:', error);
    process.exit(1);
  });
