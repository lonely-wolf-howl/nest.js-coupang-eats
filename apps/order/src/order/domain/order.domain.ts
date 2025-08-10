import { CustomerDomain } from './customer.domain';
import { ProductDomain } from './product.domain';
import { DeliveryAddressDomain } from './delivery-address.domain';
import { PaymentDomain } from './payment.domain';
import { OrderStatus } from './order.vo';

export class OrderDomain {
  id: string;
  customer: CustomerDomain;
  products: ProductDomain[];
  deliveryAddress: DeliveryAddressDomain;
  status: OrderStatus;
  payment: PaymentDomain;
  totalAmount: number;

  constructor(param: {
    customer: CustomerDomain;
    products: ProductDomain[];
    deliveryAddress: DeliveryAddressDomain;
    status?: OrderStatus;
  }) {
    this.customer = param.customer;
    this.products = param.products;
    this.deliveryAddress = param.deliveryAddress;

    if (param.status === undefined) {
      this.status = OrderStatus.pending;
    } else {
      this.status = param.status;
    }
  }

  setId(id: string) {
    this.id = id;
  }

  setPayment(payment: PaymentDomain) {
    if (!this.id) {
      throw new Error('');
    }
    this.payment = payment;
  }

  calculateTotalAmount() {
    if (this.products.length === 0) {
      throw new Error('');
    }
    const total = this.products.reduce((acc, n) => acc + n.price, 0);

    if (total <= 0) {
      throw new Error('');
    }

    this.totalAmount = total;
  }

  processPayment() {
    if (!this.id) {
      throw new Error('');
    }
    if (this.products.length === 0) {
      throw new Error('');
    }
    if (!this.deliveryAddress) {
      throw new Error('');
    }
    if (!this.totalAmount) {
      throw new Error('');
    }
    if (this.status !== OrderStatus.pending) {
      throw new Error('');
    }
    this.status = OrderStatus.paymentProcessed;
  }

  cancelOrder() {
    this.status = OrderStatus.paymentCancelled;
  }

  startDelivery() {
    if (this.status !== OrderStatus.paymentProcessed) {
      throw new Error(`order status :: ${this.status}}`);
    }
    this.status = OrderStatus.deliveryStarted;
  }

  finishDelivery() {
    if (this.status !== OrderStatus.deliveryStarted) {
      throw new Error('');
    }
    this.status = OrderStatus.deliveryDone;
  }
}
