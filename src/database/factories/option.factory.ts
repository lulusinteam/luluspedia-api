import { faker } from '@faker-js/faker';
import { OptionEntity } from '../../modules/options/infrastructure/persistence/relational/entities/option.entity';

export const createOptionFactory = (
  overrides?: Partial<OptionEntity>,
): Partial<OptionEntity> => {
  return {
    text: faker.lorem.sentence(),
    isCorrect: false, // Default to false, seeder modifies exactly one per question
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
