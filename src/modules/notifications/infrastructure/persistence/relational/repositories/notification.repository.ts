import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationMapper } from '../mappers/notification.mapper';
import { Notification } from '../../../../domain/notification';
import { NotificationRepository } from '../../notification.repository';
import { User } from '../../../../../users/domain/user';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';

@Injectable()
export class NotificationRelationalRepository
  implements NotificationRepository
{
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repository: Repository<NotificationEntity>,
  ) {}

  async create(
    data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Notification> {
    const persistenceModel = NotificationMapper.toPersistence(
      data as Notification,
    );
    const newEntity = await this.repository.save(
      this.repository.create(persistenceModel),
    );
    return NotificationMapper.toDomain(newEntity);
  }

  async findManyByUserId(userId: User['id']): Promise<Notification[]> {
    const entities = await this.repository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return entities.map(item => NotificationMapper.toDomain(item));
  }

  async findManyWithPagination({
    userId,
    paginationOptions,
  }: {
    userId: User['id'];
    paginationOptions: IPaginationOptions;
  }): Promise<[Notification[], number]> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: {
        user: {
          id: userId as string,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return [entities.map(entity => NotificationMapper.toDomain(entity)), total];
  }

  async countUnreadByUserId(userId: User['id']): Promise<number> {
    return this.repository.count({
      where: {
        user: { id: userId },
        isRead: false,
      },
    });
  }

  async markAsRead(id: Notification['id']): Promise<void> {
    await this.repository.update(id, { isRead: true });
  }

  async markAllAsRead(userId: User['id']): Promise<void> {
    await this.repository.update({ user: { id: userId } }, { isRead: true });
  }
}
