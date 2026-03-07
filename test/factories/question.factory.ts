import { faker } from '@faker-js/faker';
import { QuestionEntity } from '../../src/modules/questions/infrastructure/persistence/relational/entities/question.entity';
import { QuestionTypeEnum } from '../../src/modules/questions/questions.enum';

export const createQuestionFactory = (overrides?: Partial<QuestionEntity>): Partial<QuestionEntity> => {
  return {
    text: faker.lorem.paragraphs({ min: 1, max: 3 }),
    questionType: faker.helpers.objectValue(QuestionTypeEnum),
    scoreWeight: faker.number.int({ min: 1, max: 5 }),
    explanation: faker.datatype.boolean() ? faker.lorem.paragraph() : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
