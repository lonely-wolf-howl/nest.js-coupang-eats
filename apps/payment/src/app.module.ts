import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE, NotificationMicroservice } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/payment/.env',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        GRPC_URL: Joi.string().required(),
        NOTIFICATION_GRPC_URL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              package: NotificationMicroservice.protobufPackage,
              protoPath: join(process.cwd(), 'proto/notification.proto'),
              url: configService.getOrThrow<string>('NOTIFICATION_GRPC_URL'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
