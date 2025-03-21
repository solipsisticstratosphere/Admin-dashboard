import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async getAllProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
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
      // Check if a product with the same name already exists
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          name: productData.name,
        },
      });

      if (existingProduct) {
        throw new Error(`Product with name "${productData.name}" already exists`);
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
      // Check specifically for Prisma's unique constraint violation error
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        this.logger.error(
          `Unique constraint violation on product creation: ${JSON.stringify(error.meta)}`,
        );
        throw new Error(`Product with name "${productData.name}" already exists`);
      }

      this.logger.error('Failed to create product:', error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: UpdateProductInput): Promise<Product | null> {
    try {
      // Check if a product with the same name already exists but a different ID
      if (productData.name) {
        const existingProduct = await this.prisma.product.findFirst({
          where: {
            name: productData.name,
            id: {
              not: parseInt(id),
            },
          },
        });

        if (existingProduct) {
          throw new Error(`Product with name "${productData.name}" already exists`);
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
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        this.logger.error(
          `Unique constraint violation on product update: ${JSON.stringify(error.meta)}`,
        );
        throw new Error(`Product with name "${productData.name}" already exists`);
      }

      this.logger.error(`Failed to update product with ID ${id}:`, error);
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
