import { UserAnswer } from '../../../../domain/user-answer';
import { UserAnswerEntity } from '../entities/user-answer.entity';
import { Question } from '../../../../../questions/domain/question';
import { Option as OptionDomain } from '../../../../../options/domain/option';
import { QuestionMapper } from '../../../../../questions/infrastructure/persistence/relational/mappers/question.mapper';
import { OptionMapper } from '../../../../../options/infrastructure/persistence/relational/mappers/option.mapper';

export class UserAnswerMapper {
  static toDomain(raw: UserAnswerEntity): UserAnswer {
    const domain = new UserAnswer();
    domain.id = raw.id;

    // Check various ways the question might be present in the raw data
    const qData =
      raw.question ??
      (raw as any).userAnswerQuestion ??
      (raw as any).questionId ??
      (raw as any).question_id;

    if (qData) {
      if (typeof qData === 'string') {
        const dummyQ = new Question();
        dummyQ.id = qData;
        domain.question = dummyQ;
      } else {
        domain.question = QuestionMapper.toDomain(qData);
      }
    }

    // Check various ways the option might be present in the raw data
    const optData =
      raw.option ??
      (raw as any).selectedOption ??
      (raw as any).optionId ??
      (raw as any).option_id;

    if (optData) {
      if (typeof optData === 'string') {
        const dummyOpt = new OptionDomain();
        dummyOpt.id = optData;
        domain.option = dummyOpt;
      } else {
        domain.option = OptionMapper.toDomain(optData);
      }
    }

    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;

    return domain;
  }

  static toPersistence(domain: UserAnswer): UserAnswerEntity {
    const entity = new UserAnswerEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    if (domain.question) {
      entity.question = QuestionMapper.toPersistence(domain.question);
    }
    if (domain.option) {
      entity.option = OptionMapper.toPersistence(domain.option);
    }
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;

    return entity;
  }
}
