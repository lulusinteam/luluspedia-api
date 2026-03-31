import { Module } from '@nestjs/common';
import { RelationalWishlistPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';

@Module({
  imports: [RelationalWishlistPersistenceModule],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService, RelationalWishlistPersistenceModule],
})
export class WishlistsModule {}
