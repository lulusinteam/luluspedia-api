import { Injectable } from '@nestjs/common';
import { TryoutRepository } from './infrastructure/persistence/tryout.repository';
import { CreateTryoutDto } from './dto/create-tryout.dto';
import { Tryout } from './domain/tryout';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { UpdateTryoutDto } from './dto/update-tryout.dto';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class TryoutsService {
  constructor(private readonly tryoutRepository: TryoutRepository) {}

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

  async findOne(id: Tryout['id']): Promise<NullableType<Tryout>> {
    return this.tryoutRepository.findById(id);
  }

  async update(
    id: Tryout['id'],
    updateTryoutDto: UpdateTryoutDto,
  ): Promise<Tryout | null> {
    return this.tryoutRepository.update(id, updateTryoutDto);
  }

  async softDelete(id: Tryout['id']): Promise<void> {
    await this.tryoutRepository.remove(id);
  }
}
