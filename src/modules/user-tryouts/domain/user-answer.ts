import { UserTryout } from './user-tryout';
import { Question } from '../../questions/domain/question';
import { Option } from '../../options/domain/option';

export class UserAnswer {
  id: string;
  userTryout: UserTryout;
  question: Question;
  option: Option;

  // Snapshots
  isCorrectSnapshot: boolean;
  weightSnapshot: number;
  pointsSnapshot: number;
  questionSnapshot: any;
  optionSnapshot: any;

  createdAt: Date;
  updatedAt: Date;
}
