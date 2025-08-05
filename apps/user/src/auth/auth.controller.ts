import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserMicroservice } from '@app/common';

@Controller('auth')
export class AuthController implements UserMicroservice.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async registerUser(data: UserMicroservice.RegisterUserRequest) {
    const { token } = data;
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.register(token, data);
  }

  async loginUser(data: UserMicroservice.LoginUserRequest) {
    const { token } = data;
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.login(token);
  }

  async parseBearerToken(data: UserMicroservice.ParseBearerTokenRequest) {
    return this.authService.parseBearerToken(data.token, false);
  }
}
