import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async makePayment(payload: MakePaymentDto) {
    let paymentId: string;

    try {
      const result = await this.paymentRepository.save(payload);

      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(paymentId, PaymentStatus.approved);

      return this.paymentRepository.findOneBy({ id: paymentId });
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.rejected);
      }
    }
  }

  async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    await this.paymentRepository.update({ id }, { paymentStatus: status });
  }
}
