import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
