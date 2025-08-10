import { OrderDomain } from '../../../domain/order.domain';
import { PaymentDto } from '../../../use-case/dto/create-order.dto';

export class OrderDomainMapper {
  constructor(private readonly order: OrderDomain) {}

  toMakePaymentRequest(payment: PaymentDto) {
    return {
      orderId: this.order.id,
      paymentMethod: payment.paymentMethod,
      paymentName: payment.paymentName,
      cardNumber: payment.cardNumber,
      expiryYear: payment.expiryYear,
      expiryMonth: payment.expiryMonth,
      birthOrRegistration: payment.birthOrRegistration,
      passwordTwoDigits: payment.passwordTwoDigits,
      amount: this.order.totalAmount,
      userEmail: this.order.customer.email,
    };
  }
}
