import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { MakePaymentDto } from './dto/make-payment.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @MessagePattern({ cmd: 'make_payment' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async makePayment(@Payload() payload: MakePaymentDto) {
    return await this.paymentService.makePayment(payload);
  }
}
