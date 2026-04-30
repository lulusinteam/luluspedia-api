import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { UserTryoutEntity } from './user-tryout.entity';
import { QuestionEntity } from '../../../../../questions/infrastructure/persistence/relational/entities/question.entity';
import { OptionEntity } from '../../../../../options/infrastructure/persistence/relational/entities/option.entity';

@Entity({
  name: 'user_answers',
})
@Unique(['userTryout', 'question']) // Memastikan satu soal cuma satu jawaban per attempt
export class UserAnswerEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserTryoutEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_tryout_id' })
  userTryout: UserTryoutEntity;

  @ManyToOne(() => QuestionEntity)
  @JoinColumn({ name: 'question_id' })
  question: QuestionEntity;

  @ManyToOne(() => OptionEntity)
  @JoinColumn({ name: 'option_id' })
  option: OptionEntity;

  @Column({ type: 'boolean', name: 'is_correct_snapshot', nullable: true })
  isCorrectSnapshot: boolean | null;

  @Column({ type: 'float', name: 'weight_snapshot', nullable: true })
  weightSnapshot: number | null;

  @Column({ type: 'int', name: 'points_snapshot', nullable: true })
  pointsSnapshot: number | null;

  @Column({ type: 'jsonb', name: 'question_snapshot', nullable: true })
  questionSnapshot: any | null;

  @Column({ type: 'jsonb', name: 'option_snapshot', nullable: true })
  optionSnapshot: any | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
