import { GameWinner } from '../../game';
import { UserInfo } from './core.interface';

export interface ReplayInfo {
  replayId: number;
  name: string;
  player1: UserInfo;
  player2: UserInfo;
  winner: GameWinner;
  created: number;
}

export interface ReplayImport {
  name: string;
  replayData: string;
}
