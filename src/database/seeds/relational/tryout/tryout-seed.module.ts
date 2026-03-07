import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TryoutEntity } from '../../../../modules/tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { QuestionEntity } from '../../../../modules/questions/infrastructure/persistence/relational/entities/question.entity';
import { OptionEntity } from '../../../../modules/options/infrastructure/persistence/relational/entities/option.entity';
import { CategoryEntity } from '../../../../modules/categories/infrastructure/persistence/relational/entities/category.entity';
import { TryoutSeedService } from './tryout-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TryoutEntity,
      QuestionEntity,
      OptionEntity,
      CategoryEntity,
    ]),
  ],
  providers: [TryoutSeedService],
  exports: [TryoutSeedService],
})
export class TryoutSeedModule {}
