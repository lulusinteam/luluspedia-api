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
    domainEntity.explanation = raw.explanation;
    domainEntity.orderNumber = raw.orderNumber as number;

    if (raw.tryout) {
      domainEntity.tryout = TryoutMapper.toDomain(raw.tryout);
    }

    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
    }

    if (raw.explanationImage) {
      domainEntity.explanationImage = FileMapper.toDomain(raw.explanationImage);
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
    persistenceSchema.explanation = domainEntity.explanation;
    persistenceSchema.orderNumber = domainEntity.orderNumber;

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

    if (domainEntity.explanationImage) {
      const explanationImage = new FileSchemaClass();
      explanationImage._id = domainEntity.explanationImage.id;
      persistenceSchema.explanationImage = explanationImage;
    }

    return persistenceSchema;
  }
}
