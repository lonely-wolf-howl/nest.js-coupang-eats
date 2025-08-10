import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CustomerDocument, CustomerSchema } from './customer.entity';
import {
  DeliveryAddressDocument,
  DeliveryAddressSchema,
} from './delivery-address.entity';
import { PaymentDocument, PaymentSchema } from './payment.entity';
import { ProductDocument, ProductSchema } from './product.entity';
import { Document, ObjectId } from 'mongoose';

export enum OrderStatus {
  pending = 'Pending',
  paymentCancelled = 'PaymentCancelled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deliveryDone = 'DeliveryDone',
}

@Schema()
export class OrderDocument extends Document<ObjectId> {
  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: CustomerDocument;

  @Prop({
    type: [ProductSchema],
    required: true,
  })
  products: ProductDocument[];

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  deliveryAddress: DeliveryAddressDocument;

  @Prop({
    type: String,
    required: true,
    enum: OrderStatus,
    default: OrderStatus.pending,
  })
  status: OrderStatus;

  @Prop({
    type: PaymentSchema,
  })
  payment: PaymentDocument;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
