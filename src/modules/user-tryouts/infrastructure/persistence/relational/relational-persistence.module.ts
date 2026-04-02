import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTryoutEntity } from './entities/user-tryout.entity';
import { UserAnswerEntity } from './entities/user-answer.entity';
import { UserTryoutRepository } from '../user-tryout.repository';
import { UserTryoutRelationalRepository } from './repositories/user-tryout.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserTryoutEntity, UserAnswerEntity])],
  providers: [
    {
      provide: UserTryoutRepository,
      useClass: UserTryoutRelationalRepository,
    },
  ],
  exports: [UserTryoutRepository],
})
export class RelationalUserTryoutPersistenceModule {}
