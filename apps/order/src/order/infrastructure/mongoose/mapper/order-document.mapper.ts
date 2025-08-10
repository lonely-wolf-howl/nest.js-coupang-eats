import { OrderDocument } from '../entity/order.entity';
import { OrderDomain } from '../../../domain/order.domain';

export class OrderDocumentMapper {
  constructor(private readonly document: OrderDocument) {}

  toDomain(): OrderDomain {
    const order = new OrderDomain({
      customer: this.document.customer,
      products: this.document.products,
      deliveryAddress: this.document.deliveryAddress,
      status: this.document.status,
    });

    order.setId(this.document._id.toString());
    order.setPayment(this.document.payment);

    return order;
  }
}
