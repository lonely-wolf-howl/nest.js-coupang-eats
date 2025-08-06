import { Controller, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcInterceptor, ProductMicroservice } from '@app/common';

@Controller('product')
@ProductMicroservice.ProductServiceControllerMethods()
@UseInterceptors(GrpcInterceptor)
export class ProductController
  implements ProductMicroservice.ProductServiceController
{
  constructor(private readonly productService: ProductService) {}

  async createSamples() {
    const response = await this.productService.createSamples();
    return { success: response };
  }

  async getProductsInfo(request: ProductMicroservice.GetProductsInfoRequest) {
    const response = await this.productService.getProductsInfo(
      request.productIds,
    );
    return { products: response };
  }
}
