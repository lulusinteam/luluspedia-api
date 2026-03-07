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
    domainEntity.text = raw.text;
    domainEntity.questionType = raw.questionType;
    domainEntity.scoreWeight = raw.scoreWeight;
    domainEntity.explanation = raw.explanation;
    domainEntity.orderOverride = raw.orderOverride;

    if (raw.tryout) {
      domainEntity.tryout = TryoutMapper.toDomain(raw.tryout);
    }

    if (raw.attachment) {
      domainEntity.attachment = FileMapper.toDomain(raw.attachment);
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
    persistenceSchema.text = domainEntity.text;
    persistenceSchema.questionType = domainEntity.questionType;
    persistenceSchema.scoreWeight = domainEntity.scoreWeight;
    persistenceSchema.explanation = domainEntity.explanation;
    persistenceSchema.orderOverride = domainEntity.orderOverride;

    if (domainEntity.tryout) {
      const tryout = new TryoutSchemaClass();
      tryout._id = domainEntity.tryout.id;
      persistenceSchema.tryout = tryout;
    }

    if (domainEntity.attachment) {
      const attachment = new FileSchemaClass();
      attachment._id = domainEntity.attachment.id;
      persistenceSchema.attachment = attachment;
    }

    return persistenceSchema;
  }
}
