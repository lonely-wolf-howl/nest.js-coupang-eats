import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMicroservice } from '@app/common';

@Controller()
export class UserController implements UserMicroservice.UserServiceController {
  constructor(private readonly userService: UserService) {}

  async getUserInfo(request: UserMicroservice.GetUserInfoRequest) {
    return await this.userService.getUserById(request.userId);
  }
}
