import { CreateOrderDto } from './dto/create-order.dto';
import { UserOutputPort } from '../port/output/user.output-port';
import { ProductOutputPort } from '../port/output/product.output-port';
import { OrderDomain } from '../domain/order.domain';
import { OrderOutputPort } from '../port/output/order.output-port';
import { PaymentOutputPort } from '../port/output/payment.output-port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('UserOutputPort')
    private readonly userOutputPort: UserOutputPort,
    @Inject('ProductOutputPort')
    private readonly productOutputPort: ProductOutputPort,
    @Inject('OrderOutputPort')
    private readonly orderOutputPort: OrderOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOutputPort,
  ) {}

  async execute(dto: CreateOrderDto) {
    const user = await this.userOutputPort.getUserById(dto.userId);

    const products = await this.productOutputPort.getProductsByIds(
      dto.productIds,
    );

    const order = new OrderDomain({
      customer: user,
      products: products,
      deliveryAddress: dto.address,
    });

    order.calculateTotalAmount();

    const result = await this.orderOutputPort.createOrder(order);

    order.setId(result.id);

    try {
      const paymentResult = await this.paymentOutputPort.processPayment(
        order,
        dto.payment,
      );

      order.setPayment(paymentResult.payment);

      order.processPayment();
      await this.orderOutputPort.updateOrder(order);

      return order;
    } catch (e) {
      order.cancelOrder();
      await this.orderOutputPort.updateOrder(order);

      return order;
    }
  }
}
