import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE, UserMeta, UserPayloadDto } from '@app/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientProxy,
  ) {}

  async createOrder(
    userPayload: UserPayloadDto,
    createOrderDto: CreateOrderDto,
  ) {
    return await lastValueFrom(
      this.orderMicroservice.send<any, UserMeta & CreateOrderDto>(
        { cmd: 'create_order' },
        {
          meta: {
            user: userPayload,
          },
          ...createOrderDto,
        },
      ),
    );
  }
}
