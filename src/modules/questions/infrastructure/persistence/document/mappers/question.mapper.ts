import { Question } from '../../../../domain/question';
import { TryoutSchemaClass } from '../../../../../tryouts/infrastructure/persistence/document/entities/tryout.schema';
import { TryoutMapper } from '../../../../../tryouts/infrastructure/persistence/document/mappers/tryout.mapper';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';
import { QuestionSchemaClass } from '../entities/question.schema';

export class QuestionMapper {
  public static toDomain(raw: QuestionSchemaClass): Question {
    const domainEntity = new Question();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.content = raw.content;
    domainEntity.difficulty = raw.difficulty as any;
    domainEntity.points = raw.points;
    domainEntity.orderNumber = raw.orderNumber as number;
    domainEntity.scoringType = raw.scoringType as any;

    if (raw.tryout) {
      domainEntity.tryout = TryoutMapper.toDomain(raw.tryout);
    }

    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
    }

    return domainEntity;
  }

  public static toPersistence(domainEntity: Question): QuestionSchemaClass {
    const persistenceSchema = new QuestionSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.content = domainEntity.content;
    persistenceSchema.difficulty = domainEntity.difficulty;
    persistenceSchema.points = domainEntity.points;
    persistenceSchema.orderNumber = domainEntity.orderNumber;
    persistenceSchema.scoringType = domainEntity.scoringType;

    if (domainEntity.tryout) {
      const tryout = new TryoutSchemaClass();
      tryout._id = domainEntity.tryout.id;
      persistenceSchema.tryout = tryout;
    }

    if (domainEntity.image) {
      const image = new FileSchemaClass();
      image._id = domainEntity.image.id;
      persistenceSchema.image = image;
    }

    return persistenceSchema;
  }
}
