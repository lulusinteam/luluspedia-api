import { Category } from '../../../../domain/category';
import { CategorySchemaClass } from '../entities/category.schema';

export class CategoryMapper {
  public static toDomain(raw: CategorySchemaClass): Category {
    const domainEntity = new Category();
    domainEntity.id = raw._id.toString();
    domainEntity.createdAt = raw.createdAt;
    domainEntity.slug = raw.slug;
    domainEntity.label = raw.label;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Category): CategorySchemaClass {
    const persistenceSchema = new CategorySchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.slug = domainEntity.slug;
    persistenceSchema.label = domainEntity.label;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}
