import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

export type Product = {
  id: string;
  photo: string;
  name: string;
  suppliers: string;
  stock: string;
  price: string;
  category: string;
};

export type CreateProductInput = Omit<Product, 'id'>;
export type UpdateProductInput = Partial<CreateProductInput>;

export type FilterProductsParams = {
  name?: string;
  category?: string;
  suppliers?: string;
  minPrice?: string;
  maxPrice?: string;
};

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async getAllProducts(filters?: FilterProductsParams): Promise<Product[]> {
    const { name, category, suppliers, minPrice, maxPrice } = filters || {};

    const where: Prisma.ProductWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (category) {
      where.category = category;
    }

    if (suppliers) {
      where.supplier = {
        contains: suppliers,
        mode: 'insensitive',
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = minPrice;
      }

      if (maxPrice) {
        where.price.lte = maxPrice;
      }
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
    });

    return products.map((product) => ({
      id: product.id.toString(),
      photo: product.photo || '',
      name: product.name,
      suppliers: product.supplier,
      stock: product.stock,
      price: product.price,
      category: product.category,
    }));
  }

  async getProductById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return null;
    }

    return {
      id: product.id.toString(),
      photo: product.photo || '',
      name: product.name,
      suppliers: product.supplier,
      stock: product.stock,
      price: product.price,
      category: product.category,
    };
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
    });

    return categories.map((c) => c.category);
  }

  async createProduct(productData: CreateProductInput): Promise<Product> {
    try {
      this.logger.log(`Attempting to create product with data: ${JSON.stringify(productData)}`);

      const existingProduct = await this.prisma.product.findFirst({
        where: {
          AND: [{ name: productData.name }, { supplier: productData.suppliers }],
        },
      });

      if (existingProduct) {
        this.logger.warn(
          `Product with name "${productData.name}" and supplier "${productData.suppliers}" already exists`,
        );
        throw new Error(
          `Product with name "${productData.name}" from supplier "${productData.suppliers}" already exists`,
        );
      }

      const newProduct = await this.prisma.product.create({
        data: {
          name: productData.name,
          photo: productData.photo,
          supplier: productData.suppliers,
          stock: productData.stock,
          price: productData.price,
          category: productData.category,
        },
      });

      this.logger.log(`Successfully created product with ID ${newProduct.id}`);

      return {
        id: newProduct.id.toString(),
        photo: newProduct.photo || '',
        name: newProduct.name,
        suppliers: newProduct.supplier,
        stock: newProduct.stock,
        price: newProduct.price,
        category: newProduct.category,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const targetFields = error.meta?.target || 'unknown';
          this.logger.error(
            `Unique constraint violation on fields: ${JSON.stringify(targetFields)}`,
          );
          throw new Error(`Product with these details already exists`);
        } else {
          this.logger.error(`Prisma error ${error.code}: ${error.message}`);
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      this.logger.error('Failed to create product with unknown error');
      throw new Error('Failed to create product');
    }
  }

  async updateProduct(id: string, productData: UpdateProductInput): Promise<Product | null> {
    try {
      this.logger.log(
        `Attempting to update product ${id} with data: ${JSON.stringify(productData)}`,
      );

      if (productData.name || productData.suppliers) {
        const currentProduct = await this.prisma.product.findUnique({
          where: { id: parseInt(id) },
        });

        if (!currentProduct) {
          throw new Error(`Product with ID ${id} not found`);
        }

        const existingProduct = await this.prisma.product.findFirst({
          where: {
            AND: [
              { name: productData.name || currentProduct.name },
              { supplier: productData.suppliers || currentProduct.supplier },
              { id: { not: parseInt(id) } },
            ],
          },
        });

        if (existingProduct) {
          const updatedName = productData.name || currentProduct.name;
          const updatedSupplier = productData.suppliers || currentProduct.supplier;

          this.logger.warn(
            `Cannot update: Another product with name "${updatedName}" and supplier "${updatedSupplier}" already exists`,
          );
          throw new Error(
            `Another product with name "${updatedName}" from supplier "${updatedSupplier}" already exists`,
          );
        }
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name: productData.name,
          photo: productData.photo,
          supplier: productData.suppliers,
          stock: productData.stock,
          price: productData.price,
          category: productData.category,
        },
      });

      this.logger.log(`Successfully updated product with ID ${id}`);

      return {
        id: updatedProduct.id.toString(),
        photo: updatedProduct.photo || '',
        name: updatedProduct.name,
        suppliers: updatedProduct.supplier,
        stock: updatedProduct.stock,
        price: updatedProduct.price,
        category: updatedProduct.category,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const targetFields = error.meta?.target || 'unknown';
          this.logger.error(
            `Unique constraint violation on update: ${JSON.stringify(targetFields)}`,
          );
          throw new Error(`Cannot update: Another product with these details already exists`);
        } else {
          this.logger.error(`Prisma error on update ${error.code}: ${error.message}`);
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      this.logger.error(`Failed to update product with ID ${id} due to unknown error`);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id: parseInt(id) },
      });
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete product with ID ${id}:`, error);
      return false;
    }
  }
}
