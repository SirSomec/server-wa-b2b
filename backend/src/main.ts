import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import pinoHttpMiddleware from 'pino-http';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(pinoHttpMiddleware());
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('http.port') ?? 3000;

  await app.listen(port);
}

void bootstrap();
