import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Order {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  photo: string | null;

  @Field(() => String)
  name: string;

  @Field(() => String)
  address: string;

  @Field(() => String)
  products: string;

  @Field(() => String)
  price: string;

  @Field(() => String)
  status: string;

  @Field(() => String)
  order_date: string;
}

@ObjectType()
export class OrdersResponse {
  @Field(() => [Order])
  items: Order[];

  @Field(() => Int)
  totalCount: number;
}

@InputType()
export class OrderFilters {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  products?: string;

  @Field(() => String, { nullable: true })
  status?: string;

  @Field(() => String, { nullable: true })
  order_date?: string;
}
