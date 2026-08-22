import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: false,
  });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
