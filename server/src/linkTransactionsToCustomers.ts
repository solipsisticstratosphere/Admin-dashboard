import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function linkTransactionsToCustomers() {
  try {
    console.log('Starting to link transactions to customers...');

    // Get all customers
    const customers = await prisma.customer.findMany();

    // Get all transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        customerId: null, // Only get transactions that aren't linked yet
      },
    });

    // For each transaction, randomly assign it to a customer
    for (const transaction of transactions) {
      // Skip transactions with type "Expense" as they are not customer-related
      if (transaction.type === 'Expense') {
        continue;
      }

      // Randomly select a customer
      const randomIndex = Math.floor(Math.random() * customers.length);
      const customer = customers[randomIndex];

      // Update transaction with customer info
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
