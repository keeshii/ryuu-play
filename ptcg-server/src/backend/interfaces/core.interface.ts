import { GamePhase, State } from '../../game';
import { Rang } from '../../storage';

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
  name: string;
  ranking: number;
  rang: Rang;
  avatarFile: string;
}

export interface CoreInfo {
  clientId: number;
  users: ClientInfo[],
  games: GameInfo[]
}

export interface GameState {
  gameId: number;
  state: State;
  users: ClientInfo[]
}
