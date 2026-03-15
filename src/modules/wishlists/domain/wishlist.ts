import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class Wishlist {
  @ApiProperty({
    type: String,
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    type: () => User,
  })
  user?: User;

  @ApiProperty({
    type: String,
    format: 'uuid',
    description: 'The ID of the related model (e.g., tryout id)',
  })
  wishlistableId: string;

  @ApiProperty({
    type: String,
    description: 'The type of the related model (e.g., tryouts)',
  })
  wishlistableType: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
