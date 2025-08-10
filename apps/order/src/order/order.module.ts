import { Module } from '@nestjs/common';
import { OrderController } from './infrastructure/framework/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderDocument,
  OrderSchema,
} from './infrastructure/mongoose/entity/order.entity';
import { CreateOrderUseCase } from './use-case/create-order.use-case';
import { StartDeliveryUseCase } from './use-case/start-delivery.use-case';
import { OrderRepository } from './infrastructure/mongoose/repository/order.repository';
import { ProductGrpc } from './infrastructure/grpc/product.grpc';
import { UserGrpc } from './infrastructure/grpc/user.grpc';
import { PaymentGrpc } from './infrastructure/grpc/payment.grpc';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUseCase,
    StartDeliveryUseCase,
    {
      provide: 'UserOutputPort',
      useClass: UserGrpc,
    },
    {
      provide: 'ProductOutputPort',
      useClass: ProductGrpc,
    },
    {
      provide: 'OrderOutputPort',
      useClass: OrderRepository,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PaymentGrpc,
    },
  ],
})
export class OrderModule {}
