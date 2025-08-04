import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientProxy,
  ) {}

  async createSamples() {
    return await lastValueFrom(
      this.productMicroservice.send({ cmd: 'create_samples' }, {}),
    );
  }
}
