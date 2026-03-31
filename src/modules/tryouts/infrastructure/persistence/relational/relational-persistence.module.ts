import { Module } from '@nestjs/common';
import { TryoutRepository } from '../tryout.repository';
import { TryoutRelationalRepository } from './repositories/tryout.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TryoutEntity } from './entities/tryout.entity';
import { CategoryEntity } from '../../../../categories/infrastructure/persistence/relational/entities/category.entity';
import { WishlistEntity } from '../../../../wishlists/infrastructure/persistence/relational/entities/wishlist.entity';
import { RatingEntity } from '../../../../ratings/infrastructure/persistence/relational/entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TryoutEntity,
      CategoryEntity,
      WishlistEntity,
      RatingEntity,
    ]),
  ],
  providers: [
    {
      provide: TryoutRepository,
      useClass: TryoutRelationalRepository,
    },
  ],
  exports: [TryoutRepository],
})
export class RelationalTryoutPersistenceModule {}
