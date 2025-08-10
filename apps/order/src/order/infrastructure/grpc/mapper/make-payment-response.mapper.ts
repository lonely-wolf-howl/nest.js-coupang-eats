import { PaymentMicroservice } from '@app/common';
import { OrderDomain } from '../../../domain/order.domain';
import { PaymentDto } from '../../../use-case/dto/create-order.dto';
import { PaymentMethod } from '../../../domain/payment.vo';

export class MakePaymentResponseMapper {
  constructor(
    private readonly response: PaymentMicroservice.MakePaymentResponse,
  ) {}

  toDomain(order: OrderDomain, payment: PaymentDto): OrderDomain {
    order.setPayment({
      ...payment,
      ...this.response,
      paymentId: this.response.id,
      paymentMethod: this.parsePaymentMethod(payment.paymentMethod),
    });

    return order;
  }

  private parsePaymentMethod(paymentMethod: string) {
    switch (paymentMethod) {
      case 'CreditCard':
        return PaymentMethod.creditCard;
      case 'KakaoPay':
        return PaymentMethod.kakaoPay;
      default:
        throw new Error('');
    }
  }
}
