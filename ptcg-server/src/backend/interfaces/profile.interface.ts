import { Rank } from "./rank.enum";
import { GameWinner } from "../../game";

export interface UserInfo {
  clientIds: number[];
  userId: number;
  name: string;
  email: string;
  ranking: number;
  rank: Rank;
  registered: number;
  lastSeen: number;
  lastRankingChange: number;
  avatarFile: string;
}

export interface MatchInfo {
  matchId: number;
  player1: UserInfo;
  player2: UserInfo;
  winner: GameWinner;
  rankingStake: number;
  created: number;
}
