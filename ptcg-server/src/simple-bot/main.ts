import { Bot, Game, Table } from '../game';
import { User } from '../storage';

export class SimpleBot implements Bot {

  constructor(
    public user: User,
    public game: Game
  ) { }

  public createTable(): Table {
    return this.game.createTable(this.user);
  }

  public joinTable(table: Table): void {
    table.join(this.user);
  }

  public playTable(table: Table, deck: string[]): void {
    table.startPlay(this.user, deck);
  }

}
