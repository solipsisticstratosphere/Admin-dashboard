import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { AuthResolver } from "./auth.resolver";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    PrismaModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_SECRET"),
        signOptions: { expiresIn: "15m" },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
