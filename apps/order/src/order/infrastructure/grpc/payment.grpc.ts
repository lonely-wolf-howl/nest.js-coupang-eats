import { OrderDomain } from '../../domain/order.domain';
import { PaymentOutputPort } from '../../port/output/payment.output-port';
import { PaymentDto } from '../../use-case/dto/create-order.dto';
import { PAYMENT_SERVICE, PaymentMicroservice } from '@app/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { OrderDomainMapper } from './mapper/order-domain.mapper';
import { PaymentFailedException } from '../../exception/payment-failed.exception';
import { MakePaymentResponseMapper } from './mapper/make-payment-response.mapper';
import { OrderStatus } from '../../domain/order.vo';

export class PaymentGrpc implements PaymentOutputPort, OnModuleInit {
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentMicroservice.getService<PaymentMicroservice.PaymentServiceClient>(
        'PaymentService',
      );
  }

  async processPayment(
    order: OrderDomain,
    payment: PaymentDto,
  ): Promise<OrderDomain> {
    const response = await lastValueFrom(
      this.paymentService.makePayment(
        new OrderDomainMapper(order).toMakePaymentRequest(payment),
      ),
    );

    const isPaid = response.paymentStatus === 'Approved';
    const orderStatus = isPaid
      ? OrderStatus.paymentProcessed
      : OrderStatus.paymentFailed;

    if (orderStatus === OrderStatus.paymentFailed) {
      throw new PaymentFailedException(response);
    }

    return new MakePaymentResponseMapper(response).toDomain(order, payment);
  }
}
