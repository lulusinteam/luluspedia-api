import { Question } from '../../../../domain/question';
import { TryoutEntity } from '../../../../../tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { TryoutMapper } from '../../../../../tryouts/infrastructure/persistence/relational/mappers/tryout.mapper';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { QuestionEntity } from '../entities/question.entity';

export class QuestionMapper {
  static toDomain(raw: QuestionEntity): Question {
    const domainEntity = new Question();
    domainEntity.id = raw.id;
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

  static toPersistence(domainEntity: Question): QuestionEntity {
    const persistenceEntity = new QuestionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.text = domainEntity.text;
    persistenceEntity.questionType = domainEntity.questionType;
    persistenceEntity.scoreWeight = domainEntity.scoreWeight;
    persistenceEntity.explanation = domainEntity.explanation;
    persistenceEntity.orderOverride = domainEntity.orderOverride;

    if (domainEntity.tryout) {
      const tryout = new TryoutEntity();
      tryout.id = domainEntity.tryout.id;
      persistenceEntity.tryout = tryout;
    }

    if (domainEntity.attachment) {
      const attachment = new FileEntity();
      attachment.id = domainEntity.attachment.id;
      persistenceEntity.attachment = attachment;
    }

    return persistenceEntity;
  }
}
