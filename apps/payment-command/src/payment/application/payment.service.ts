import { PaymentMethod } from '../domain/payment.vo';
import { PaymentModel } from '../domain/payment.domain';
import { DatabaseOutputPort } from '../port/output/database.output-port';
import { PaymentOutputPort } from '../port/output/payment.output-port';
import { NetworkOutputPort } from '../port/output/network.output-port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('DatabaseOutputPort')
    private readonly databaseOutputPort: DatabaseOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOutputPort,
    @Inject('NetworkOutputPort')
    private readonly networkOutputPort: NetworkOutputPort,
  ) {}

  async makePayment(param: {
    orderId: string;
    paymentMethod: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
    userEmail: string;
  }) {
    const payment = new PaymentModel(param);

    const result = await this.databaseOutputPort.savePayment(payment);

    payment.assignId(result.id);

    try {
      await this.paymentOutputPort.processPayment(payment);

      payment.processPayment();
      await this.databaseOutputPort.updatePayment(payment);
    } catch (e) {
      payment.rejectPayment();
      await this.databaseOutputPort.updatePayment(payment);

      return payment;
    }

    this.networkOutputPort.sendNotification(param.orderId, param.userEmail);

    return payment;
  }

  async cancelPayment(orderId: string) {
    await this.paymentOutputPort.cancelPayment(orderId);

    const payment = await this.databaseOutputPort.findPaymentByOrderId(orderId);

    payment.rejectPayment();

    await this.databaseOutputPort.updatePayment(payment);
  }
}
