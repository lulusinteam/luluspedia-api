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
import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { TryoutStatusEnum } from '../../../../tryouts.enum';

@Entity({
  name: 'tryouts',
})
export class TryoutEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'boolean', default: false })
  isRecommended: boolean;

  @Column({ type: 'int' })
  duration: number;

  @Column({ type: 'boolean', default: false })
  isShuffled: boolean;

  @Column({ type: 'boolean', default: true })
  showResult: boolean;

  @Column({ type: 'boolean', default: true })
  showExplanation: boolean;

  @Column({ type: 'int', default: 0 })
  passScore: number;

  @Column({
    type: 'enum',
    enum: TryoutStatusEnum,
    default: TryoutStatusEnum.draft,
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
