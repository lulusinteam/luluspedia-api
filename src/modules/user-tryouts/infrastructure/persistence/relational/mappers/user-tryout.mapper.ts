import {
  UserTryoutResponseDto,
  UserTryoutQuestionResponseDto,
  UserTryoutOptionResponseDto,
} from '../../../../dto/user-tryout-response.dto';
import {
  UserTryoutResultResponseDto,
  UserTryoutResultQuestionDto,
} from '../../../../dto/user-tryout-result-response.dto';
import { UserTryout } from '../../../../domain/user-tryout';
import { UserTryoutEntity } from '../entities/user-tryout.entity';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { TryoutMapper } from '../../../../../tryouts/infrastructure/persistence/relational/mappers/tryout.mapper';

import { UserAnswerMapper } from './user-answer.mapper';
import { getFileUrl } from '../../../../../../utils/file-utils';

export class UserTryoutMapper {
  static toDomain(raw: UserTryoutEntity): UserTryout {
    const domain = new UserTryout();
    domain.id = raw.id;
    if (raw.user) {
      domain.user = UserMapper.toDomain(raw.user);
    }
    if (raw.tryout) {
      domain.tryout = TryoutMapper.toDomain(raw.tryout);
    }
    domain.startTime = raw.startTime;
    domain.endTime = raw.endTime;
    domain.totalScore = raw.totalScore;
    domain.status = raw.status;
    domain.createdAt = raw.createdAt;
    domain.updatedAt = raw.updatedAt;
    domain.deletedAt = raw.deletedAt;
    domain.questionOrder = raw.questionOrder;

    if (raw.userAnswers) {
      domain.answers = raw.userAnswers.map(ans =>
        UserAnswerMapper.toDomain(ans),
      );
    }

    // Derived fields/Status Lulus
    if (raw.tryout) {
      domain.isPassed = raw.totalScore >= raw.tryout.passScore;
    }

    return domain;
  }

  static toPersistence(domain: UserTryout): UserTryoutEntity {
    const entity = new UserTryoutEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    if (domain.user) {
      entity.user = UserMapper.toPersistence(domain.user);
    }
    if (domain.tryout) {
      entity.tryout = TryoutMapper.toPersistence(domain.tryout);
    }
    entity.startTime = domain.startTime;
    entity.endTime = domain.endTime;
    entity.totalScore = domain.totalScore;
    entity.status = domain.status;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    entity.deletedAt = domain.deletedAt;
    entity.questionOrder = domain.questionOrder || null;

    return entity;
  }

  static toResponseDto(domain: UserTryout): UserTryoutResponseDto {
    const dto = new UserTryoutResponseDto();
    dto.id = domain.id;
    dto.startTime = domain.startTime;
    dto.totalScore = domain.totalScore;
    dto.isPassed = domain.isPassed ?? false;
    dto.tryoutDuration = domain.tryout?.duration ?? 0;
    dto.totalDurationInSeconds = (domain.tryout?.duration ?? 0) * 60;
    dto.tryoutId = domain.tryout?.id ?? '';
    dto.tryoutTitle = domain.tryout?.title ?? '';
    dto.status = domain.status;

    if (domain.tryout?.questions) {
      // Create a map for quick lookup of answers
      const answerMap = new Map<string, string>();
      if (domain.answers) {
        domain.answers.forEach(ans => {
          const qId = ans.question?.id?.toString().toLowerCase().trim();
          const optId = ans.option?.id?.toString();
          if (qId && optId) {
            answerMap.set(qId, optId);
          }
        });
      }

      // Sort questions based on questionOrder if available
      let sortedQuestions = domain.tryout.questions;
      if (domain.questionOrder && domain.questionOrder.length > 0) {
        const orderMap = new Map(
          domain.questionOrder.map((id, index) => [id.toLowerCase(), index]),
        );
        sortedQuestions = [...domain.tryout.questions].sort((a, b) => {
          const indexA = orderMap.get(a.id.toLowerCase());
          const indexB = orderMap.get(b.id.toLowerCase());
          if (indexA !== undefined && indexB !== undefined)
            return indexA - indexB;
          return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
        });
      }

      dto.questions = sortedQuestions.map(q => {
        const questionDto = new UserTryoutQuestionResponseDto();
        const qId = q.id?.toString().toLowerCase().trim();

        questionDto.id = q.id;
        questionDto.orderNumber = q.orderNumber;
        questionDto.content = q.content;
        questionDto.image = getFileUrl(q.image?.path);
        questionDto.scoringType = q.scoringType || 'point';
        questionDto.selectedOptionId = qId ? answerMap.get(qId) || null : null;

        if (q.options) {
          questionDto.options = q.options.map((opt: any) => {
            const optDto = new UserTryoutOptionResponseDto();
            optDto.id = opt.id;
            optDto.content = opt.content;
            optDto.image = getFileUrl(opt.image?.path);
            return optDto;
          });
        }

        return questionDto;
      });
    }

    return dto;
  }

