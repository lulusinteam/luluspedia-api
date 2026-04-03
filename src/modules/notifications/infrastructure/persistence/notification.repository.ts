import { Notification } from '../../domain/notification';
import { User } from '../../../users/domain/user';
import { IPaginationOptions } from '../../../../utils/types/pagination-options';

export abstract class NotificationRepository {
  abstract create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Notification>;

  abstract findManyByUserId(userId: User['id']): Promise<Notification[]>;

  abstract findManyWithPagination({
    userId,
    paginationOptions,
  }: {
    userId: User['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<[Notification[], number]>;

  abstract countUnreadByUserId(userId: User['id']): Promise<number>;

  abstract markAsRead(id: Notification['id']): Promise<void>;

  abstract markAllAsRead(userId: User['id']): Promise<void>;
}
