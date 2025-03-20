import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Fix the CORS configuration
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both development servers
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  console.log('Starting server on port 3001...');
  await app.listen(3001);
  console.log('Server running on port 3001');
  console.log('GraphQL playground available at http://localhost:3001/graphql');
}
bootstrap().catch((error) => {
  console.error('Server failed to start:', error);
});
