import { GamePhase } from "../store/state/state";

export interface PlayerInfo {
  userId: number;
  name: string;
  prizes: number;
  deck: number;
}

export interface GameInfo {
  gameId: number;
  phase: GamePhase;
  turn: number;
  activePlayer: number;
  players: PlayerInfo[];
}

export interface UserInfo {
  userId: number;
  name: string;
  ranking: number;
  connected: boolean;
}

export interface LobbyInfo {
  users: UserInfo[],
  games: GameInfo[]
}
