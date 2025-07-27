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
}
