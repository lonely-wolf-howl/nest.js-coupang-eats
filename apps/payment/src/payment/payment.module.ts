import { Module } from '@nestjs/common';
import { PaymentController } from './adapter/input/payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './application/payment.service';
import { PaymentEntity } from './adapter/output/type-orm/entity/payment.entity';
import { TypeOrmAdapter } from './adapter/output/type-orm/type-orm.adapter';
import { PortOneAdapter } from './adapter/output/port-one/port-one.adapter';
import { GrpcAdapter } from './adapter/output/grpc/grpc.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'DatabaseOutputPort',
      useClass: TypeOrmAdapter,
    },
    {
      provide: 'PaymentOutputPort',
      useClass: PortOneAdapter,
    },
    {
      provide: 'NetworkOutputPort',
      useClass: GrpcAdapter,
    },
  ],
})
export class PaymentModule {}
