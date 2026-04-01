import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTryoutEntity } from '../entities/user-tryout.entity';
import { UserTryoutRepository } from '../../user-tryout.repository';
import {
  UserTryout,
  UserTryoutStatusEnum,
} from '../../../../domain/user-tryout';
import { UserTryoutMapper } from '../mappers/user-tryout.mapper';
import { IPaginationOptions } from '../../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../../utils/types/nullable.type';

@Injectable()
export class UserTryoutRelationalRepository implements UserTryoutRepository {
  constructor(
    @InjectRepository(UserTryoutEntity)
    private readonly repository: Repository<UserTryoutEntity>,
  ) {}

  async create(data: UserTryout): Promise<UserTryout> {
    const persistenceModel = UserTryoutMapper.toPersistence(data);
    const newEntity = (await this.repository.save(
      this.repository.create(persistenceModel),
    )) as UserTryoutEntity;

    const reloaded = await this.repository
      .createQueryBuilder('user_tryout')
      .leftJoinAndSelect('user_tryout.tryout', 'tryout')
      .leftJoinAndSelect('tryout.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .leftJoinAndSelect('questions.image', 'questionImage')
      .leftJoinAndSelect('options.image', 'optionImage')
      .where('user_tryout.id = :id', { id: newEntity.id })
      .orderBy('questions.orderNumber', 'ASC')
      .getOne();

    return UserTryoutMapper.toDomain(reloaded!);
  }

  async findAll({
    paginationOptions,
    userId,
    tryoutId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
    tryoutId?: string;
  }): Promise<[UserTryout[], number]> {
    const query = this.repository
      .createQueryBuilder('user_tryout')
      .leftJoin('user_tryout.tryout', 'tryout')
      .select([
        'user_tryout.id',
        'user_tryout.startTime',
        'user_tryout.endTime',
        'user_tryout.totalScore',
        'user_tryout.status',
        'user_tryout.createdAt',
        'tryout.id',
        'tryout.passScore',
      ])
      .where('user_tryout.user = :userId', { userId });

    if (tryoutId) {
      query.andWhere('user_tryout.tryout = :tryoutId', { tryoutId });
    }

    query.orderBy('user_tryout.createdAt', 'DESC');

    const [entities, count] = await query
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .getManyAndCount();

    return [entities.map(entity => UserTryoutMapper.toDomain(entity)), count];
  }

  async findById(id: UserTryout['id']): Promise<NullableType<UserTryout>> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['user', 'tryout'],
    });

    return entity ? UserTryoutMapper.toDomain(entity) : null;
  }

  async update(
    id: UserTryout['id'],
    payload: Partial<UserTryout>,
  ): Promise<UserTryout | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) return null;

    const updatedEntity = await this.repository.save(
      this.repository.create(
        UserTryoutMapper.toPersistence({
          ...UserTryoutMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return UserTryoutMapper.toDomain(updatedEntity);
  }

  async findInProgressAttemptByUserId(
    userId: string,
  ): Promise<NullableType<UserTryout>> {
    const entity = await this.repository
      .createQueryBuilder('user_tryout')
      .leftJoinAndSelect('user_tryout.tryout', 'tryout')
      .leftJoinAndSelect('tryout.questions', 'questions')
      .leftJoinAndSelect('questions.options', 'options')
      .leftJoinAndSelect('questions.image', 'questionImage')
      .leftJoinAndSelect('options.image', 'optionImage')
      .where('user_tryout.user = :userId', { userId })
      .andWhere('user_tryout.status = :status', {
        status: UserTryoutStatusEnum.inProgress,
      })
      .orderBy('questions.orderNumber', 'ASC')
      .getOne();

    return entity ? UserTryoutMapper.toDomain(entity) : null;
  }

  async remove(id: UserTryout['id']): Promise<void> {
    await this.repository.delete(id);
  }
}
