import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function linkTransactionsToCustomers() {
  try {
    console.log('Starting to link transactions to customers...');

    const customers = await prisma.customer.findMany();

    const transactions = await prisma.transaction.findMany({
      where: {
        customerId: null,
      },
    });

    for (const transaction of transactions) {
      if (transaction.type === 'Expense') {
        continue;
      }

      const randomIndex = Math.floor(Math.random() * customers.length);
      const customer = customers[randomIndex];

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          customerId: customer.id,
          email: customer.email,
        },
      });

      console.log(`Linked transaction ${transaction.id} to customer ${customer.name}`);
    }

    console.log('Finished linking transactions to customers');
  } catch (error) {
    console.error('Error linking transactions to customers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

linkTransactionsToCustomers();
