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
import { Wishlist } from '../../../../domain/wishlist';

@Entity({
  name: 'wishlists',
})
@Index(['wishlistableId', 'wishlistableType'])
export class WishlistEntity extends EntityRelationalHelper implements Wishlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, {
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @Column({ type: 'uuid', name: 'wishlistable_id' })
  wishlistableId: string;

  @Column({ name: 'wishlistable_type' })
  wishlistableType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
