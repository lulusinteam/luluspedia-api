import { Option } from '../../../../domain/option';
import { QuestionEntity } from '../../../../../questions/infrastructure/persistence/relational/entities/question.entity';
import { QuestionMapper } from '../../../../../questions/infrastructure/persistence/relational/mappers/question.mapper';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { OptionEntity } from '../entities/option.entity';

export class OptionMapper {
  static toDomain(raw: OptionEntity): Option {
    const domainEntity = new Option();
    domainEntity.id = raw.id;
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

  static toPersistence(domainEntity: Option): OptionEntity {
    const persistenceEntity = new OptionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.text = domainEntity.text;
    persistenceEntity.isCorrect = domainEntity.isCorrect;
    persistenceEntity.orderOverride = domainEntity.orderOverride;

    if (domainEntity.question) {
      const question = new QuestionEntity();
      question.id = domainEntity.question.id;
      persistenceEntity.question = question;
    }

    if (domainEntity.attachment) {
      const attachment = new FileEntity();
      attachment.id = domainEntity.attachment.id;
      persistenceEntity.attachment = attachment;
    }

    return persistenceEntity;
  }
}
