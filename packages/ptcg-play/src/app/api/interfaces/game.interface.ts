import { Response } from './response.interface';
import { PlayerStats } from '@ryuu-play/ptcg-server';

export interface PlayerStatsResponse extends Response {
  playerStats: PlayerStats[];
}
