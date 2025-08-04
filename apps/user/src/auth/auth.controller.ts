import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParseBearerTokenDto } from './dto/parse-bearer-token.dto';
import { RpcInterceptor } from '@app/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async registerUser(@Payload() payload: RegisterDto) {
    const { token } = payload;
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.register(token, payload);
  }

  @MessagePattern({ cmd: 'login' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async loginUser(@Payload() payload: LoginDto) {
    const { token } = payload;
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.login(token);
  }

  @MessagePattern({ cmd: 'parse_bearer_token' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async parseBearerToken(@Payload() payload: ParseBearerTokenDto) {
    return this.authService.parseBearerToken(payload.token, false);
  }
}
