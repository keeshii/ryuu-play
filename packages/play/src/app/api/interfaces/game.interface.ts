import { Response } from './response.interface';
import { PlayerStats } from '@ptcg/common';

export interface PlayerStatsResponse extends Response {
  playerStats: PlayerStats[];
}
