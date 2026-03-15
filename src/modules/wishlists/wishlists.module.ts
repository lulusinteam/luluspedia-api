import { Module } from '@nestjs/common';
import { RelationalWishlistPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalWishlistPersistenceModule],
  providers: [],
  exports: [RelationalWishlistPersistenceModule],
})
export class WishlistsModule {}
