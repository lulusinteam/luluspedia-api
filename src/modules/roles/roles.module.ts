import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesAdminController } from './roles-admin.controller';
import { RelationalRolePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalRolePersistenceModule],
  controllers: [RolesAdminController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
