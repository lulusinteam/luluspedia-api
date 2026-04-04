import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';
import { Role } from '../../../../domain/role';
import { RoleRepository } from '../../role.repository';

@Injectable()
export class RolesRelationalRepository implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly rolesRepository: Repository<RoleEntity>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findById(id: Role['id']): Promise<Role | null> {
    const entity = await this.rolesRepository.findOne({
      where: { id: id as string },
    });

    return entity || null;
  }
}
