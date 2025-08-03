import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: ClientProxy,
  ) {}

  async createOrder(token: string, createOrderDto: CreateOrderDto) {
    const user = await this.getUserFormToken(token);
  }

  async getUserFormToken(token: string) {
    await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );
  }
}
