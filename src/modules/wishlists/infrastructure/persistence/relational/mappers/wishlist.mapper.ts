import { Wishlist } from '../../../../domain/wishlist';
import { WishlistEntity } from '../entities/wishlist.entity';
import { UserMapper } from '../../../../../../modules/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserEntity } from '../../../../../../modules/users/infrastructure/persistence/relational/entities/user.entity';

export class WishlistMapper {
  static toDomain(raw: WishlistEntity): Wishlist {
    const domainEntity = new Wishlist();
    domainEntity.id = raw.id;
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }
    domainEntity.wishlistableId = raw.wishlistableId;
    domainEntity.wishlistableType = raw.wishlistableType;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Wishlist): WishlistEntity {
    let user: UserEntity | undefined = undefined;

    if (domainEntity.user) {
      user = new UserEntity();
      user.id = domainEntity.user.id;
    }

    const persistenceEntity = new WishlistEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.user = user;
    persistenceEntity.wishlistableId = domainEntity.wishlistableId;
    persistenceEntity.wishlistableType = domainEntity.wishlistableType;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
