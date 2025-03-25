import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class VerifyAdminPasswordInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  password: string;
}
