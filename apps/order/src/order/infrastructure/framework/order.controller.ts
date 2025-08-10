import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcInterceptor, OrderMicroservice } from '@app/common';
import { CreateOrderUseCase } from '../../use-case/create-order.use-case';
import { StartDeliveryUseCase } from '../../use-case/start-delivery.use-case';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly startDeliveryUseCase: StartDeliveryUseCase,
  ) {}

  async createOrder(request: OrderMicroservice.CreateOrderRequest) {
    return this.createOrderUseCase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );
  }

  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    return await this.startDeliveryUseCase.execute(request.id);
  }
}
