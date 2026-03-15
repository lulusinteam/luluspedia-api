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
import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { QuestionEntity } from '../../../../../questions/infrastructure/persistence/relational/entities/question.entity';
import { TryoutStatusEnum } from '../../../../tryouts.enum';

@Entity({
  name: 'tryouts',
})
export class TryoutEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => QuestionEntity, question => question.tryout, {
    cascade: true,
  })
  questions: QuestionEntity[];

  @Column({ type: String })
  title: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'cover_id' })
  cover: FileEntity | null;

  @Column({ type: 'boolean', name: 'is_recommended', default: false })
  isRecommended: boolean;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'boolean', default: false })
  isShuffled: boolean;

  @Column({ type: 'boolean', name: 'show_result', default: true })
  showResult: boolean;

  @Column({ type: 'boolean', name: 'show_explanation', default: true })
  showExplanation: boolean;

  @Column({ type: 'int', name: 'pass_score', default: 0 })
  passScore: number;

  @Column({
    type: 'enum',
    enum: TryoutStatusEnum,
    default: TryoutStatusEnum.draft,
  })
  status: string;

  @Column({ type: 'timestamp', name: 'scheduled_at', nullable: true })
  scheduledAt?: Date;

  @Column({ type: 'timestamp', name: 'published_at', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Virtual fields populated by QueryBuilder
  questionCount?: number;
  ratingAverage?: number;
  ratingCount?: number;
  isWishlist?: boolean;
}
