import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { USER_SERVICE } from '@app/common';
import { PaymentCancelledExcpetion } from './exception/payment-cancelled.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
  ) {}

  async createOrder(token: string, createOrderDto: CreateOrderDto) {
    const user = await this.getUserFormToken(token);
  }

  async getUserFormToken(token: string) {
    const parseBearerTokenRes = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );
    if (parseBearerTokenRes.status === 'error') {
      throw new PaymentCancelledExcpetion(parseBearerTokenRes);
    }

    const userId: string = parseBearerTokenRes.data.sub;

    const getUserInfoRes = await lastValueFrom(
      this.userService.send({ cmd: 'get_user_info' }, { userId }),
    );
    if (getUserInfoRes.status === 'error') {
      throw new PaymentCancelledExcpetion(getUserInfoRes);
    }

    return getUserInfoRes.data;
  }
}
