import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/order/.env',
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        DATABASE_URL: Joi.string().required(),
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
          name: 'USER_SERVICE',
          useFactory: (configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
              host: 'user',
              port: 3001,
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
