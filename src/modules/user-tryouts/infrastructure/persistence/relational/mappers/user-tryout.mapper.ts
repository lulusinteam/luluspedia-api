import { UserTryout } from '../../../../domain/user-tryout';
import { UserTryoutEntity } from '../entities/user-tryout.entity';
import { UserTryoutResponseDto } from '../../../../dto/user-tryout-response.dto';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';
import { TryoutMapper } from '../../../../../tryouts/infrastructure/persistence/relational/mappers/tryout.mapper';

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

    // Derived fields/Status Lulus
    if (raw.tryout) {
      domain.isPassed = raw.totalScore >= raw.tryout.passScore;
    }

    if (raw.endTime) {
      domain.durationInSeconds = Math.floor(
        (raw.endTime.getTime() - raw.startTime.getTime()) / 1000,
      );
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

    return entity;
  }

  static toResponseDto(domain: UserTryout): UserTryoutResponseDto {
    const dto = new UserTryoutResponseDto();
    dto.id = domain.id;
    dto.startTime = domain.startTime;
    dto.totalScore = domain.totalScore;
    dto.isPassed = domain.isPassed ?? false;
    dto.durationInSeconds = domain.durationInSeconds ?? 0;

    return dto;
  }
}
