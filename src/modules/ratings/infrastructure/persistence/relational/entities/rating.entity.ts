import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../../utils/relational-entity-helper';
import { UserEntity } from '../../../../../../modules/users/infrastructure/persistence/relational/entities/user.entity';
import { Rating } from '../../../../domain/rating';

@Entity({
  name: 'ratings',
})
@Index(['rateableId', 'rateableType'])
export class RatingEntity extends EntityRelationalHelper implements Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, {
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ type: 'uuid', name: 'rateable_id' })
  rateableId: string;

  @Column({ name: 'rateable_type' })
  rateableType: string;

  @Column({ type: 'integer' })
  score: number;

  @Column({ type: 'text', nullable: true })
  review?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
