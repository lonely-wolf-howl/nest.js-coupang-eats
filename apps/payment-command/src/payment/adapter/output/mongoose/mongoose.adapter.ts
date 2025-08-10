import { PaymentModel } from '../../../domain/payment.domain';
import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { Model } from 'mongoose';
import { PaymentDocument } from './document/payment.document';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDocumentMapper } from './mapper/payment-document.mapper';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class MongooseAdapter implements DatabaseOutputPort {
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async savePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);

    const mapper = new PaymentDocumentMapper(model);
    const payload = mapper.toPaymentQueryMicroservicePayload();

    this.kafkaService.emit('payment.created', payload);

    return mapper.toDomain();
  }

  async updatePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);

    const mapper = new PaymentDocumentMapper(model);
    const payload = mapper.toPaymentQueryMicroservicePayload();

    this.kafkaService.emit('payment.updated', payload);

    return mapper.toDomain();
  }

  async findPaymentByOrderId(orderId: string): Promise<PaymentModel> {
    const model = await this.paymentModel.findOne({
      orderId,
    });

    const mapper = new PaymentDocumentMapper(model);

    return mapper.toDomain();
  }
}
