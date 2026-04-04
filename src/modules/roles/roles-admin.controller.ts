import { Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { AdminController } from '../../utils/decorators/api-controllers.decorator';
import { ApiJSendResponse } from '../../utils/swagger-jsend.decorator';
import { Role } from './domain/role';

@AdminController('roles', { tagName: 'Roles' })
export class RolesAdminController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiJSendResponse(Role)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }
}
