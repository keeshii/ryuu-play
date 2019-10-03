import { Main } from '../core/main';
import { Game } from '../core/game';
import { User } from '../../storage';

export interface Bot {
  user: User;
  main: Main;
  createGame(): Game;
  joinGame(table: Game): void;
  playGame(table: Game, deck: string[]): void;
}
