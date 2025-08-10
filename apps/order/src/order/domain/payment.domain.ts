import { PaymentMethod } from './payment.vo';

export class PaymentDomain {
  paymentId: string;
  paymentMethod: PaymentMethod;
  paymentName: string;
  amount: number;

  constructor(param: PaymentDomain) {
    this.paymentId = param.paymentId;
    this.paymentMethod = param.paymentMethod;
    this.paymentName = param.paymentName;
    this.amount = param.amount;
  }
}
