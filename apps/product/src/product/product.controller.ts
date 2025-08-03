import {
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetProductsInfo } from './dto/get-products-info.dto';
import { RpcInterceptor } from '@app/common/interceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('samples')
  async createSamples() {
    return await this.productService.createSamples();
  }

  @MessagePattern({ cmd: 'get_products_info' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async getProductsInfo(@Payload() payload: GetProductsInfo) {
    return await this.productService.getProductsInfo(payload.productIds);
  }
}
