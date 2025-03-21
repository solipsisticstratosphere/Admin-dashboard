import { Resolver, Query, Args, Field, ObjectType, InputType, ID } from '@nestjs/graphql';
import {
  CustomersService,
  Customer as CustomerType,
  FilterCustomersParams,
} from './customers.service';

@ObjectType('CustomerEntry')
class CustomerEntry {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  photo: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  spent: string;

  @Field()
  phone: string;

  @Field()
  address: string;

  @Field()
  register_date: string;
}

@InputType()
class CustomerFiltersInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  register_date?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  spent?: string;
}

@Resolver(() => CustomerEntry)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Query(() => [CustomerEntry])
  async getCustomers(
    @Args('filters', { nullable: true }) filters?: CustomerFiltersInput,
  ): Promise<CustomerType[]> {
    const filterParams: FilterCustomersParams = filters || {};
    return this.customersService.getAllCustomers(filterParams);
  }

  @Query(() => CustomerEntry, { nullable: true })
  async getCustomer(@Args('id') id: string): Promise<CustomerType | null> {
    return this.customersService.getCustomerById(id);
  }
}
