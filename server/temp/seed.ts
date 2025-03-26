import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@email.com' },
    });

    if (!existingUser) {
      // Hash password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Create admin user
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@email.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
        },
      });

      console.log('Admin user created successfully:', newUser.email);
    } else {
      console.log('Admin user already exists');
    }

    // Import customers
    const customersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../json/customers.json'), 'utf-8'),
    );

    for (const customer of customersData) {
      await prisma.customer.upsert({
        where: { email: customer.email },
        update: {},
        create: {
          photo: customer.photo || customer.image,
          name: customer.name,
          email: customer.email,
          spent: customer.spent,
          phone: customer.phone,
          address: customer.address,
          registerDate: new Date(customer.register_date || Date.now()),
        },
      });
    }

    // Import products
    const productsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../json/products.json'), 'utf-8'),
    );

    for (const product of productsData) {
      await prisma.product.upsert({
        where: { id: Number(product.id) },
        update: {},
        create: {
          id: Number(product.id),
          photo: product.photo,
          name: product.name,
          supplier: product.suppliers,
          stock: product.stock,
          price: product.price,
          category: product.category,
        },
      });
    }

    // Import suppliers
    const suppliersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../json/suppliers.json'), 'utf-8'),
    );

    for (const supplier of suppliersData) {
      await prisma.supplier.create({
        data: {
          name: supplier.name,
          address: supplier.address,
          company: supplier.suppliers,
          date: new Date(supplier.date),
          amount: supplier.amount,
          status: supplier.status,
        },
      });
    }

    // Import income-expenses data
    const transactionsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../json/Income-Expenses.json'), 'utf-8'),
    );

    for (const transaction of transactionsData) {
      await prisma.transaction.create({
        data: {
          name: transaction.name,
          amount: transaction.amount,
          type: transaction.type,
        },
      });
    }

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
