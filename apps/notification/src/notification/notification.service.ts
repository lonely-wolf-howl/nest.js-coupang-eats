import { Inject, Injectable } from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE } from '@app/common';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderService: ClientProxy,
  ) {}

  async sendPaymentNotification(payload: SendPaymentNotificationDto) {
    const notification = await this.createNotification(payload.to);

    await this.sendEmail();

    await this.updateNotificationStatus(
      notification._id.toString(),
      NotificationStatus.sent,
    );

    this.sendDeliveryStartedMessage(payload.orderId);

    return this.notificationModel.findById(notification._id);
  }

  private async createNotification(to: string) {
    return this.notificationModel.create({
      from: 'jay@toss.com',
      to: to,
      subject: 'Your order has been shipped',
      content: `Dear ${to}, your order has been shipped and is currently in transit.`,
    });
  }

  private async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  private async updateNotificationStatus(
    id: string,
    status: NotificationStatus,
  ) {
    return this.notificationModel.findByIdAndUpdate(id, { status });
  }

  private sendDeliveryStartedMessage(orderId: string) {
    return this.orderService.emit({ cmd: 'delivery_started' }, { id: orderId });
  }
}
