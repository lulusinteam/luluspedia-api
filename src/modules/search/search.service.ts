import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TryoutsService } from '../tryouts/tryouts.service';
import { SearchHistoryEntity } from './infrastructure/persistence/relational/entities/search-history.entity';

@Injectable()
export class SearchService {
  constructor(
    private readonly tryoutsService: TryoutsService,
    @InjectRepository(SearchHistoryEntity)
    private readonly searchHistoryRepository: Repository<SearchHistoryEntity>,
  ) {}

  async globalSearch(query: string, userId?: string) {
    if (query && query.length > 2) {
      await this.logSearch(query, userId);
    }

    const tryouts = await this.tryoutsService.globalSearch(query);

    // Grouping results as per Approach B
    return {
      tryouts: tryouts.map(tryout => {
        // Find if any question matched the query to provide a snippet
        const matchedQuestion = tryout.questions?.find(q =>
          q.content.toLowerCase().includes(query.toLowerCase()),
        );

        return {
          id: tryout.id,
          title: tryout.title,
          description: tryout.description,
          category: tryout.category?.label,
          ratingAverage: tryout.ratingAverage,
          ratingCount: tryout.ratingCount,
          matchedQuestion: matchedQuestion
            ? {
                id: matchedQuestion.id,
                content: matchedQuestion.content,
              }
            : null,
        };
      }),
      courses: [], // Future implementation
    };
  }

  async logSearch(query: string, userId?: string) {
    await this.searchHistoryRepository.save(
      this.searchHistoryRepository.create({
        query,
        userId: userId || null,
      }),
    );
  }

  async getPopular(limit = 10) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await this.searchHistoryRepository
      .createQueryBuilder('history')
      .select('history.query', 'query')
      .addSelect('COUNT(history.id)', 'count')
      .where('history.createdAt >= :date', { date: thirtyDaysAgo })
      .groupBy('history.query')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map(r => ({
      query: r.query,
      count: parseInt(r.count),
    }));
  }
}
