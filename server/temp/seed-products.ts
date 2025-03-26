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
    await prisma.product.deleteMany({});
    console.log('Cleared existing products');

    const possiblePaths = [
      path.join(process.cwd(), 'json', 'products.json'),
      path.resolve(__dirname, '..', 'json', 'products.json'),
      path.join(process.cwd(), 'server', 'json', 'products.json'),
    ];

    let jsonProducts: JsonProduct[] = [];
    let filePath = '';

    for (const potentialPath of possiblePaths) {
      try {
        if (
          await fs
            .stat(potentialPath)
            .then(() => true)
            .catch(() => false)
        ) {
          filePath = potentialPath;
          console.log(`Found products.json at: ${filePath}`);
          const data = await fs.readFile(filePath, 'utf8');
          jsonProducts = JSON.parse(data);
          break;
        }
      } catch (e) {
        console.error(`Error checking path ${potentialPath}:`, e);
      }
    }

    if (!filePath || jsonProducts.length === 0) {
      console.error(
        'Could not find products.json file or file is empty. Checked paths:',
        possiblePaths,
      );
      return;
    }

    const uniqueNames = new Set<string>();
    const uniqueProducts: JsonProduct[] = [];

    jsonProducts.forEach((product) => {
      if (!uniqueNames.has(product.name)) {
        uniqueNames.add(product.name);
        uniqueProducts.push(product);
      }
    });

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
