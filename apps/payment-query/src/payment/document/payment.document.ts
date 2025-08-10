import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

enum PaymentStatus {
  pending = 'Pending',
  approved = 'Approved',
  rejected = 'Rejected',
}

@Schema()
export class PaymentDocument extends Document<ObjectId> {
  @Prop({
    required: true,
  })
  userEmail: string;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    type: String,
    required: true,
    enum: PaymentStatus,
    default: PaymentStatus.pending,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    required: true,
  })
  cardNumberLastFourDigits: string;

  @Prop({
    required: true,
  })
  orderId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
