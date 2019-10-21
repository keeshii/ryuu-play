import { GamePhase } from "../store/state/state";

export interface PlayerInfo {
  clientId: number;
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
  clientId: number;
  userId: number;
  name: string;
  ranking: number;
}

export interface LobbyInfo {
  users: UserInfo[],
  games: GameInfo[]
}
