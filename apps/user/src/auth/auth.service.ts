import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register-dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(rawToken: string, registerDto: RegisterDto) {
    const { email, password } = this.parseBasicToken(rawToken);

    return this.userService.create({
      ...registerDto,
      email,
      password,
    });
  }

  parseBasicToken(rawToken: string) {
    const basicSplit = rawToken.split(' ');

    if (basicSplit.length !== 2) {
      throw new BadRequestException();
    }

    const [basic, token] = basicSplit;

    if (basic.toLowerCase() !== 'basic') {
      throw new BadRequestException();
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');

    const tokenSplit = decoded.split(':');

    if (tokenSplit.length !== 2) {
      throw new BadRequestException();
    }

    const [email, password] = tokenSplit;

    return { email, password };
  }
}
