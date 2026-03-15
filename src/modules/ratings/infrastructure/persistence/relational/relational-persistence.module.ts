import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingEntity } from './entities/rating.entity';
import { RatingRepository } from '../rating.repository';
import { RatingRelationalRepository } from './repositories/rating.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity])],
  providers: [
    {
      provide: RatingRepository,
      useClass: RatingRelationalRepository,
    },
  ],
  exports: [RatingRepository],
})
export class RelationalRatingPersistenceModule {}
