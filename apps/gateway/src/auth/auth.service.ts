import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE, UserMicroservice } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { constructMetadata } from '@app/common/grpc/utils/construct-metadata.utils';

@Injectable()
export class AuthService implements OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userMicroservice.getService<UserMicroservice.AuthServiceClient>(
        'AuthService',
      );
  }

  async register(token: string, registerDto: RegisterDto) {
    return await lastValueFrom(
      this.authService.registerUser(
        { token, ...registerDto },
        constructMetadata(AuthService.name, 'register'),
      ),
    );
  }

  async login(token: string) {
    return await lastValueFrom(
      this.authService.loginUser(
        { token },
        constructMetadata(AuthService.name, 'login'),
      ),
    );
  }
}
