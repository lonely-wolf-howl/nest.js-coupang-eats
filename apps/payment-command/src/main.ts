import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PaymentMicroservice } from '@app/common';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PaymentMicroservice.protobufPackage,
      protoPath: join(process.cwd(), 'proto/payment.proto'),
      url: configService.getOrThrow<string>('GRPC_URL'),
    },
  });

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'payment-command',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'payment-command-consumer',
      },
    },
  });

  await app.init();

  await app.startAllMicroservices();
}

bootstrap();
