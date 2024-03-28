import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [`${configService.get('queue.url')}`],
      queue: `${configService.get('queue.queueName')}`,
      queueOptions: { durable: true },
      prefetchCount: 1,
    },
  });
  app.startAllMicroservices();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      strictGroups: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
