import { Option } from '../../../../domain/option';
import { QuestionSchemaClass } from '../../../../../questions/infrastructure/persistence/document/entities/question.schema';
import { QuestionMapper } from '../../../../../questions/infrastructure/persistence/document/mappers/question.mapper';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';
import { OptionSchemaClass } from '../entities/option.schema';

export class OptionMapper {
  public static toDomain(raw: OptionSchemaClass): Option {
    const domainEntity = new Option();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.text = raw.text;
    domainEntity.isCorrect = raw.isCorrect;
    domainEntity.orderOverride = raw.orderOverride;

    if (raw.question) {
      domainEntity.question = QuestionMapper.toDomain(raw.question);
    }

    if (raw.attachment) {
      domainEntity.attachment = FileMapper.toDomain(raw.attachment);
    }

    return domainEntity;
  }

  public static toPersistence(domainEntity: Option): OptionSchemaClass {
    const persistenceSchema = new OptionSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.text = domainEntity.text;
    persistenceSchema.isCorrect = domainEntity.isCorrect;
    persistenceSchema.orderOverride = domainEntity.orderOverride;

    if (domainEntity.question) {
      const question = new QuestionSchemaClass();
      question._id = domainEntity.question.id;
      persistenceSchema.question = question;
    }

    if (domainEntity.attachment) {
      const attachment = new FileSchemaClass();
      attachment._id = domainEntity.attachment.id;
      persistenceSchema.attachment = attachment;
    }

    return persistenceSchema;
  }
}
