import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'payment-query',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'payment-update-consumer',
      },
    },
  });

  await app.init();

  await app.startAllMicroservices();
}

bootstrap();
