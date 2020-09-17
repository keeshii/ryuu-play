import { GamePhase } from '../../game';
import { Rank } from "./rank.enum";

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

export interface ClientInfo {
  clientId: number;
  userId: number;
}

export interface CoreInfo {
  clientId: number;
  clients: ClientInfo[],
  users: UserInfo[],
  games: GameInfo[]
}

export interface GameState {
  gameId: number;
  stateData: string;
  clientIds: number[],
}

export interface UserInfo {
  connected: boolean;
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
