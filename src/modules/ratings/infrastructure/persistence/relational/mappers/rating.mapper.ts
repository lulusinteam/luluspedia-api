import { Rating } from '../../../../domain/rating';
import { RatingEntity } from '../entities/rating.entity';
import { UserMapper } from '../../../../../../modules/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserEntity } from '../../../../../../modules/users/infrastructure/persistence/relational/entities/user.entity';

export class RatingMapper {
  static toDomain(raw: RatingEntity): Rating {
    const domainEntity = new Rating();
    domainEntity.id = raw.id;
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }
    domainEntity.rateableId = raw.rateableId;
    domainEntity.rateableType = raw.rateableType;
    domainEntity.score = raw.score;
    domainEntity.review = raw.review;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Rating): RatingEntity {
    let user: UserEntity | undefined = undefined;

    if (domainEntity.user) {
      user = new UserEntity();
      user.id = domainEntity.user.id;
    }

    const persistenceEntity = new RatingEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.user = user;
    persistenceEntity.rateableId = domainEntity.rateableId;
    persistenceEntity.rateableType = domainEntity.rateableType;
    persistenceEntity.score = domainEntity.score;
    persistenceEntity.review = domainEntity.review;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;

    return persistenceEntity;
  }
}
