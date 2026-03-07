import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../../utils/document-entity-helper';
import { TryoutSchemaClass } from '../../../../../tryouts/infrastructure/persistence/document/entities/tryout.schema';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { QuestionTypeEnum } from '../../../../questions.enum';

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
  text: string;

  @Prop({ type: FileSchemaClass })
  attachment: FileSchemaClass | null;

  @Prop({
    type: String,
    enum: QuestionTypeEnum,
    default: QuestionTypeEnum.multiple_choice,
  })
  questionType: string;

  @Prop({ type: Number, default: 1 })
  scoreWeight: number;

  @Prop({ type: String })
  explanation: string;

  @Prop({ type: Number })
  orderOverride?: number | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const QuestionSchema = SchemaFactory.createForClass(QuestionSchemaClass);
