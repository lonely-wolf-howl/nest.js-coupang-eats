import { PaymentModel } from '../../../domain/payment.domain';
import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { Model } from 'mongoose';
import { PaymentDocument } from './document/payment.document';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentDocumentMapper } from './mapper/payment-document.mapper';
import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export class MongooseAdapter
  implements DatabaseOutputPort, OnModuleInit, OnModuleDestroy
{
  constructor(
    @InjectModel(PaymentDocument.name)
    private readonly paymentModel: Model<PaymentDocument>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaService: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
  }

  async onModuleDestroy() {
    await this.kafkaService.close();
  }

  async savePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);

    const mapper = new PaymentDocumentMapper(model);

    const payload = mapper.toPaymentQueryMicroservicePayload();
    console.log('[producer] emit payment.created =>', payload);

    this.kafkaService.emit('payment.created', payload).subscribe({
      next: () => console.log('[producer] emitted payment.created'),
      error: (err) =>
        console.error('[producer] emit error payment.created', err),
    });

    return mapper.toDomain();
  }

  async updatePayment(payment: PaymentModel): Promise<PaymentModel> {
    const model = await this.paymentModel.create(payment);

    const mapper = new PaymentDocumentMapper(model);

    const payload = mapper.toPaymentQueryMicroservicePayload();
    console.log('[producer] emit payment.updated =>', payload);

    this.kafkaService.emit('payment.updated', payload).subscribe({
      next: () => console.log('[producer] emitted payment.updated'),
      error: (err) =>
        console.error('[producer] emit error payment.updated', err),
    });

    return mapper.toDomain();
  }
}
