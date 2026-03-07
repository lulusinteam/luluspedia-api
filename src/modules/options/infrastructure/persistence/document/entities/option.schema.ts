import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../../utils/document-entity-helper';
import { QuestionSchemaClass } from '../../../../../questions/infrastructure/persistence/document/entities/question.schema';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';

export type OptionSchemaDocument = HydratedDocument<OptionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class OptionSchemaClass extends EntityDocumentHelper {
  @Prop({ type: QuestionSchemaClass })
  question: QuestionSchemaClass;

  @Prop({ type: String })
  text: string;

  @Prop({ type: FileSchemaClass })
  attachment: FileSchemaClass | null;

  @Prop({ type: Boolean, default: false })
  isCorrect: boolean;

  @Prop({ type: Number })
  orderOverride?: number | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const OptionSchema = SchemaFactory.createForClass(OptionSchemaClass);
