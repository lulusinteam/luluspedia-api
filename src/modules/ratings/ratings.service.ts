import { Injectable } from '@nestjs/common';
import { RatingRepository } from './infrastructure/persistence/rating.repository';
import { CreateRatingDto } from './dto/create-rating.dto';
import { Rating } from './domain/rating';
import { User } from '../users/domain/user';
import { NotificationsService } from '../notifications/services/notifications.service';

@Injectable()
export class RatingsService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createRatingDto: CreateRatingDto, user: User): Promise<Rating> {
    const rating = await this.ratingRepository.create({
      ...createRatingDto,
      user,
    } as Rating);

    // Notify Admin of new review
    this.notificationsService
      .notifyNewReview(
        `${user.firstName || 'User'} ${user.lastName || ''}`,
        `${createRatingDto.rateableType}: ${createRatingDto.rateableId}`,
        createRatingDto.score,
        createRatingDto.review || 'No comment',
      )
      .catch(e => console.error('Notification error:', e));

    return rating;
  }

  async findAll(paginationOptions: any): Promise<Rating[]> {
    return this.ratingRepository.findAllWithPagination({
      paginationOptions,
    });
  }
}
