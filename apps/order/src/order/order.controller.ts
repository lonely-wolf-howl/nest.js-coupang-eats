import { Controller } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderStatus } from './entity/order.entity';
import { OrderMicroservice } from '@app/common';
import { PaymentMethod } from './entity/payment.entity';

@Controller('order')
@OrderMicroservice.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroservice.OrderServiceController
{
  constructor(private readonly orderService: OrderService) {}

  async createOrder(request: OrderMicroservice.CreateOrderRequest) {
    return this.orderService.createOrder({
      ...request,
      payment: {
        ...request.payment,
        paymentMethod: request.payment.paymentMethod as PaymentMethod,
      },
    });
  }

  async deliveryStarted(request: OrderMicroservice.DeliveryStartedRequest) {
    return await this.orderService.changeOrderStatus(
      request.id,
      OrderStatus.deliveryStarted,
    );
  }
}
