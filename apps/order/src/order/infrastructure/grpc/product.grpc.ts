import { ProductOutputPort } from '../../port/output/product.output-port';
import { Inject, OnModuleInit } from '@nestjs/common';
import { PRODUCT_SERVICE, ProductMicroservice } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProductDomain } from '../../domain/product.domain';
import { GetProductsInfoResponseMapper } from './mapper/get-products-info-response.mapper';

export class ProductGrpc implements ProductOutputPort, OnModuleInit {
  productService: ProductMicroservice.ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService =
      this.productMicroservice.getService<ProductMicroservice.ProductServiceClient>(
        'ProductService',
      );
  }

  async getProductsByIds(productIds: string[]): Promise<ProductDomain[]> {
    const response = await lastValueFrom(
      this.productService.getProductsInfo({ productIds }),
    );

    return new GetProductsInfoResponseMapper(response).toDomain();
  }
}
