import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, PaymentStatus } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE, NotificationMicroservice } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService implements OnModuleInit {
  notificationService: NotificationMicroservice.NotificationServiceClient;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationMicroservice.getService<NotificationMicroservice.NotificationServiceClient>(
        'NotificationService',
      );
  }

  async makePayment(payload: MakePaymentDto) {
    let paymentId: string;

    try {
      const result = await this.paymentRepository.save(payload);

      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(paymentId, PaymentStatus.approved);

      await this.sendNotification(payload.orderId, payload.userEmail);

      return this.paymentRepository.findOneBy({ id: paymentId });
    } catch (e) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatus.rejected);
      }
    }
  }

  private async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  private async updatePaymentStatus(id: string, status: PaymentStatus) {
    return await this.paymentRepository.update(
      { id },
      { paymentStatus: status },
    );
  }

  private async sendNotification(orderId: string, to: string) {
    await lastValueFrom(
      this.notificationService.sendPaymentNotification({ orderId, to }),
    );
  }
}
