import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationStatus } from './entity/notification.entity';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import {
  constructMetadata,
  ORDER_SERVICE,
  OrderMicroservice,
} from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class NotificationService implements OnModuleInit, OnModuleDestroy {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );

    await this.kafkaService.connect();
  }

  async onModuleDestroy() {
    await this.kafkaService.close();
  }

  async sendPaymentNotification(
    payload: SendPaymentNotificationDto,
    metadata: Metadata,
  ) {
    const notification = await this.createNotification(payload.to);

    try {
      throw new Error('Saga Pattern Test');

      await this.sendEmail();

      await this.updateNotificationStatus(
        notification._id.toString(),
        NotificationStatus.sent,
      );

      this.fireAndForget(
        this.sendDeliveryStartedMessage(payload.orderId, metadata),
      );

      return this.notificationModel.findById(notification._id);
    } catch (e) {
      this.kafkaService.emit('order.notification.fail', payload.orderId);

      return this.notificationModel.findById(notification._id);
    }
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

  private fireAndForget<T>(promise: Promise<T>, ctx: Record<string, any> = {}) {
    void promise.catch((err) => {
      console.error({ err, ...ctx });
    });
  }

  async sendDeliveryStartedMessage(orderId: string, metadata: Metadata) {
    await lastValueFrom(
      this.orderService.deliveryStarted(
        { id: orderId },
        constructMetadata(
          NotificationService.name,
          'sendDeliveryStartedMessage',
          metadata,
        ),
      ),
    );
  }
}
