import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order } from './orders.types';
import * as fs from 'fs';
import * as path from 'path';
import { Prisma } from '@prisma/client';

interface OrderData {
  photo: string;
  name: string;
  address: string;
  products: string;
  price: string;
  status: string;
  order_date: string;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      // Seed orders from JSON file if not exist
      this.logger.log('Checking if orders need to be seeded...');
      const ordersCount = await this.prisma.order.count();
      this.logger.log(`Found ${ordersCount} orders in the database`);

      if (ordersCount === 0) {
        this.logger.log('No orders found, seeding from JSON file...');
        await this.seedOrders();
      }
    } catch (error) {
      this.logger.error('Error in onModuleInit:', error);
    }
  }

  private async seedOrders() {
    try {
      // Try different potential file paths
      const possiblePaths = [
        path.join(process.cwd(), 'server', 'json', 'orders.json'),
        path.join(process.cwd(), 'json', 'orders.json'),
        path.join(__dirname, '..', '..', 'json', 'orders.json'),
        path.join(__dirname, '..', '..', '..', 'json', 'orders.json'),
      ];

      let ordersData: OrderData[] = [];
      let filePath = '';

      for (const potentialPath of possiblePaths) {
        try {
          if (fs.existsSync(potentialPath)) {
            filePath = potentialPath;
            this.logger.log(`Found orders.json at: ${filePath}`);
            const fileContent = fs.readFileSync(potentialPath, 'utf8');
            ordersData = JSON.parse(fileContent) as OrderData[];
            break;
          }
        } catch {
          // Continue to next path
        }
      }

      if (!filePath) {
        this.logger.error('Could not find orders.json file. Checked paths:', possiblePaths);
        return;
      }

      this.logger.log(`Parsed ${ordersData.length} orders from JSON file`);

      // Insert orders one by one to avoid transaction issues
      for (let i = 0; i < ordersData.length; i++) {
        const order = ordersData[i];
        await this.prisma.order.create({
          data: {
            id: i + 1,
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

      this.logger.log(`Successfully seeded ${ordersData.length} orders`);
    } catch (error) {
      this.logger.error('Error seeding orders:', error);
      // Print more detailed error for debugging
      if (error instanceof Error) {
        this.logger.error('Error details:', error.message, error.stack);
      }
    }
  }

  async getAllOrders(): Promise<{ items: Order[]; totalCount: number }> {
    try {
      // Получаем все заказы с базовой сортировкой по id
      const orderBy: Prisma.OrderOrderByWithRelationInput = { id: 'asc' };

      // Выполняем запрос
      const [items, totalCount] = await Promise.all([
        this.prisma.order.findMany({
          orderBy,
        }),
        this.prisma.order.count(),
      ]);

      return { items, totalCount };
    } catch (error) {
      this.logger.error('Error getting all orders:', error);
      return { items: [], totalCount: 0 };
    }
  }
}
