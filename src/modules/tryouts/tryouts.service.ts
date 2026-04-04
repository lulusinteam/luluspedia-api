import { Injectable } from '@nestjs/common';
import { TryoutRepository } from './infrastructure/persistence/tryout.repository';
import { CreateTryoutDto } from './dto/create-tryout.dto';
import { Tryout } from './domain/tryout';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { UpdateTryoutDto } from './dto/update-tryout.dto';
import { NullableType } from '../../utils/types/nullable.type';

import { NotificationsService } from '../notifications/services/notifications.service';
import { TryoutStatusEnum } from './tryouts.enum';
import { TryoutStatsResponseDto } from './dto/tryout-stats-response.dto';

@Injectable()
export class TryoutsService {
  constructor(
    private readonly tryoutRepository: TryoutRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createTryoutDto: CreateTryoutDto): Promise<Tryout> {
    const tryout = await this.tryoutRepository.create({
      ...createTryoutDto,
    } as Tryout);

    // Notify if created with published status
    if (tryout && tryout.status === TryoutStatusEnum.published) {
      this.notificationsService
        .notifyTryoutPublished(tryout.title || 'Untitled Tryout')
        .catch(e => console.error('Notification error (Create):', e));
    }

    return tryout;
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

  async getStats(): Promise<TryoutStatsResponseDto> {
    return this.tryoutRepository.countByStatus() as unknown as TryoutStatsResponseDto;
  }

  async findAllUser({
    paginationOptions,
    search,
    category,
    isWishlist,
    isRecommended,
    userId,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    category?: string;
    isWishlist?: boolean;
    isRecommended?: boolean;
    userId?: string;
  }): Promise<[Tryout[], number]> {
    return this.tryoutRepository.findAllUser({
      paginationOptions,
      search,
      category,
      isWishlist,
      isRecommended,
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
    const tryoutBeforeUpdate = await this.tryoutRepository.findById(id);
    const updated = await this.tryoutRepository.update(id, updateTryoutDto);

    // Trigger notification ONLY if it becomes published (from other state)
    // OR if someone explicitly sets status to published in the request
    if (updated && updateTryoutDto.status === TryoutStatusEnum.published) {
      // Check if it was already published to avoid double notification
      if (tryoutBeforeUpdate?.status !== TryoutStatusEnum.published) {
        console.log(`DEBUG: Publishing tryout ${id}, triggering broadcast`);
        this.notificationsService
          .notifyTryoutPublished(updated.title || 'Untitled Tryout')
          .catch(e => console.error('Notification error (Update):', e));
      }
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
