import { User } from '../../users/domain/user';

export class Notification {
  id: string;
  user: User;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
