import { faker } from '@faker-js/faker';
import { QuestionEntity } from '../../modules/questions/infrastructure/persistence/relational/entities/question.entity';
import { DifficultyEnum } from '../../modules/questions/questions.enum';

export const createQuestionFactory = (
  overrides?: Partial<QuestionEntity>,
): Partial<QuestionEntity> => {
  return {
    content: faker.lorem.paragraphs({ min: 1, max: 3 }),
    difficulty: faker.helpers.objectValue(DifficultyEnum),
    orderNumber: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
