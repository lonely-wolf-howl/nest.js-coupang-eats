import { OrderMicroservice } from '@app/common';
import { CreateOrderDto } from '../../../use-case/dto/create-order.dto';
import { PaymentMethod } from '../../../domain/payment.vo';

export class CreateOrderRequestMapper {
  constructor(private readonly request: OrderMicroservice.CreateOrderRequest) {}

  toDomain(): CreateOrderDto {
    return {
      userId: this.request.meta.user.sub,
      productIds: this.request.productIds,
      address: this.request.address,
      payment: {
        ...this.request.payment,
        paymentMethod: this.parsePaymentMethod(
          this.request.payment.paymentMethod,
        ),
      },
    };
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
