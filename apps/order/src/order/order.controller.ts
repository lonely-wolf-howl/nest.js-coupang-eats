import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { DeliveryStartedDto } from './dto/delivery-started.dto';
import { OrderStatus } from './entity/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern({ cmd: 'create_order' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async createOrder(@Payload() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }

  @EventPattern({ cmd: 'delivery_started' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    return await this.orderService.changeOrderStatus(
      payload.id,
      OrderStatus.deliveryStarted,
    );
  }
}
