import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';
import { RegisterInput } from './dto/register.input';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './types/jwt-payload.type';
import { User } from '../users/entities/user.entity';
import { VerifyAdminPasswordInput } from './dto/verify-admin-password.input';
import { VerifyAdminPasswordResponse } from './dto/verify-admin-password.response';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = registerInput;

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ForbiddenException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userEntity: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userEntity,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userEntity: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userEntity,
    };
  }

  async logout(userId: number): Promise<boolean> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return true;
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = user.refreshToken === refreshToken;

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    const userEntity: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userEntity,
    };
  }

  private async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  private async getTokens(userId: number, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyAdminPassword(
    verifyInput: VerifyAdminPasswordInput,
  ): Promise<VerifyAdminPasswordResponse> {
    const { password } = verifyInput;
    const adminPassword = this.configService.get<string>('ADMIN_EDIT_PASSWORD');

    if (!adminPassword) {
      return {
        success: false,
        message: 'Admin password not configured on server',
      };
    }

    if (password === adminPassword) {
      return {
        success: true,
        message: 'Admin password verified successfully',
      };
    }

    return {
      success: false,
      message: 'Invalid admin password',
    };
  }
}
