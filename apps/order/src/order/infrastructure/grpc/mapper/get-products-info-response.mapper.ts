import { ProductMicroservice } from '@app/common';
import { ProductDomain } from '../../../domain/product.domain';

export class GetProductsInfoResponseMapper {
  constructor(
    private readonly reponse: ProductMicroservice.GetProductsInfoResponse,
  ) {}

  toDomain(): ProductDomain[] {
    return this.reponse.products.map(
      (product) =>
        new ProductDomain({
          productId: product.id,
          name: product.name,
          price: product.price,
        }),
    );
  }
}
