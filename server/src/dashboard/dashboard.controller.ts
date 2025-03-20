import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboardData() {
    return this.dashboardService.getDashboardData();
  }

  @Get('customers/:customerId')
  async getCustomerDetails(@Param('customerId', ParseIntPipe) customerId: number) {
    return this.dashboardService.getCustomerDetails(customerId);
  }
}
