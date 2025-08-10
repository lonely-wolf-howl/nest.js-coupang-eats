import { UserOutputPort } from '../../port/output/user.output-port';
import { Inject, OnModuleInit } from '@nestjs/common';
import { USER_SERVICE, UserMicroservice } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CustomerDomain } from '../../domain/customer.domain';
import { lastValueFrom } from 'rxjs';
import { GetUserInfoResponseMapper } from './mapper/get-user-info-response.mapper';

export class UserGrpc implements UserOutputPort, OnModuleInit {
  userService: UserMicroservice.UserServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroservice.getService<UserMicroservice.UserServiceClient>(
        'UserService',
      );
  }

  async getUserById(userId: string): Promise<CustomerDomain> {
    const response = await lastValueFrom(
      this.userService.getUserInfo({ userId }),
    );

    return new GetUserInfoResponseMapper(response).toDomain();
  }
}
