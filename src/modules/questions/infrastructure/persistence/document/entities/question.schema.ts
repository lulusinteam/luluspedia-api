import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../../utils/document-entity-helper';
import { TryoutSchemaClass } from '../../../../../tryouts/infrastructure/persistence/document/entities/tryout.schema';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { DifficultyEnum } from '../../../../questions.enum';

export type QuestionSchemaDocument = HydratedDocument<QuestionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class QuestionSchemaClass extends EntityDocumentHelper {
  @Prop({ type: TryoutSchemaClass })
  tryout: TryoutSchemaClass;

  @Prop({ type: String })
  content: string;

  @Prop({ type: FileSchemaClass })
  image: FileSchemaClass | null;

  @Prop({ type: FileSchemaClass })
  explanationImage: FileSchemaClass | null;

  @Prop({
    type: String,
    enum: DifficultyEnum,
    default: DifficultyEnum.medium,
  })
  difficulty: string;

  @Prop({ type: Number, default: 0 })
  points: number;

  @Prop({ type: String })
  explanation: string;

  @Prop({ type: Number })
  orderNumber?: number | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionSchemaClass);
