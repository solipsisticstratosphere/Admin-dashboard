import { Resolver, Query } from "@nestjs/graphql";
import { Controller, UseGuards } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { GqlAuthGuard } from "../common/guards/gql-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
