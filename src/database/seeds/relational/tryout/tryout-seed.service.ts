import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TryoutEntity } from '../../../../modules/tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { QuestionEntity } from '../../../../modules/questions/infrastructure/persistence/relational/entities/question.entity';
import { OptionEntity } from '../../../../modules/options/infrastructure/persistence/relational/entities/option.entity';
import { CategoryEntity } from '../../../../modules/categories/infrastructure/persistence/relational/entities/category.entity';
import { DeepPartial } from 'typeorm';
import { createTryoutFactory } from '../../../factories/tryout.factory';
import { createQuestionFactory } from '../../../factories/question.factory';
import { createOptionFactory } from '../../../factories/option.factory';

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
      // 1. Get all available categories
      const categories = await this.categoryRepository.find();

      if (categories.length === 0) {
        console.warn(
          'No categories found to assign tryouts. Please check category seeders.',
        );
        return;
      }

      const TRYOUT_COUNT = 50;
      const QUESTIONS_PER_TRYOUT = 20;
      const OPTIONS_PER_QUESTION = 5;

      for (let t = 0; t < TRYOUT_COUNT; t++) {
        // Rotate through categories
        const tryoutCategory = categories[t % categories.length];

        // 2. Create the tryout
        const tryoutData = createTryoutFactory({
          category: tryoutCategory,
          title: `Tryout ${tryoutCategory.label} Batch ${Math.floor(t / categories.length) + 1}`,
        });

        const tryout = this.tryoutRepository.create(
          tryoutData as DeepPartial<TryoutEntity>,
        );
        const savedTryout = await this.tryoutRepository.save(tryout);

        // 3. Prepare batch arrays for questions and options
        const questionsToSave: QuestionEntity[] = [];
        const allOptionsToSave: OptionEntity[] = [];

        // 4. Generate questions for this tryout
        for (let i = 0; i < QUESTIONS_PER_TRYOUT; i++) {
          const questionData = createQuestionFactory({
            tryout: savedTryout,
            orderOverride: i + 1,
          });
          const question = this.questionRepository.create(
            questionData as DeepPartial<QuestionEntity>,
          );
          questionsToSave.push(question);
        }

        // Bulk insert questions to get their IDs
        const savedQuestions = (await this.questionRepository.save(
          questionsToSave as DeepPartial<QuestionEntity>[],
        )) as unknown as QuestionEntity[];

        // 5. Generate options per inserted question
        for (const savedQuestion of savedQuestions) {
          // Guarantee 1 true option, others false
          const correctIndex = Math.floor(Math.random() * OPTIONS_PER_QUESTION);

          for (let j = 0; j < OPTIONS_PER_QUESTION; j++) {
            const optionData = createOptionFactory({
              question: savedQuestion,
              isCorrect: j === correctIndex,
              orderOverride: j + 1,
            });
            const option = this.optionRepository.create(
              optionData as DeepPartial<OptionEntity>,
            );
            allOptionsToSave.push(option);
          }
        }

        // Bulk insert options in chunks
        const chunkSize = 250;
        for (let i = 0; i < allOptionsToSave.length; i += chunkSize) {
          const chunk = allOptionsToSave.slice(i, i + chunkSize);
          await this.optionRepository.save(chunk as DeepPartial<OptionEntity>[]);
        }

        console.log(
          `Successfully seeded "${savedTryout.title}" with ${QUESTIONS_PER_TRYOUT} questions and ${allOptionsToSave.length} options.`,
        );
      }
    }
  }
}
