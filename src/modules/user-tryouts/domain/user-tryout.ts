import { ApiProperty } from '@nestjs/swagger';
import { Tryout } from '../../tryouts/domain/tryout';
import { User } from '../../users/domain/user';

export enum UserTryoutStatusEnum {
  inProgress = 'in_progress',
  completed = 'completed',
  abandoned = 'abandoned',
}

export class UserTryout {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Tryout })
  tryout: Tryout;

  @ApiProperty()
  startTime: Date;

  @ApiProperty({ nullable: true })
  endTime: Date | null;

  @ApiProperty()
  totalScore: number;

  @ApiProperty({ enum: UserTryoutStatusEnum })
  status: UserTryoutStatusEnum;

  @ApiProperty()
  isPassed?: boolean;

  @ApiProperty()
  durationInSeconds?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;
}