  static toResultResponseDto(domain: UserTryout): UserTryoutResultResponseDto {
    const dto = new UserTryoutResultResponseDto();
    dto.id = domain.id;
    dto.totalScore = domain.totalScore;
    dto.isPassed = domain.isPassed ?? false;
    dto.startTime = domain.startTime;
    dto.endTime = domain.endTime;
    dto.status = domain.status;
    dto.tryoutTitle = domain.tryout?.title ?? '';

    // Calculate elapsed time in seconds
    if (domain.endTime && domain.startTime) {
      dto.elapsedTimeInSeconds = Math.floor(
        (domain.endTime.getTime() - domain.startTime.getTime()) / 1000,
      );
    } else {
      dto.elapsedTimeInSeconds = 0;
    }

    if (domain.tryout?.questions) {
      // Index answers by question ID
      const answerMap = new Map<string, any>();
      if (domain.answers) {
        domain.answers.forEach(ans => {
          const qId = ans.question?.id?.toString().toLowerCase().trim();
          if (qId) {
            answerMap.set(qId, ans);
          }
        });
      }

      // Sort by questionOrder if available, otherwise by orderNumber
      let sortedQuestions = domain.tryout.questions;
      if (domain.questionOrder && domain.questionOrder.length > 0) {
        const orderMap = new Map(
          domain.questionOrder.map((id, index) => [id.toLowerCase(), index]),
        );
        sortedQuestions = [...domain.tryout.questions].sort((a, b) => {
          const indexA = orderMap.get(a.id.toLowerCase());
          const indexB = orderMap.get(b.id.toLowerCase());
          if (indexA !== undefined && indexB !== undefined)
            return indexA - indexB;
          return (a.orderNumber ?? 0) - (b.orderNumber ?? 0);
        });
      } else {
        sortedQuestions = [...domain.tryout.questions].sort(
          (a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0),
        );
      }

      dto.questions = sortedQuestions.map(q => {
        const qId = q.id?.toString().toLowerCase().trim();
        const userAns = qId ? answerMap.get(qId) : undefined;
        const qDto = new UserTryoutResultQuestionDto();

        qDto.id = q.id;
        qDto.orderNumber = q.orderNumber;
        qDto.content = q.content;
        qDto.image = getFileUrl(q.image?.path);
        qDto.explanation = q.explanation;
        qDto.explanationImage = getFileUrl(q.explanationImage?.path);
        qDto.scoringType = q.scoringType;

        // Map selectedOptionId from matched answer
        qDto.selectedOptionId = userAns?.option?.id || null;
        qDto.correctOptionId =
          q.options?.find(opt => opt.isCorrect)?.id || null;

        // Determine status (Support TIU/TWK and TKP)
        if (!userAns || !userAns.option) {
          qDto.status = 'unanswered';
        } else if (
          userAns.option.isCorrect ||
          (userAns.option.weight !== undefined && userAns.option.weight > 0)
        ) {
          qDto.status = 'correct';
        } else {
          qDto.status = 'incorrect';
        }

        if (q.options) {
          qDto.options = q.options.map(opt => ({
            id: opt.id,
            content: opt.content,
            image: getFileUrl(opt.image?.path),
            isCorrect: opt.isCorrect,
            weight: opt.weight || 0,
          }));
        }

        return qDto;
      });
    }

    return dto;
  }
}
