import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { PAYMENT_SERVICE, PRODUCT_SERVICE, USER_SERVICE } from '@app/common';
import { PaymentCancelledExcpetion } from './exception/payment-cancelled.exception';
import { Product } from './entity/product.entity';
import { Customer } from './entity/customer.entity';
import { AddressDto } from './dto/address.dto';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './entity/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDto } from './dto/payment.dto';
import { PaymentFailedException } from './exception/payment-failed.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
    @Inject(PRODUCT_SERVICE)
    private readonly productService: ClientProxy,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentService: ClientProxy,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  async createOrder(token: string, createOrderDto: CreateOrderDto) {
    const { productIds, address, payment } = createOrderDto;

    const user = await this.getUserFormToken(token);

    const products = await this.getProductsByIds(productIds);

    const totalAmount = await this.calculateTotalAmount(products);

    await this.validatePaymentAmount(totalAmount, payment.amount);

    const customer = await this.createCustomer(user);

    const order = await this.createNewOrder(
      customer,
      products,
      address,
      payment,
    );

    await this.processPayment(order._id.toString(), payment, user.email);

    return this.orderModel.findById(order._id);
  }

  private async getUserFormToken(token: string) {
    const parseBearerTokenRes = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );
    if (parseBearerTokenRes.status === 'error') {
      throw new PaymentCancelledExcpetion(parseBearerTokenRes);
    }

    const userId: string = parseBearerTokenRes.data.sub;

    const getUserInfoRes = await lastValueFrom(
      this.userService.send({ cmd: 'get_user_info' }, { userId }),
    );
    if (getUserInfoRes.status === 'error') {
      throw new PaymentCancelledExcpetion(getUserInfoRes);
    }

    return getUserInfoRes.data;
  }

  private async getProductsByIds(productIds: string[]): Promise<Product[]> {
    const getProductsInfoRes = await lastValueFrom(
      this.productService.send({ cmd: 'get_products_info' }, { productIds }),
    );
    if (getProductsInfoRes.status === 'error') {
      throw new PaymentCancelledExcpetion(getProductsInfoRes);
    }

    return getProductsInfoRes.data.map((product) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }

  private async calculateTotalAmount(products: Product[]) {
    return products.reduce((acc, next) => acc + next.price, 0);
  }

  private async validatePaymentAmount(totalA: number, totalB: number) {
    if (totalA !== totalB) {
      throw new PaymentCancelledExcpetion('');
    }
  }

  private async createCustomer(user: {
    id: string;
    email: string;
    name: string;
  }) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private async createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }

  private async processPayment(
    orderId: string,
    payment: PaymentDto,
    userEmail: string,
  ) {
    try {
      const makePaymentRes = await lastValueFrom(
        this.paymentService.send(
          { cmd: 'make_payment' },
          { orderId, ...payment, userEmail },
        ),
      );
      if (makePaymentRes.status === 'error') {
        throw new PaymentFailedException(makePaymentRes);
      }

      const isPaid = makePaymentRes.data.paymentStatus === 'Approved';
      const orderStatus = isPaid
        ? OrderStatus.paymentProcessed
        : OrderStatus.paymentFailed;

      if (orderStatus === OrderStatus.paymentFailed) {
        throw new PaymentFailedException(makePaymentRes.error);
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.paymentProcessed,
      });

      return makePaymentRes;
    } catch (e) {
      if (e instanceof PaymentFailedException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatus.paymentFailed,
        });
      }
      throw e;
    }
  }
}
