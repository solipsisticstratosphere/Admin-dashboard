import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Password cannot be empty" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;
}
