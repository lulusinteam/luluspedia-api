import { Injectable } from '@nestjs/common';
import { RoleRepository } from './infrastructure/persistence/role.repository';
import { Role } from './domain/role';

@Injectable()
export class RolesService {
  constructor(private readonly roleRepository: RoleRepository) {}

  findAll(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
}
