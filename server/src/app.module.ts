import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { Request } from 'express';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
      sortSchema: true,
      context: ({ req }: { req: Request }) => ({ req }),
      playground: true,
      introspection: true,
      debug: true,
      definitions: {
        path: join(process.cwd(), 'src/graphql/graphql.ts'),
        outputAs: 'class',
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    OrdersModule,
  ],
})
export class AppModule {}
