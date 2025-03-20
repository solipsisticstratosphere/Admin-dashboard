import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalProducts: number;

  @Field(() => Int)
  totalSuppliers: number;

  @Field(() => Int)
  totalCustomers: number;
}

@ObjectType()
export class Transaction {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String)
  amount: string;

  @Field(() => String)
  type: string;

  @Field(() => Int, { nullable: true })
  customerId?: number | null;

  @Field(() => Date, { nullable: true })
  createdAt: Date;
}

@ObjectType()
export class Customer {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  photo: string | null;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  spent: string;

  @Field(() => String)
  phone: string;

  @Field(() => String)
  address: string;

  @Field(() => Date)
  registerDate: Date;

  @Field(() => String)
  country: string;
}

@ObjectType()
export class CustomerDetails extends Customer {
  @Field(() => [Transaction])
  transactions: Transaction[];
}

@ObjectType()
export class DashboardData {
  @Field(() => DashboardStats)
  stats: DashboardStats;

  @Field(() => [Customer])
  recentCustomers: Customer[];

  @Field(() => [Transaction])
  transactions: Transaction[];
}
