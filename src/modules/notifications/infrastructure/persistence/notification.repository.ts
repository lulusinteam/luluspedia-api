import { Notification } from '../../domain/notification';
import { User } from '../../../users/domain/user';

export abstract class NotificationRepository {
  abstract create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Notification>;

  abstract findManyByUserId(userId: User['id']): Promise<Notification[]>;

  abstract countUnreadByUserId(userId: User['id']): Promise<number>;

  abstract markAsRead(id: Notification['id']): Promise<void>;

  abstract markAllAsRead(userId: User['id']): Promise<void>;
}
