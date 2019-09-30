import { Game } from '../core/game';
import { User } from '../../storage';

export interface Bot {
  user: User;
  game: Game;
  createTable(): number;
  joinTable(tableId: number): void;
  playTable(tableId: number, deck: string[]): void;
}
