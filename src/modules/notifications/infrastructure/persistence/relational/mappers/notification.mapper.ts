import { Notification } from '../../../../domain/notification';
import { NotificationEntity } from '../entities/notification.entity';
import { UserMapper } from '../../../../../../modules/users/infrastructure/persistence/relational/mappers/user.mapper';

export class NotificationMapper {
  static toDomain(raw: NotificationEntity): Notification {
    const domain = new Notification();
    domain.id = raw.id;
    if (raw.user) {
      domain.user = UserMapper.toDomain(raw.user);
    }
    domain.title = raw.title || '';
    domain.message = raw.message;
    domain.isRead = raw.isRead;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deletedAt = raw.deletedAt || undefined;

    return domain;
  }

  static toPersistence(domain: Notification): NotificationEntity {
    const entity = new NotificationEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    if (domain.user) {
      entity.user = UserMapper.toPersistence(domain.user);
    }
    entity.title = domain.title;
    entity.message = domain.message;
    entity.isRead = domain.isRead;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    // TypeORM handles deletedAt automatically, but we can sync if provided
    if (domain.deletedAt) {
      entity.deletedAt = domain.deletedAt;
    }

    return entity;
  }
}
