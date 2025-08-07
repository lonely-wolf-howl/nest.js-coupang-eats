import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, PaymentMicroservice } from '@app/common';
import { PaymentMethod } from '../../domain/payment.vo';
import { PaymentService } from '../../application/payment.service';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class PaymentController
  implements PaymentMicroservice.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  async makePayment(request: PaymentMicroservice.MakePaymentRequest) {
    return await this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethod,
    });
  }
}
