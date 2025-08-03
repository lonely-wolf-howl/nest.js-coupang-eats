import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { Authorization } from './decorator/authorization.decorator';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { ParseBearerTokenDto } from './dto/parse-bearer-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Authorization() token: string,
    @Body() registerDto: RegisterDto,
  ) {
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.register(token, registerDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Authorization() token: string) {
    if (token === null) {
      throw new UnauthorizedException();
    }
    return await this.authService.login(token);
  }

  @MessagePattern({ cmd: 'parse_bearer_token' })
  @UsePipes(ValidationPipe)
  async parseBearerToken(@Payload() payload: ParseBearerTokenDto) {
    return this.authService.parseBearerToken(payload.token, false);
  }
}
