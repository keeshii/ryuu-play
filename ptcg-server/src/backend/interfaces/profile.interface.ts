import { GameWinner } from "../../game";
import { UserInfo } from "./core.interface";

export interface MatchInfo {
  matchId: number;
  player1: UserInfo;
  player2: UserInfo;
  winner: GameWinner;
  rankingStake: number;
  created: number;
}
