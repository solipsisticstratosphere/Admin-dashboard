import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

interface UserData {
  id: number;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  refreshToken: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CustomerData {
  id: number;
  photo: string | null;
  name: string;
  email: string;
  spent: string;
  phone: string;
  address: string;
  registerDate: string;
  country: string | null;
}

interface TransactionData {
  id: number;
  name: string;
  amount: string;
  type: string;
  email: string | null;
  customerId: number | null;
  createdAt: string;
}

// Сначала очистим все существующие данные в Supabase
async function clearAllData() {
  console.log('Clearing existing data from Supabase...');

  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    // Очищаем таблицы в правильном порядке (с учетом foreign key constraints)
    await prisma.transaction.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.customer.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.supplier.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('All existing data cleared from Supabase');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importUsers() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    console.log('Importing users...');
    const fileContent = fs.readFileSync(path.join(process.cwd(), 'export', 'users.json'), 'utf-8');
    const usersData: UserData[] = JSON.parse(fileContent);

    // Используем rawQuery для импорта
    for (const user of usersData) {
      const query = `
        INSERT INTO "public"."users" 
        ("email", "password", "firstName", "lastName", "refreshToken", "createdAt", "updatedAt")
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      `;

      await prisma.$executeRawUnsafe(
        query,
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.refreshToken,
        new Date(user.createdAt),
        new Date(user.updatedAt),
      );
    }
    console.log(`Imported ${usersData.length} users`);
  } catch (error) {
    console.error('Error importing users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importCustomers() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    console.log('Importing customers...');
    const fileContent = fs.readFileSync(
      path.join(process.cwd(), 'export', 'customers.json'),
      'utf-8',
    );
    const customersData: CustomerData[] = JSON.parse(fileContent);

    // Используем rawQuery для импорта
    for (const customer of customersData) {
      const query = `
        INSERT INTO "public"."customers" 
        ("id", "photo", "name", "email", "spent", "phone", "address", "registerDate", "country")
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `;

      await prisma.$executeRawUnsafe(
        query,
        customer.id,
        customer.photo,
        customer.name,
        customer.email,
        customer.spent,
        customer.phone,
        customer.address,
        new Date(customer.registerDate),
        customer.country,
      );
    }
    console.log(`Imported ${customersData.length} customers`);
  } catch (error) {
    console.error('Error importing customers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importTransactions() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    console.log('Importing transactions...');
    const fileContent = fs.readFileSync(
      path.join(process.cwd(), 'export', 'transactions.json'),
      'utf-8',
    );
    const transactionsData: TransactionData[] = JSON.parse(fileContent);

    // Загрузим всех клиентов, чтобы правильно связать транзакции
    const customers = await prisma.customer.findMany({
      select: { id: true, email: true },
    });

    const customerByEmail = new Map<string, number>();
    customers.forEach((c) => {
      if (c.email) customerByEmail.set(c.email, c.id);
    });

    // Используем rawQuery для импорта
    for (const transaction of transactionsData) {
      let customerId = transaction.customerId;

      // Если у транзакции есть email, пытаемся найти клиента по email
      if (transaction.email && !customerId) {
        customerId = customerByEmail.get(transaction.email) || null;
      }

      const query = `
        INSERT INTO "public"."transactions" 
        ("id", "name", "amount", "type", "email", "customerId", "createdAt")
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7)
      `;

      await prisma.$executeRawUnsafe(
        query,
        transaction.id,
        transaction.name,
        transaction.amount,
        transaction.type,
        transaction.email,
        customerId,
        new Date(transaction.createdAt),
      );
    }
    console.log(`Imported ${transactionsData.length} transactions`);
  } catch (error) {
    console.error('Error importing transactions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importProducts() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    console.log('Importing products...');
    const productsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'export', 'products.json'), 'utf-8'),
    );

    for (const product of productsData) {
      await prisma.product.create({
        data: {
          id: product.id,
          photo: product.photo,
          name: product.name,
          supplier: product.supplier,
          stock: product.stock,
          price: product.price,
          category: product.category,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        },
      });
    }
    console.log(`Imported ${productsData.length} products`);
  } catch (error) {
    console.error('Error importing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importSuppliers() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    console.log('Importing suppliers...');
    const suppliersData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'export', 'suppliers.json'), 'utf-8'),
    );

    for (const supplier of suppliersData) {
      await prisma.supplier.create({
        data: {
          id: supplier.id,
          name: supplier.name,
          address: supplier.address,
          company: supplier.company,
          date: new Date(supplier.date),
          amount: supplier.amount,
          status: supplier.status,
          createdAt: new Date(supplier.createdAt),
          updatedAt: new Date(supplier.updatedAt),
        },
      });
    }
    console.log(`Imported ${suppliersData.length} suppliers`);
  } catch (error) {
    console.error('Error importing suppliers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function importOrders() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
  });

  try {
    console.log('Importing orders...');
    const ordersData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'export', 'orders.json'), 'utf-8'),
    );

    for (const order of ordersData) {
      await prisma.order.create({
        data: {
          id: order.id,
          photo: order.photo,
          name: order.name,
          address: order.address,
          products: order.products,
          price: order.price,
          status: order.status,
          order_date: order.order_date,
        },
      });
    }
    console.log(`Imported ${ordersData.length} orders`);
  } catch (error) {
    console.error('Error importing orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  try {
    console.log('Starting data import to Supabase...');

    // Сначала очистим все существующие данные
    await clearAllData();

    // Импортируем данные в правильном порядке
    await importUsers();
    await importCustomers();

    // Для остальных используем существующие функции
    const prisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });

    // Импорт продуктов
    console.log('Importing products...');
    const productsData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'export', 'products.json'), 'utf-8'),
    );

    for (const product of productsData) {
      await prisma.product.create({
        data: {
          id: product.id,
          photo: product.photo,
          name: product.name,
          supplier: product.supplier,
          stock: product.stock,
          price: product.price,
          category: product.category,
          createdAt: new Date(product.createdAt),
          updatedAt: new Date(product.updatedAt),
        },
      });
    }
    console.log(`Imported ${productsData.length} products`);

    // Импорт поставщиков
    console.log('Importing suppliers...');
    const suppliersData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'export', 'suppliers.json'), 'utf-8'),
    );

    for (const supplier of suppliersData) {
      await prisma.supplier.create({
        data: {
          id: supplier.id,
          name: supplier.name,
          address: supplier.address,
          company: supplier.company,
          date: new Date(supplier.date),
          amount: supplier.amount,
          status: supplier.status,
          createdAt: new Date(supplier.createdAt),
          updatedAt: new Date(supplier.updatedAt),
        },
      });
    }
    console.log(`Imported ${suppliersData.length} suppliers`);

    // Импорт заказов
    console.log('Importing orders...');
    const ordersData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'export', 'orders.json'), 'utf-8'),
    );

    for (const order of ordersData) {
      await prisma.order.create({
        data: {
          id: order.id,
          photo: order.photo,
          name: order.name,
          address: order.address,
          products: order.products,
          price: order.price,
          status: order.status,
          order_date: order.order_date,
        },
      });
    }
    console.log(`Imported ${ordersData.length} orders`);

    await prisma.$disconnect();

    // Импортируем транзакции, сохраняя связи с клиентами
    await importTransactions();

    console.log('Import to Supabase completed successfully!');
  } catch (error) {
    console.error('Error importing data to Supabase:', error);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
