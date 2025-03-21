import { Query, Resolver } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order, OrdersResponse } from './orders.types';
import { Public } from '../common/decorators/public.decorator';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Query(() => OrdersResponse, { name: 'orders' })
  async getAllOrders() {
    return this.ordersService.getAllOrders();
  }
}
