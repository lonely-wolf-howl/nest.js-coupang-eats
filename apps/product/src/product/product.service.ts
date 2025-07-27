import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createSamples() {
    const data = [
      {
        name: 'apple',
        price: 1000,
        description: '',
        stock: 1,
      },
      {
        name: 'banana',
        price: 2000,
        description: '',
        stock: 5,
      },
      {
        name: 'carrot',
        price: 1500,
        description: '',
        stock: 10,
      },
    ];

    await this.productRepository.save(data);

    return true;
  }
}
