import { Question } from '../../../../domain/question';
import { TryoutEntity } from '../../../../../tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { OptionMapper } from '../../../../../options/infrastructure/persistence/relational/mappers/option.mapper';
import { QuestionEntity } from '../entities/question.entity';
import { DifficultyEnum } from '../../../../questions.enum';

export class QuestionMapper {
  static toDomain(raw: QuestionEntity): Question {
    const domainEntity = new Question();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.orderNumber = raw.orderNumber;
    domainEntity.content = raw.content;
    domainEntity.explanation = raw.explanation;
    domainEntity.points = raw.points;
    domainEntity.difficulty = raw.difficulty;

    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
    }

    if (raw.explanationImage) {
      domainEntity.explanationImage = FileMapper.toDomain(raw.explanationImage);
    }

    if (raw.options) {
      domainEntity.options = raw.options.map(option =>
        OptionMapper.toDomain(option),
      );
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Question): QuestionEntity {
    const persistenceEntity = new QuestionEntity();

    if (domainEntity.id && this.isUUID(domainEntity.id)) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.orderNumber = domainEntity.orderNumber || 1;
    persistenceEntity.content = domainEntity.content;
    persistenceEntity.explanation = domainEntity.explanation;
    persistenceEntity.points = domainEntity.points || 0;
    persistenceEntity.difficulty =
      domainEntity.difficulty || DifficultyEnum.medium;

    if (domainEntity.tryout) {
      const tryout = new TryoutEntity();
      tryout.id = domainEntity.tryout.id;
      persistenceEntity.tryout = tryout;
    }

    if (domainEntity.image) {
      const image = new FileEntity();
      image.id = domainEntity.image.id;
      persistenceEntity.image = image;
    }

    if (domainEntity.explanationImage) {
      const explanationImage = new FileEntity();
      explanationImage.id = domainEntity.explanationImage.id;
      persistenceEntity.explanationImage = explanationImage;
    }

    if (domainEntity.options) {
      persistenceEntity.options = domainEntity.options.map(option =>
        OptionMapper.toPersistence(option),
      );
    }

    return persistenceEntity;
  }

  private static isUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    );
  }
}
