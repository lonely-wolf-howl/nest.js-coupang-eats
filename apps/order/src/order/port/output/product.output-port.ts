import { ProductDomain } from '../../domain/product.domain';

export interface ProductOutputPort {
  getProductsByIds(productIds: string[]): Promise<ProductDomain[]>;
}
