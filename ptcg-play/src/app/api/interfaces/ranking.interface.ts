import { Response } from './response.interface';
import { RankingInfo } from 'ptcg-server';

export interface RankingSearch {
  page: number;
  query: string;
}

export interface RankingResponse extends Response {
  ranking: RankingInfo[];
  total: number;
}
