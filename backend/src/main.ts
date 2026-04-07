import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: FRONTEND_ORIGINS,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();