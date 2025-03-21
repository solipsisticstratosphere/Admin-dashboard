import { Field, Int, ObjectType } from '@nestjs/graphql';

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
