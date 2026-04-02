import { UserTryout } from './user-tryout';
import { Question } from '../../questions/domain/question';
import { Option } from '../../options/domain/option';

export class UserAnswer {
  id: string;
  userTryout: UserTryout;
  question: Question;
  option: Option;
  createdAt: Date;
  updatedAt: Date;
}
