import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { json } from 'express';

async function bootstrap() {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error(
      'JWT_SECRET must be defined and at least 32 characters long',
    );
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust the first reverse proxy (Render, Vercel...) so rate limiting
  // uses the real client IP from X-Forwarded-For instead of the proxy IP
  app.set('trust proxy', 1);

  // Limit request body to 1 MB to prevent memory exhaustion DoS attacks.
  // urlencoded() is deliberately not enabled: all API endpoints expect JSON,
  // and refusing form-encoded bodies closes a CSRF vector via "simple requests".
  app.use(json({ limit: '1mb' }));

  app.use(helmet());
  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL;
  // enabled CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });

  // Add ValidationPipe for use dto validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // removes fields not defined in DTO
      forbidNonWhitelisted: true, // return error if field unknow is send
    }),
  );

  // add documentation with swagger (only in development)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('BlablaBook API')
      .setDescription(
        'Gérez votre bibliothèque personnelle, découvrez de nouveaux titres.',
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .addTag('Auth', 'Authentication - Register, Login, Logout')
      .addTag('Books', 'Book Management - View, Add, Remove, Update Status')
      .addTag('Category', 'Categories - Browse available book categories')
      .addTag('User', 'User Profile - View, Update, Delete account')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  const logger = new Logger('Bootstrap');
  logger.log(`Server running on port ${process.env.PORT ?? 3000}`);
}

// best practice
bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  logger.error('Fatal error during application bootstrap', err);
  // exit programme with failed error if failed
  process.exit(1);
});
