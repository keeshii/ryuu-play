import { GameWinner } from '../../game';

export interface MatchInfo {
  matchId: number;
  player1Id: number;
  player2Id: number;
  ranking1: number;
  ranking2: number;
  rankingStake1: number;
  rankingStake2: number;
  winner: GameWinner;
  created: number;
}
