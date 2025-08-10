import { Module } from '@nestjs/common';
import { PaymentQueryModule } from './payment/payment-query.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGODB_DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    PaymentQueryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
