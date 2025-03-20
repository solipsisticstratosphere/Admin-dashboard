import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  email: string;

  // Not exposed in GraphQL but used in code
  password?: string;

  // Not exposed in GraphQL but used in code
  refreshToken?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
