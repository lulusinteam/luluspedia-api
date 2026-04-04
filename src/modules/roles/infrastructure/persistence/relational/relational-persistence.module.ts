import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { RoleRepository } from '../role.repository';
import { RolesRelationalRepository } from './repositories/role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [
    {
      provide: RoleRepository,
      useClass: RolesRelationalRepository,
    },
  ],
  exports: [RoleRepository],
})
export class RelationalRolePersistenceModule {}
