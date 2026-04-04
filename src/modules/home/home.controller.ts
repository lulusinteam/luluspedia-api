import { Get } from '@nestjs/common';

import { HomeService } from './home.service';

import { UserController } from '../../utils/decorators/api-controllers.decorator';

@UserController('', { isPublic: true })
export class HomeController {
  constructor(private service: HomeService) {}

  @Get()
  appInfo() {
    return this.service.appInfo();
  }
}
