import { Question } from '../../../../domain/question';
import { TryoutEntity } from '../../../../../tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { OptionMapper } from '../../../../../options/infrastructure/persistence/relational/mappers/option.mapper';
import { QuestionEntity } from '../entities/question.entity';
import { DifficultyEnum, ScoringTypeEnum } from '../../../../questions.enum';

export class QuestionMapper {
  static toDomain(raw: QuestionEntity): Question {
    const domainEntity = new Question();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.orderNumber = raw.orderNumber;
    domainEntity.content = raw.content;
    domainEntity.explanation = raw.explanation;
    domainEntity.difficulty = raw.difficulty;
    domainEntity.scoringType = raw.scoringType;
    domainEntity.correctPoint = raw.correctPoint;

    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
    } else {
      domainEntity.image = null;
    }

    if (raw.explanationImage) {
      domainEntity.explanationImage = FileMapper.toDomain(raw.explanationImage);
    } else {
      domainEntity.explanationImage = null;
    }

    if (raw.options) {
      domainEntity.options = raw.options
        .map(option => OptionMapper.toDomain(option))
        .sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
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
    persistenceEntity.explanation = domainEntity.explanation ?? null;
    persistenceEntity.difficulty =
      domainEntity.difficulty || DifficultyEnum.medium;
    persistenceEntity.scoringType =
      domainEntity.scoringType || ScoringTypeEnum.point;
    persistenceEntity.correctPoint = domainEntity.correctPoint ?? null;

    if (domainEntity.tryout) {
      const tryout = new TryoutEntity();
      tryout.id = domainEntity.tryout.id;
      persistenceEntity.tryout = tryout;
    }

    if (domainEntity.image || domainEntity.imageId) {
      const imageId =
        domainEntity.imageId ||
        (typeof domainEntity.image === 'string'
          ? domainEntity.image
          : (domainEntity.image as any)?.id);
      if (imageId) {
        const image = new FileEntity();
        image.id = imageId;
        persistenceEntity.image = image;
      }
    }

    if (domainEntity.explanationImage || domainEntity.explanationImageId) {
      const explanationImageId =
        domainEntity.explanationImageId ||
        (typeof domainEntity.explanationImage === 'string'
          ? domainEntity.explanationImage
          : (domainEntity.explanationImage as any)?.id);
      if (explanationImageId) {
        const explanationImage = new FileEntity();
        explanationImage.id = explanationImageId;
        persistenceEntity.explanationImage = explanationImage;
      }
    }

    if (domainEntity.options) {
      persistenceEntity.options = domainEntity.options.map((option, index) => {
        const persistenceOption = OptionMapper.toPersistence(option);
        persistenceOption.orderNumber = option.orderNumber || index + 1;
        return persistenceOption;
      });
    }

    return persistenceEntity;
  }

  private static isUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    );
  }
}
