import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/domain/user';

export class Rating {
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
  rateableId: string;

  @ApiProperty({
    type: String,
    description: 'The type of the related model (e.g., tryouts)',
  })
  rateableType: string;

  @ApiProperty({
    type: Number,
    minimum: 1,
    maximum: 5,
  })
  score: number;

  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
  })
  review?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
