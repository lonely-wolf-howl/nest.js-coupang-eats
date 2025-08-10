import { OrderDomain } from '../../../domain/order.domain';
import { OrderOutputPort } from '../../../port/output/order.output-port';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDocument } from '../entity/order.entity';
import { OrderDocumentMapper } from '../mapper/order-document.mapper';

export class OrderRepository implements OrderOutputPort {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderRepository: Model<OrderDocument>,
  ) {}

  async getOrder(orderId: string): Promise<OrderDomain> {
    const order = await this.orderRepository.findById(orderId);

    return new OrderDocumentMapper(order).toDomain();
  }

  async createOrder(order: OrderDomain): Promise<OrderDomain> {
    const result = await this.orderRepository.create(order);

    return new OrderDocumentMapper(result).toDomain();
  }

  async updateOrder(order: OrderDomain): Promise<OrderDomain> {
    const { id, ...rest } = order;

    const result = await this.orderRepository.findByIdAndUpdate(id, rest, {
      new: true,
    });

    return new OrderDocumentMapper(result).toDomain();
  }
}
