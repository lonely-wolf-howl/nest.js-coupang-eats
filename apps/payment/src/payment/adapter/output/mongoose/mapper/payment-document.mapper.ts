import { PaymentDocument } from '../document/payment.document';
import { PaymentModel } from '../../../../domain/payment.domain';

export class PaymentDocumentMapper {
  constructor(private readonly document: PaymentDocument) {}

  toDomain() {
    const model = new PaymentModel({
      orderId: this.document.orderId,
      paymentMethod: this.document.paymentMethod,
      cardNumber: this.document.cardNumber,
      expiryYear: this.document.expiryYear,
      expiryMonth: this.document.expiryMonth,
      birthOrRegistration: this.document.birthOrRegistration,
      passwordTwoDigits: this.document.passwordTwoDigits,
      amount: this.document.amount,
      userEmail: this.document.userEmail,
    });

    model.assignId(this.document._id.toString());

    return model;
  }
}
