import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from 'prisma/prisma-exception.filter';

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Music Collection API') // API title shown in Swagger UI
    .setDescription('API documentation for managing users, music items, collections and reviews') // Short API description
    .setVersion('1.0') // API version
    .build();

  // Generate Swagger document with config
  const document = SwaggerModule.createDocument(app, config);
  // Serve Swagger UI at /api endpoint
  SwaggerModule.setup('api', app, document);

  // Enable global validation that removes unknown fields and rejects extra ones
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  // Handle Prisma-specific exceptions globally
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PATCH','DELETE','PUT','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-User-Id', 'x-admin'],
  });

  // Start Server on port
  await app.listen(3000);
}

// Initialize application
bootstrap();
