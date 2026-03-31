import { Injectable } from '@nestjs/common';
import { UserTryoutRepository } from './infrastructure/persistence/user-tryout.repository';
import { UserTryout } from './domain/user-tryout';
import { IPaginationOptions } from '../../utils/types/pagination-options';

@Injectable()
export class UserTryoutsService {
  constructor(private readonly userTryoutRepository: UserTryoutRepository) {}

  async findAllMyAttempts({
    paginationOptions,
    userId,
    tryoutId,
  }: {
    paginationOptions: IPaginationOptions;
    userId: string;
    tryoutId?: string;
  }): Promise<[UserTryout[], number]> {
    return this.userTryoutRepository.findAll({
      paginationOptions,
      userId,
      tryoutId,
    });
  }
}
