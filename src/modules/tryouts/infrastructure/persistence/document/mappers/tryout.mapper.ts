import { Tryout } from '../../../../domain/tryout';
import { CategorySchemaClass } from '../../../../../categories/infrastructure/persistence/document/entities/category.schema';
import { CategoryMapper } from '../../../../../categories/infrastructure/persistence/document/mappers/category.mapper';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { FileMapper } from '../../../../../files/infrastructure/persistence/document/mappers/file.mapper';
import { TryoutSchemaClass } from '../entities/tryout.schema';

export class TryoutMapper {
  public static toDomain(raw: TryoutSchemaClass): Tryout {
    const domainEntity = new Tryout();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.title = raw.title;
    domainEntity.description = raw.description;
    domainEntity.isRecommended = raw.isRecommended;
    domainEntity.duration = raw.duration;
    domainEntity.shuffleOptions = raw.shuffleOptions;
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

    return domainEntity;
  }

  public static toPersistence(domainEntity: Tryout): TryoutSchemaClass {
    const persistenceSchema = new TryoutSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.title = domainEntity.title;
    persistenceSchema.description = domainEntity.description;
    persistenceSchema.isRecommended = domainEntity.isRecommended;
    persistenceSchema.duration = domainEntity.duration;
    persistenceSchema.shuffleOptions = domainEntity.shuffleOptions;
    persistenceSchema.showResult = domainEntity.showResult;
    persistenceSchema.showExplanation = domainEntity.showExplanation;
    persistenceSchema.passScore = domainEntity.passScore;
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.scheduledAt = domainEntity.scheduledAt;
    persistenceSchema.publishedAt = domainEntity.publishedAt;

    if (domainEntity.category) {
      const category = new CategorySchemaClass();
      category._id = domainEntity.category.id;
      persistenceSchema.category = category;
    }

    if (domainEntity.cover) {
      const cover = new FileSchemaClass();
      cover._id = domainEntity.cover.id;
      persistenceSchema.cover = cover;
    }

    return persistenceSchema;
  }
}
