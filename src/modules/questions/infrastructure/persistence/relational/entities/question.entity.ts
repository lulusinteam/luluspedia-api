import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { TryoutEntity } from '../../../../../tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { QuestionTypeEnum } from '../../../../questions.enum';

@Entity({
  name: 'question',
})
export class QuestionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TryoutEntity)
  @JoinColumn({ name: 'tryout_id' })
  tryout: TryoutEntity;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'attachment_id' })
  attachment: FileEntity | null;

  @Column({
    type: 'enum',
    enum: QuestionTypeEnum,
    default: QuestionTypeEnum.multiple_choice,
  })
  questionType: string;

  @Column({ type: 'int', default: 1 })
  scoreWeight: number;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ type: 'int', nullable: true })
  orderOverride?: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
