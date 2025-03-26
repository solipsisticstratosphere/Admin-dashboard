import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || 3001;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  const origins = [
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:5174',
    'https://admin-dashboard-iota-seven-29.vercel.app',
  ];

  const prodClientUrl = configService.get<string>('PROD_CLIENT_URL');
  if (prodClientUrl) {
    origins.push(prodClientUrl);
  }

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Apollo-Require-Preflight',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  console.log(`Starting server on port ${port}...`);
  await app.listen(port);
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${nodeEnv}`);
  console.log(`GraphQL playground available at http://localhost:${port}/graphql`);
  console.log('Allowed CORS origins:', origins);
}
bootstrap().catch((error) => {
  console.error('Server failed to start:', error);
});
