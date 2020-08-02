import { Response } from './response.interface';
import { UserInfo } from 'ptcg-server';

export interface ProfileResponse extends Response {
  user: UserInfo;
}
