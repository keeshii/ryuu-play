import { Response } from './response.interface';
import { RankingInfo } from 'ptcg-server';

export interface RankingResponse extends Response {
  ranking: RankingInfo[];
}
