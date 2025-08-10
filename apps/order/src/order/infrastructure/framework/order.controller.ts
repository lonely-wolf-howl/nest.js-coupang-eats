import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, OrderMicroservice } from '@app/common';
import { CreateOrderUseCase } from '../../use-case/create-order.use-case';
import { StartDeliveryUseCase } from '../../use-case/start-delivery.use-case';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';
import { EventPattern } from '@nestjs/microservices';
import { CancelOrderUseCase } from '../../use-case/cancel-order.use-case';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly startDeliveryUseCase: StartDeliveryUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  @UseInterceptors(GrpcInterceptor)
  async createOrder(request: OrderMicroservice.CreateOrderRequest) {
    return this.createOrderUseCase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );
  }

  @UseInterceptors(GrpcInterceptor)
  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    return await this.startDeliveryUseCase.execute(request.id);
  }

  @EventPattern('order.notification.fail')
  async orderNotificationFail(orderId: string) {
    await this.cancelOrderUseCase.execute(orderId);
  }
}
