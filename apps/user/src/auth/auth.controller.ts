import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserMicroservice } from '@app/common';

@Controller('auth')
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async registerUser(request: UserMicroservice.RegisterUserRequest) {
    const { token } = request;
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.register(token, request);
  }

  async loginUser(request: UserMicroservice.LoginUserRequest) {
    const { token } = request;
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.login(token);
  }

  async parseBearerToken(request: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(request.token, false);
  }
}
