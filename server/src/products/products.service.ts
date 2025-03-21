import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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
      this.logger.log(`Attempting to create product with data: ${JSON.stringify(productData)}`);

      // First, check if there's an exact name match
      const nameMatch = await this.prisma.product.findFirst({
        where: { name: productData.name },
      });

      if (nameMatch) {
        this.logger.warn(`Product with name "${productData.name}" already exists`);
        throw new Error(`Product with name "${productData.name}" already exists`);
      }

      // Then check for combination of name + supplier
      const nameAndSupplierMatch = await this.prisma.product.findFirst({
        where: {
          AND: [{ name: productData.name }, { supplier: productData.suppliers }],
        },
      });

      if (nameAndSupplierMatch) {
        this.logger.warn(
          `Product with name "${productData.name}" and supplier "${productData.suppliers}" already exists`,
        );
        throw new Error(
          `Product with name "${productData.name}" and supplier "${productData.suppliers}" already exists`,
        );
      }

      // Now try to create the product
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
      // Log detailed information about the error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const targetFields = error.meta?.target || 'unknown';
          this.logger.error(
            `Unique constraint violation on fields: ${JSON.stringify(targetFields)}`,
          );
          throw new Error(
            `Product with these details already exists. Conflicting fields: ${JSON.stringify(targetFields)}`,
          );
        } else {
          this.logger.error(`Prisma error ${error.code}: ${error.message}`);
        }
      }

      // If it's an error we already created with a message, just pass it on
      if (error instanceof Error && error.message) {
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

      // Check for name collision if name is being updated
      if (productData.name) {
        const nameMatch = await this.prisma.product.findFirst({
          where: {
            name: productData.name,
            id: { not: parseInt(id) },
          },
        });

        if (nameMatch) {
          this.logger.warn(
            `Cannot update: Another product with name "${productData.name}" already exists`,
          );
          throw new Error(`Another product with name "${productData.name}" already exists`);
        }
      }

      // Check for name+supplier collision if both are being updated
      if (productData.name && productData.suppliers) {
        const nameAndSupplierMatch = await this.prisma.product.findFirst({
          where: {
            AND: [
              { name: productData.name },
              { supplier: productData.suppliers },
              { id: { not: parseInt(id) } },
            ],
          },
        });

        if (nameAndSupplierMatch) {
          this.logger.warn(
            `Cannot update: Another product with name "${productData.name}" and supplier "${productData.suppliers}" already exists`,
          );
          throw new Error(
            `Another product with name "${productData.name}" and supplier "${productData.suppliers}" already exists`,
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
      // Log detailed information about the error
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const targetFields = error.meta?.target || 'unknown';
          this.logger.error(
            `Unique constraint violation on update: ${JSON.stringify(targetFields)}`,
          );
          throw new Error(
            `Cannot update: Another product with these details already exists. Conflicting fields: ${JSON.stringify(targetFields)}`,
          );
        } else {
          this.logger.error(`Prisma error on update ${error.code}: ${error.message}`);
        }
      }

      // If it's an error we already created with a message, just pass it on
      if (error instanceof Error && error.message) {
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
