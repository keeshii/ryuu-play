import { Game } from '../core/game';
import { Table } from '../core/table';
import { User } from '../../storage';

export interface Bot {
  user: User;
  game: Game;
  createTable(): Table;
  joinTable(table: Table): void;
  playTable(table: Table, deck: string[]): void;
}
