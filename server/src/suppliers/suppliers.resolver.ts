import { Resolver, Query, Mutation, Args, Field, ObjectType, InputType, ID } from '@nestjs/graphql';
import {
  SuppliersService,
  Supplier as SupplierType,
  FilterSuppliersParams,
} from './suppliers.service';

@ObjectType()
class Supplier {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  company: string;

  @Field()
  date: string;

  @Field()
  amount: string;

  @Field()
  status: string;
}

@InputType()
class CreateSupplierInput {
  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  company: string;

  @Field({ nullable: true })
  date?: string;

  @Field()
  amount: string;

  @Field()
  status: string;
}

@InputType()
class UpdateSupplierInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  amount?: string;

  @Field({ nullable: true })
  status?: string;
}

@InputType()
class SupplierFilterInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  company?: string;

  @Field({ nullable: true })
  status?: string;
}

@Resolver(() => Supplier)
export class SuppliersResolver {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Query(() => [Supplier])
  async getSuppliers(
    @Args('filters', { nullable: true }) filters?: SupplierFilterInput,
  ): Promise<SupplierType[]> {
    const filterParams: FilterSuppliersParams = filters || {};
    return this.suppliersService.getAllSuppliers(filterParams);
  }

  @Query(() => Supplier, { nullable: true })
  async getSupplier(@Args('id') id: string): Promise<SupplierType | null> {
    return this.suppliersService.getSupplierById(id);
  }

  @Mutation(() => Supplier)
  async createSupplier(@Args('input') input: CreateSupplierInput): Promise<SupplierType> {
    return this.suppliersService.createSupplier(input);
  }

  @Mutation(() => Supplier, { nullable: true })
  async updateSupplier(
    @Args('id') id: string,
    @Args('input') input: UpdateSupplierInput,
  ): Promise<SupplierType | null> {
    return this.suppliersService.updateSupplier(id, input);
  }

  @Mutation(() => Boolean)
  async deleteSupplier(@Args('id') id: string): Promise<boolean> {
    return this.suppliersService.deleteSupplier(id);
  }
}
