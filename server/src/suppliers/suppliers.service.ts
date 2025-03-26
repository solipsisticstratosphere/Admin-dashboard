import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

interface PrismaSupplier {
  id: number;
  name: string;
  address: string;
  company: string;
  date: Date;
  amount: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Supplier = {
  id: string;
  name: string;
  address: string;
  company: string;
  date: string;
  amount: string;
  status: string;
};

export type CreateSupplierInput = Omit<Supplier, 'id' | 'date'> & { date?: string };
export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export type FilterSuppliersParams = {
  name?: string;
  company?: string;
  status?: string;
};

@Injectable()
export class SuppliersService {
  private readonly logger = new Logger(SuppliersService.name);

  constructor(private prisma: PrismaService) {}

  async getAllSuppliers(filters?: FilterSuppliersParams): Promise<Supplier[]> {
    const { name, company, status } = filters || {};

    const where: any = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (company) {
      where.company = {
        contains: company,
        mode: 'insensitive',
      };
    }

    if (status) {
      where.status = status;
    }

    const suppliers = await this.prisma.supplier.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
    });

    return (suppliers as unknown as PrismaSupplier[]).map((supplier) => ({
      id: supplier.id.toString(),
      name: supplier.name,
      address: supplier.address,
      company: supplier.company,
      date: supplier.date.toISOString().split('T')[0],
      amount: supplier.amount,
      status: supplier.status,
    }));
  }

  async getSupplierById(id: string): Promise<Supplier | null> {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: parseInt(id) },
    });

    if (!supplier) {
      return null;
    }

    return {
      id: (supplier as unknown as PrismaSupplier).id.toString(),
      name: (supplier as unknown as PrismaSupplier).name,
      address: (supplier as unknown as PrismaSupplier).address,
      company: (supplier as unknown as PrismaSupplier).company,
      date: (supplier as unknown as PrismaSupplier).date.toISOString().split('T')[0], // Format to YYYY-MM-DD
      amount: (supplier as unknown as PrismaSupplier).amount,
      status: (supplier as unknown as PrismaSupplier).status,
    };
  }

  async createSupplier(supplierData: CreateSupplierInput): Promise<Supplier> {
    try {
      this.logger.log(`Attempting to create supplier with data: ${JSON.stringify(supplierData)}`);

      let dateValue: Date;
      if (supplierData.date) {
        dateValue = new Date(supplierData.date);
      } else {
        dateValue = new Date();
      }

      const data: any = {
        name: supplierData.name,
        address: supplierData.address,
        company: supplierData.company,
        date: dateValue,
        amount: supplierData.amount,
        status: supplierData.status,
      };

      const newSupplier = await this.prisma.supplier.create({ data });

      this.logger.log(`Successfully created supplier with ID ${newSupplier.id}`);

      return {
        id: (newSupplier as unknown as PrismaSupplier).id.toString(),
        name: (newSupplier as unknown as PrismaSupplier).name,
        address: (newSupplier as unknown as PrismaSupplier).address,
        company: (newSupplier as unknown as PrismaSupplier).company,
        date: (newSupplier as unknown as PrismaSupplier).date.toISOString().split('T')[0], // Format to YYYY-MM-DD
        amount: (newSupplier as unknown as PrismaSupplier).amount,
        status: (newSupplier as unknown as PrismaSupplier).status,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(`Prisma error ${error.code}: ${error.message}`);
      }

      if (error instanceof Error) {
        throw error;
      }

      this.logger.error('Failed to create supplier with unknown error');
      throw new Error('Failed to create supplier');
    }
  }

  async updateSupplier(id: string, supplierData: UpdateSupplierInput): Promise<Supplier | null> {
    try {
      this.logger.log(
        `Attempting to update supplier ${id} with data: ${JSON.stringify(supplierData)}`,
      );

      const existingSupplier = await this.prisma.supplier.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingSupplier) {
        throw new Error(`Supplier with ID ${id} not found`);
      }

      let dateValue: Date | undefined;
      if (supplierData.date) {
        dateValue = new Date(supplierData.date);
      }

      const data: any = {};
      if (supplierData.name !== undefined) data.name = supplierData.name;
      if (supplierData.address !== undefined) data.address = supplierData.address;
      if (supplierData.company !== undefined) data.company = supplierData.company;
      if (dateValue !== undefined) data.date = dateValue;
      if (supplierData.amount !== undefined) data.amount = supplierData.amount;
      if (supplierData.status !== undefined) data.status = supplierData.status;

      const updatedSupplier = await this.prisma.supplier.update({
        where: { id: parseInt(id) },
        data,
      });

      this.logger.log(`Successfully updated supplier with ID ${id}`);

      return {
        id: (updatedSupplier as unknown as PrismaSupplier).id.toString(),
        name: (updatedSupplier as unknown as PrismaSupplier).name,
        address: (updatedSupplier as unknown as PrismaSupplier).address,
        company: (updatedSupplier as unknown as PrismaSupplier).company,
        date: (updatedSupplier as unknown as PrismaSupplier).date.toISOString().split('T')[0], // Format to YYYY-MM-DD
        amount: (updatedSupplier as unknown as PrismaSupplier).amount,
        status: (updatedSupplier as unknown as PrismaSupplier).status,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.logger.error(`Prisma error on update ${error.code}: ${error.message}`);
      }

      if (error instanceof Error) {
        throw error;
      }

      this.logger.error(`Failed to update supplier with ID ${id} due to unknown error`);
      return null;
    }
  }

  async deleteSupplier(id: string): Promise<boolean> {
    try {
      await this.prisma.supplier.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete supplier with ID ${id}:`, error);
      return false;
    }
  }
}
