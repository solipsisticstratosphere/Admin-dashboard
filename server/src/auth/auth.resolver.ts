import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth.response';
import { GqlAuthGuard } from '../common/guards/gql-auth.guard';
import { GqlRefreshGuard } from '../common/guards/gql-refresh.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

interface GqlContext {
  req: {
    get(name: string): string | undefined;
  };
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async logout(@CurrentUser() user: User): Promise<boolean> {
    return this.authService.logout(user.id);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(GqlRefreshGuard)
  async refreshTokens(
    @CurrentUser() user: User,
    @Context() context: GqlContext,
  ): Promise<AuthResponse> {
    const refreshToken = context.req.get('Authorization')?.replace('Bearer', '').trim();

    if (!refreshToken) {
      throw new Error('Refresh token not provided');
    }

    return this.authService.refreshTokens(user.id, refreshToken);
  }
}
