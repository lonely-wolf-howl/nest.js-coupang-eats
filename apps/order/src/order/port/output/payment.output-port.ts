import { OrderDomain } from '../../domain/order.domain';
import { PaymentDto } from '../../use-case/dto/create-order.dto';

export interface PaymentOutputPort {
  processPayment(order: OrderDomain, payment: PaymentDto): Promise<OrderDomain>;
}
