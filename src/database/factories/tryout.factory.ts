import { faker } from '@faker-js/faker';
import { TryoutEntity } from '../../modules/tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { TryoutStatusEnum } from '../../modules/tryouts/tryouts.enum';

export const createTryoutFactory = (
  overrides?: Partial<TryoutEntity>,
): Partial<TryoutEntity> => {
  return {
    title: faker.word.words({ count: { min: 3, max: 6 } }),
    description: faker.lorem.paragraph(),
    isRecommended: faker.datatype.boolean(),
    duration: faker.helpers.arrayElement([60, 90, 120]),
    isShuffled: faker.datatype.boolean(),
    showResult: faker.datatype.boolean(),
    showExplanation: faker.datatype.boolean(),
    passScore: faker.number.int({ min: 50, max: 90 }),
    status: faker.helpers.objectValue(TryoutStatusEnum),
    scheduledAt: faker.date.future(),
    publishedAt: faker.date.past(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
