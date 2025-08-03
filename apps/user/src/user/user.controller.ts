import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { GetUserInfoDto } from './dto/get-user-info.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'get_user_info' })
  @UsePipes(ValidationPipe)
  @UseInterceptors(RpcInterceptor)
  async getUserInfo(@Payload() payload: GetUserInfoDto) {
    return await this.userService.getUserById(payload.userId);
  }
}
