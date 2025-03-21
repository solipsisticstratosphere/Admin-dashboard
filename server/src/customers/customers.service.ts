import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export type Customer = {
  id: string;
  photo: string | null;
  name: string;
  email: string;
  spent: string;
  phone: string;
  address: string;
  register_date: string;
};

export type FilterCustomersParams = {
  name?: string;
  email?: string;
  address?: string;
  register_date?: string;
  phone?: string;
  spent?: string;
};

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async getAllCustomers(filters: FilterCustomersParams = {}): Promise<Customer[]> {
    const { name, email, address, register_date, phone, spent } = filters;

    const whereClause: Prisma.CustomerWhereInput = {};

    if (name) {
      whereClause.name = { contains: name, mode: 'insensitive' };
    }

    if (email) {
      whereClause.email = { contains: email, mode: 'insensitive' };
    }

    if (address) {
      whereClause.address = { contains: address, mode: 'insensitive' };
    }

    if (phone) {
      whereClause.phone = { contains: phone, mode: 'insensitive' };
    }

    if (spent) {
      // For numeric comparison, remove currency symbols and convert to number
      const spentValue = parseFloat(spent.replace(/[^0-9.-]+/g, ''));
      if (!isNaN(spentValue)) {
        whereClause.spent = {
          contains: spent,
          mode: 'insensitive',
        };
      }
    }

    if (register_date) {
      whereClause.registerDate = {
        gte: new Date(register_date),
        lt: new Date(new Date(register_date).getTime() + 24 * 60 * 60 * 1000), // Next day
      };
    }

    const customers = await this.prisma.customer.findMany({
      where: whereClause,
      orderBy: { registerDate: 'desc' },
    });

    // Map database model to our Customer type
    return customers.map((customer) => ({
      id: customer.id.toString(),
      photo: customer.photo,
      name: customer.name,
      email: customer.email,
      spent: customer.spent,
      phone: customer.phone,
      address: customer.address,
      register_date: customer.registerDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }));
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!customer) return null;

    return {
      id: customer.id.toString(),
      photo: customer.photo,
      name: customer.name,
      email: customer.email,
      spent: customer.spent,
      phone: customer.phone,
      address: customer.address,
      register_date: customer.registerDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  }
}
