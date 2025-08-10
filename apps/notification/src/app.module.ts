import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE, OrderMicroservice } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/notification/.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        GRPC_URL: Joi.string().required(),
        ORDER_GRPC_URL: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: ORDER_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: OrderMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/order.proto'),
              url: configService.getOrThrow<string>('ORDER_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
        {
          name: 'KAFKA_SERVICE',
          useFactory: () => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'notification',
                brokers: ['kafka:9092'],
              },
            },
          }),
        },
      ],
      isGlobal: true,
    }),
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
