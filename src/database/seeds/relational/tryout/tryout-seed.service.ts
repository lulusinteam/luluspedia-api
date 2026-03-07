import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TryoutEntity } from '../../../../modules/tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { QuestionEntity } from '../../../../modules/questions/infrastructure/persistence/relational/entities/question.entity';
import { OptionEntity } from '../../../../modules/options/infrastructure/persistence/relational/entities/option.entity';
import { CategoryEntity } from '../../../../modules/categories/infrastructure/persistence/relational/entities/category.entity';
import { createTryoutFactory } from '../../../../../test/factories/tryout.factory';
import { createQuestionFactory } from '../../../../../test/factories/question.factory';
import { createOptionFactory } from '../../../../../test/factories/option.factory';

@Injectable()
export class TryoutSeedService {
  constructor(
    @InjectRepository(TryoutEntity)
    private tryoutRepository: Repository<TryoutEntity>,
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async run() {
    const count = await this.tryoutRepository.count();

    if (count === 0) {
      // 1. Get a category for the dummy tryout
      const categories = await this.categoryRepository.find();
      const tryoutCategory = categories.length > 0 ? categories[0] : null;

      if (!tryoutCategory) {
        console.warn('No category found to assign tryout. Please check category seeders.');
        return;
      }

      // 2. Create the dummy tryout
      const tryout = this.tryoutRepository.create(
        createTryoutFactory({ category: tryoutCategory }),
      );
      const savedTryout = await this.tryoutRepository.save(tryout);

      // 3. Batch arrays to store relationships efficiently
      const questionsToSave: QuestionEntity[] = [];
      const allOptionsToSave: OptionEntity[] = [];

      for (let i = 0; i < 100; i++) {
        const question = this.questionRepository.create(
          createQuestionFactory({ tryout: savedTryout, orderOverride: i + 1 }),
        );
        questionsToSave.push(question);
      }

      // Bulk insert questions to get their IDs
      const savedQuestions = await this.questionRepository.save(questionsToSave);

      // 4. Generate 5 options per inserted question
      for (const savedQuestion of savedQuestions) {
        // Guarantee 1 true option, 4 false options
        const correctIndex = Math.floor(Math.random() * 5);

        for (let j = 0; j < 5; j++) {
          const option = this.optionRepository.create(
            createOptionFactory({
              question: savedQuestion,
              isCorrect: j === correctIndex,
              orderOverride: j + 1,
            }),
          );
          allOptionsToSave.push(option);
        }
      }

      // Bulk insert combinations
      // Chunk options if array is too large for postgres parameters boundary
      const chunkSize = 200;
      for (let i = 0; i < allOptionsToSave.length; i += chunkSize) {
        const chunk = allOptionsToSave.slice(i, i + chunkSize);
        await this.optionRepository.save(chunk);
      }
      
      console.log(`Successfully seeded ${savedTryout.title} with 100 questions and 500 options.`);
    }
  }
}
