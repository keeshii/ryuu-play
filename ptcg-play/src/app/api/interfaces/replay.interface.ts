import { Response } from './response.interface';
import { ReplayInfo, UserInfo } from 'ptcg-server';

export interface ReplaySearch {
  page: number;
  query: string;
}

export interface ReplayResponse extends Response {
  replayData: string;
}

export interface ReplayListResponse extends Response {
  replays: ReplayInfo[];
  users: UserInfo[];
  total: number;
}
