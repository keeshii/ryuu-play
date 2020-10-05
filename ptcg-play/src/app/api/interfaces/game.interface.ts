import { Response } from './response.interface';
import { PlayerStats } from 'ptcg-server';

export interface PlayerStatsResponse extends Response {
  playerStats: PlayerStats[];
}
