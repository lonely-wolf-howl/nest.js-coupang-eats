import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationMicroservice } from '@app/common';

@Controller()
export class NotificationController
  implements NotificationMicroservice.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  async sendPaymentNotification(
    request: NotificationMicroservice.SendPaymentNotificationRequest,
  ) {
    return await this.notificationService.sendPaymentNotification(request);
  }
}
