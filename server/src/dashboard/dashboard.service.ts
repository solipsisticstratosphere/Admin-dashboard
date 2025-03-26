import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    const [productsCount, suppliersCount, customersCount, recentCustomers, transactions] =
      await Promise.all([
        this.prisma.product.count(),
        this.prisma.supplier.count(),
        this.prisma.customer.count(),
        this.prisma.customer.findMany({
          take: 5,
          orderBy: { registerDate: 'desc' },
        }),
        this.prisma.transaction.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: true,
          },
        }),
      ]);

    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      name: transaction.name,
      email: transaction.customer?.email || null,
      amount: transaction.amount,
      type: transaction.type,
    }));

    return {
      stats: {
        totalProducts: productsCount,
        totalSuppliers: suppliersCount,
        totalCustomers: customersCount,
      },
      recentCustomers,
      transactions: formattedTransactions,
    };
  }

  async getCustomerDetails(customerId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      return null;
    }

    return customer;
  }
}
