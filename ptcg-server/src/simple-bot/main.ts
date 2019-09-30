import { Bot, Game } from '../game';
import { User } from '../storage';

export class SimpleBot implements Bot {

  constructor(
    public user: User,
    public game: Game
  ) { }

  public createTable(): number {
    return this.game.createTable(this.user);
  }

  public joinTable(tableId: number): void {
    return;
  }

  public playTable(tableId: number, deck: string[]): void {
    return;
  }

}
