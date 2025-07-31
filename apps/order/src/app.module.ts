import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';

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
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
