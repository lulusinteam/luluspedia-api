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
import { OptionEntity } from '../../../../../options/infrastructure/persistence/relational/entities/option.entity';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { TryoutEntity } from '../../../../../tryouts/infrastructure/persistence/relational/entities/tryout.entity';
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { DifficultyEnum, ScoringTypeEnum } from '../../../../questions.enum';

@Entity({
  name: 'questions',
})
export class QuestionEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => OptionEntity, option => option.question, {
    cascade: true,
  })
  options: OptionEntity[];

  @ManyToOne(() => TryoutEntity)
  @JoinColumn({ name: 'tryout_id' })
  tryout: TryoutEntity;

  @Column({ type: 'int', name: 'order_number', default: 1 })
  orderNumber: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  explanation: string | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: FileEntity | null;

  @ManyToOne(() => FileEntity, { nullable: true })
  @JoinColumn({ name: 'explanation_image_id' })
  explanationImage: FileEntity | null;

  @Column({
    type: 'enum',
    enum: DifficultyEnum,
    default: DifficultyEnum.medium,
  })
  difficulty: DifficultyEnum;

  @Column({
    type: 'enum',
    enum: ScoringTypeEnum,
    default: ScoringTypeEnum.point,
    name: 'scoringType',
  })
  scoringType: ScoringTypeEnum;

  @Column({ type: 'int', default: 0 })
  points: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
