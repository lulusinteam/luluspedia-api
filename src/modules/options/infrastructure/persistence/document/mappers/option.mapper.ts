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
    domainEntity.content = raw.content;
    domainEntity.isCorrect = raw.isCorrect;
    domainEntity.orderNumber = raw.orderNumber as number;

    if (raw.question) {
      domainEntity.question = QuestionMapper.toDomain(raw.question);
    }

    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
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
    persistenceSchema.content = domainEntity.content;
    persistenceSchema.isCorrect = domainEntity.isCorrect;
    persistenceSchema.orderNumber = domainEntity.orderNumber;

    if (domainEntity.question) {
      const question = new QuestionSchemaClass();
      question._id = domainEntity.question.id;
      persistenceSchema.question = question;
    }

    if (domainEntity.image) {
      const image = new FileSchemaClass();
      image._id = domainEntity.image.id;
      persistenceSchema.image = image;
    }

    return persistenceSchema;
  }
}
