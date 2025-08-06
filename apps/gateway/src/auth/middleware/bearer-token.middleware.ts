import { USER_SERVICE, UserMicroservice } from '@app/common';
import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
  authService: UserMicroservice.AuthServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.userService.getService<UserMicroservice.AuthServiceClient>(
        'AuthService',
      );
  }

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
    return await lastValueFrom(this.authService.parseBearerToken({ token }));
  }
}
