import { Injectable } from '@nestjs/common';
import { TryoutsService } from '../tryouts/tryouts.service';

@Injectable()
export class SearchService {
  constructor(private readonly tryoutsService: TryoutsService) {}

  async globalSearch(query: string) {
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
}
