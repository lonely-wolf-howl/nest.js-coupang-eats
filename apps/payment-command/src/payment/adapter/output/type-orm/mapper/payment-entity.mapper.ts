import { PaymentEntity } from '../entity/payment.entity';
import { PaymentModel } from '../../../../domain/payment.domain';

export class PaymentEntityMapper {
  constructor(private readonly entity: PaymentEntity) {}

  toDomain() {
    const payment = new PaymentModel({
      orderId: this.entity.orderId,
      paymentMethod: this.entity.paymentMethod,
      cardNumber: this.entity.cardNumber,
      expiryYear: this.entity.expiryYear,
      expiryMonth: this.entity.expiryMonth,
      birthOrRegistration: this.entity.birthOrRegistration,
      passwordTwoDigits: this.entity.passwordTwoDigits,
      amount: this.entity.amount,
      userEmail: this.entity.userEmail,
    });

    payment.assignId(this.entity.id);

    return payment;
  }
}
