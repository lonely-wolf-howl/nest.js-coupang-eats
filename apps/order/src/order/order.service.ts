import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientGrpc } from '@nestjs/microservices';
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
import {
  UserMicroservice,
  ProductMicroservice,
  PaymentMicroservice,
} from '@app/common';

@Injectable()
export class OrderService implements OnModuleInit {
  userService: UserMicroservice.UserServiceClient;
  productService: ProductMicroservice.ProductServiceClient;
  paymentService: PaymentMicroservice.PaymentServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroservice: ClientGrpc,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
        'UserService',
      );
    this.productService =
      this.productMicroservice.getService<ProductMicroservice.ProductServiceClient>(
        'ProductService',
      );
    this.paymentService =
      this.paymentMicroservice.getService<PaymentMicroservice.PaymentServiceClient>(
        'PaymentService',
      );
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { productIds, address, payment, meta } = createOrderDto;

    const user = await this.getUserFromToken(meta.user.sub);

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

  private async getUserFromToken(userId: string) {
    return await lastValueFrom(this.userService.getUserInfo({ userId }));
  }

  private async getProductsByIds(productIds: string[]): Promise<Product[]> {
    const response = await lastValueFrom(
      this.productService.getProductsInfo({ productIds }),
    );

    return response.products.map((product) => ({
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
      const response = await lastValueFrom(
        this.paymentService.makePayment({ orderId, ...payment, userEmail }),
      );

      const isPaid = response.paymentStatus === 'Approved';
      const orderStatus = isPaid
        ? OrderStatus.paymentProcessed
        : OrderStatus.paymentFailed;

      if (orderStatus === OrderStatus.paymentFailed) {
        throw new PaymentFailedException(response);
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatus.paymentProcessed,
      });

      return response;
    } catch (e) {
      if (e instanceof PaymentFailedException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatus.paymentFailed,
        });
      }
      throw e;
    }
  }

  async changeOrderStatus(id: string, status: OrderStatus) {
    return this.orderModel.findByIdAndUpdate(id, { status });
  }
}
