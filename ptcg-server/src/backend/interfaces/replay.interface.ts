import { ReplayPlayer, GameWinner } from "../../game";

export interface ReplayInfo {
  replayId: number;
  name: string;
  player1: ReplayPlayer;
  player2: ReplayPlayer;
  winner: GameWinner;
  created: number;
}
