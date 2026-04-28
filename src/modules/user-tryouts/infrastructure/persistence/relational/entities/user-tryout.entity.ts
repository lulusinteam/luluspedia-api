import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { TryoutEntity } from '../../../../../tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { UserTryoutStatusEnum } from '../../../../domain/user-tryout';
import { UserAnswerEntity } from './user-answer.entity';

@Entity({
  name: 'user_tryouts',
})
export class UserTryoutEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => UserAnswerEntity, userAnswer => userAnswer.userTryout)
  userAnswers: UserAnswerEntity[];

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => TryoutEntity)
  @JoinColumn({ name: 'tryout_id' })
  tryout: TryoutEntity;

  @Column({
    type: 'timestamp',
    name: 'start_time',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startTime: Date;

  @Column({ type: 'timestamp', name: 'end_time', nullable: true })
  endTime: Date | null;

  @Column({ type: 'int', name: 'total_score', default: 0 })
  totalScore: number;

  @Column({
    type: 'enum',
    enum: UserTryoutStatusEnum,
    default: UserTryoutStatusEnum.inProgress,
  })
  status: UserTryoutStatusEnum;

  @Column({ type: 'jsonb', name: 'question_order', nullable: true })
  questionOrder: string[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
