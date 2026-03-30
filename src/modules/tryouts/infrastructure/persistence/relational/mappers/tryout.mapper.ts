import { CategoryMapper } from '../../../../../categories/infrastructure/persistence/relational/mappers/category.mapper';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { FileMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file.mapper';
import { QuestionMapper } from '../../../../../questions/infrastructure/persistence/relational/mappers/question.mapper';
import { Tryout } from '../../../../domain/tryout';
import { TryoutEntity } from '../entities/tryout.entity';
import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';

export class TryoutMapper {
  static toDomain(raw: TryoutEntity): Tryout {
    const domainEntity = new Tryout();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;
    domainEntity.isRecommended = raw.isRecommended;
    domainEntity.duration = raw.duration;
    domainEntity.isShuffled = raw.isShuffled;
    domainEntity.showResult = raw.showResult;
    domainEntity.showExplanation = raw.showExplanation;
    domainEntity.passScore = raw.passScore;
    domainEntity.status = raw.status;
    domainEntity.scheduledAt = raw.scheduledAt;
    domainEntity.publishedAt = raw.publishedAt;

    if (raw.category) {
      domainEntity.category = CategoryMapper.toDomain(raw.category);
    }

    if (raw.cover) {
      domainEntity.cover = FileMapper.toDomain(raw.cover);
    }

    if (raw.questions && Array.isArray(raw.questions)) {
      domainEntity.questions = raw.questions.map(question =>
        QuestionMapper.toDomain(question),
      );
      domainEntity.questionCount = raw.questions.length;
    } else if (raw.questionCount !== undefined) {
      domainEntity.questionCount = Number(raw.questionCount);
    }

    if (raw.ratingAverage !== undefined) {
      domainEntity.ratingAverage = Number(raw.ratingAverage);
    }

    if (raw.ratingCount !== undefined) {
      domainEntity.ratingCount = Number(raw.ratingCount);
    }

    if (raw.isWishlist !== undefined) {
      domainEntity.isWishlist = Boolean(raw.isWishlist);
    }

    return domainEntity;
  }

  static toPersistence(domainEntity: Tryout): TryoutEntity {
    const persistenceEntity = new TryoutEntity();
     if (domainEntity.id) {
       persistenceEntity.id = domainEntity.id;
     }
     persistenceEntity.title = domainEntity.title;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.isRecommended = domainEntity.isRecommended;
    persistenceEntity.duration = domainEntity.duration;
    persistenceEntity.isShuffled = domainEntity.isShuffled;
    persistenceEntity.showResult = domainEntity.showResult;
    persistenceEntity.showExplanation = domainEntity.showExplanation;
    persistenceEntity.passScore = domainEntity.passScore;
    persistenceEntity.status = domainEntity.status;
    persistenceEntity.scheduledAt = domainEntity.scheduledAt;
    persistenceEntity.publishedAt = domainEntity.publishedAt;

    if (domainEntity.category && domainEntity.category.id) {
      const category = new CategoryEntity();
      category.id = domainEntity.category.id;
      persistenceEntity.category = category;
    }

    if (domainEntity.cover && domainEntity.cover.id) {
      const cover = new FileEntity();
      cover.id = domainEntity.cover.id;
      persistenceEntity.cover = cover;
    }

    if (domainEntity.questions) {
      persistenceEntity.questions = domainEntity.questions.map(question =>
        QuestionMapper.toPersistence(question),
      );
    }

    return persistenceEntity;
  }
}
