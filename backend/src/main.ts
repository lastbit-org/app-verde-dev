import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { csrfProtection } from './auth/csrf';

function corsOrigins() {
  const fromEnv = process.env.CORS_ORIGIN;

  if (fromEnv) {
    return fromEnv
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
  }

  return ['http://localhost:5173', 'http://127.0.0.1:5173'];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: corsOrigins(),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'X-CSRF-Token'],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(csrfProtection);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  const port = Number(process.env.PORT) || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Server is running on port ${port}`);
  console.log(`Server is running on port ${port}`);
}

void bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
