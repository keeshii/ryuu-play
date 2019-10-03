import { Bot, Main, Game } from '../game';
import { User } from '../storage';

export class SimpleBot implements Bot {

  constructor(
    public user: User,
    public main: Main
  ) { }

  public createGame(): Game {
    return this.main.createGame(this.user);
  }

  public joinGame(table: Game): void {
    table.join(this.user);
  }

  public playGame(game: Game, deck: string[]): void {
    game.play(this.user, deck);
  }

}
