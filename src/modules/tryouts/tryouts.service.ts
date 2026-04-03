import { Injectable } from '@nestjs/common';
import { TryoutRepository } from './infrastructure/persistence/tryout.repository';
import { CreateTryoutDto } from './dto/create-tryout.dto';
import { Tryout } from './domain/tryout';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { UpdateTryoutDto } from './dto/update-tryout.dto';
import { NullableType } from '../../utils/types/nullable.type';

import { NotificationsService } from '../notifications/services/notifications.service';
import { TryoutStatusEnum } from './tryouts.enum';

@Injectable()
export class TryoutsService {
  constructor(
    private readonly tryoutRepository: TryoutRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createTryoutDto: CreateTryoutDto): Promise<Tryout> {
    return this.tryoutRepository.create({
      ...createTryoutDto,
    } as Tryout);
  }

  async findAllAdmin({
    paginationOptions,
    search,
    status,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    status?: string;
  }): Promise<[(Tryout & { questionCount: number })[], number]> {
    return this.tryoutRepository.findAllAdmin({
      paginationOptions,
      search,
      status,
    });
  }

  async getStats(): Promise<Record<string, number>> {
    return this.tryoutRepository.countByStatus();
  }

  async findAllUser({
    paginationOptions,
    search,
    category,
    isWishlist,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    category?: string;
    isWishlist?: boolean;
    userId?: string;
  }): Promise<[Tryout[], number]> {
    return this.tryoutRepository.findAllUser({
      paginationOptions,
      search,
      category,
      isWishlist,
      userId,
    });
  }

  async findOne(id: Tryout['id']): Promise<NullableType<Tryout>> {
    return this.tryoutRepository.findById(id);
  }

  async findOneUser(
    id: Tryout['id'],
    userId: string,
  ): Promise<NullableType<Tryout>> {
    return this.tryoutRepository.findByIdUser(id, userId);
  }

  async update(
    id: Tryout['id'],
    updateTryoutDto: UpdateTryoutDto,
  ): Promise<Tryout | null> {
    const updated = await this.tryoutRepository.update(id, updateTryoutDto);

    if (updated && updateTryoutDto.status === TryoutStatusEnum.published) {
      this.notificationsService
        .notifyTryoutPublished(updated.title || 'Untitled Tryout')
        .catch(e => console.error('Notification error:', e));
    }

    return updated;
  }

  async softDelete(id: Tryout['id']): Promise<void> {
    await this.tryoutRepository.remove(id);
  }

  async globalSearch(query: string): Promise<Tryout[]> {
    return this.tryoutRepository.globalSearch(query);
  }
}
