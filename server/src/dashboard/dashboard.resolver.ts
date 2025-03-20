import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { DashboardData, CustomerDetails } from './dashboard.types';
import { Public } from '../common/decorators/public.decorator';

@Resolver(() => DashboardData)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Query(() => DashboardData, { name: 'dashboard' })
  async getDashboard() {
    return this.dashboardService.getDashboardData();
  }

  @Public()
  @Query(() => CustomerDetails, { name: 'customerDetails', nullable: true })
  async getCustomerDetails(@Args('customerId', { type: () => Int }) customerId: number) {
    return this.dashboardService.getCustomerDetails(customerId);
  }
}
