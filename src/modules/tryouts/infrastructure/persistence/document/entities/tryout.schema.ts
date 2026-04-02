import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../../utils/document-entity-helper';
import { CategorySchemaClass } from '../../../../../categories/infrastructure/persistence/document/entities/category.schema';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { TryoutStatusEnum } from '../../../../tryouts.enum';

export type TryoutSchemaDocument = HydratedDocument<TryoutSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class TryoutSchemaClass extends EntityDocumentHelper {
  @Prop({ type: String })
  title: string;

  @Prop({ type: CategorySchemaClass })
  category: CategorySchemaClass;

  @Prop({ type: String })
  description: string;

  @Prop({ type: FileSchemaClass })
  cover: FileSchemaClass | null;

  @Prop({ type: Boolean, default: false })
  isRecommended: boolean;

  @Prop({ type: Number })
  duration: number;

  @Prop({ type: Boolean, default: false })
  shuffleOptions: boolean;

  @Prop({ type: Boolean, default: true })
  showResult: boolean;

  @Prop({ type: Boolean, default: true })
  showExplanation: boolean;

  @Prop({ type: Number, default: 0 })
  passScore: number;

  @Prop({
    type: String,
    enum: TryoutStatusEnum,
    default: TryoutStatusEnum.draft,
  })
  status: string;

  @Prop({ type: Date })
  scheduledAt?: Date;

  @Prop({ type: Date })
  publishedAt?: Date;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const TryoutSchema = SchemaFactory.createForClass(TryoutSchemaClass);
