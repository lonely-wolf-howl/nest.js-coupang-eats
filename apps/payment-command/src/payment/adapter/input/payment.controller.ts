import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, PaymentMicroservice } from '@app/common';
import { PaymentMethod } from '../../domain/payment.vo';
import { PaymentService } from '../../application/payment.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  @UseInterceptors(GrpcInterceptor)
  async makePayment(request: PaymentMicroservice.MakePaymentRequest) {
    return await this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    });
  }

  @EventPattern('order.notification.fail')
  async orderNotificationFail(orderId: string) {
    await this.paymentService.cancelPayment(orderId);
  }
}
