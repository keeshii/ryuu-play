import { Response } from './response.interface';
import { User } from '../../shared/session/user.interface';

export interface ProfileResponse extends Response {
  user: User;
}
