import { USER_SERVICE } from '@app/common';
import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientProxy,
  ) {}

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const token = this.getRawToken(req);
    if (!token) {
      next();
      return;
    }

    req.user = await this.verifyToken(token);

    next();
  }

  getRawToken(req: any): string | null {
    return req.headers['authorization'];
  }

  async verifyToken(token: string) {
    const result = await lastValueFrom(
      this.userMicroservice.send({ cmd: 'parse_bearer_token' }, { token }),
    );
    if (result.status === 'error') {
      throw new UnauthorizedException(result);
    }
    return result.data;
  }
}
