import { Response } from './response.interface';
import { UserInfo, MatchInfo } from '@ptcg/common';

export interface ProfileResponse extends Response {
  user: UserInfo;
}

export interface MatchHistoryResponse extends Response {
  matches: MatchInfo[];
  users: UserInfo[];
  total: number;
}
