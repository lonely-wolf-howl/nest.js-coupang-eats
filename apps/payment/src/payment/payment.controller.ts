import { Controller } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentMicroservice } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';

@Controller()
@PaymentMicroservice.PaymentServiceControllerMethods()
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
