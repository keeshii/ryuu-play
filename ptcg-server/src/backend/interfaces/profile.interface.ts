import { GameWinner } from "../../game";

export interface MatchInfo {
  matchId: number;
  player1Id: number;
  player2Id: number;
  winner: GameWinner;
  rankingStake: number;
  created: number;
}
