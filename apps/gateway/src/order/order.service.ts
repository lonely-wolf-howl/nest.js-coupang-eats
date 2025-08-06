import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ORDER_SERVICE,
  UserPayloadDto,
  OrderMicroservice,
  constructMetadata,
} from '@app/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit {
  orderService: OrderMicroservice.OrderServiceClient;

  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderMicroservice.getService<OrderMicroservice.OrderServiceClient>(
        'OrderService',
      );
  }

  async createOrder(
    userPayload: UserPayloadDto,
    createOrderDto: CreateOrderDto,
  ) {
    return await lastValueFrom(
      this.orderService.createOrder(
        {
          meta: {
            user: userPayload,
          },
          ...createOrderDto,
        },
        constructMetadata(OrderService.name, 'createOrder'),
      ),
    );
  }
}
