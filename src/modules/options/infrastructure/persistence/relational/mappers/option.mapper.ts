import { Option } from '../../../../domain/option';
import { QuestionEntity } from '../../../../../questions/infrastructure/persistence/relational/entities/question.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { OptionEntity } from '../entities/option.entity';

export class OptionMapper {
  static toDomain(raw: OptionEntity): Option {
    const domainEntity = new Option();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.content = raw.content;
    domainEntity.isCorrect = raw.isCorrect;
    domainEntity.weight = raw.weight;
    domainEntity.orderNumber = raw.orderNumber;

    if (raw.image) {
      domainEntity.image = FileMapper.toDomain(raw.image);
    } else {
      domainEntity.image = null;
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Option): OptionEntity {
    const persistenceEntity = new OptionEntity();
    if (domainEntity.id && this.isUUID(domainEntity.id)) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.content = domainEntity.content;
    persistenceEntity.isCorrect = domainEntity.isCorrect;
    persistenceEntity.weight = domainEntity.weight || 0;
    persistenceEntity.orderNumber = domainEntity.orderNumber;

    if (domainEntity.question) {
      const question = new QuestionEntity();
      question.id = domainEntity.question.id;
      persistenceEntity.question = question;
    }

    if (domainEntity.image || domainEntity.imageId) {
      const imageId = domainEntity.imageId || (typeof domainEntity.image === 'string' ? domainEntity.image : (domainEntity.image as any)?.id);
      if (imageId) {
        const image = new FileEntity();
        image.id = imageId;
        persistenceEntity.image = image;
      }
    }

    return persistenceEntity;
  }

  private static isUUID(id: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    );
  }
}
