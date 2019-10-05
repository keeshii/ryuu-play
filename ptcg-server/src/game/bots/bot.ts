import { Main } from '../core/main';
import { GameConnection } from '../core/game';
import { User } from '../../storage';

export interface Bot {
  user: User;
  main: Main;
  createGame(): GameConnection;
  joinGame(gameId: number): GameConnection;
  playGame(game: GameConnection, deck: string[]): void;
}
