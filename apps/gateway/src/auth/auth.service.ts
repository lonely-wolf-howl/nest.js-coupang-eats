import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientProxy,
  ) {}

  async register(token: string, registerDto: RegisterDto) {
    return await lastValueFrom(
      this.userMicroservice.send(
        { cmd: 'register' },
        { token, ...registerDto },
      ),
    );
  }

  async login(token: string) {
    return await lastValueFrom(
      this.userMicroservice.send({ cmd: 'login' }, { token }),
    );
  }
}
